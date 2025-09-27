// src/stores/trainingStore.js
import { defineStore } from 'pinia';
import { marked } from 'marked';
import { useDialogStore } from './dialogStore';
import { useUiStore } from './uiStore';
import { fetchGeminiResponse } from '../services/geminiService'; // Наш новый сервис

export const useTrainingStore = defineStore('training', {
  state: () => ({
    currentLineIndex: 0,
    recognition: null,
    isMicActive: false,
    recognitionText: '',
    geminiResult: '',
    isLoading: false,
  }),
  getters: {
    currentQuizOptions(state) {
      const dialogStore = useDialogStore();
      const dialog = dialogStore.currentDialog;
      if (!dialog || !dialog.options || !dialog.options[state.currentLineIndex]) {
        return [];
      }
      const correctAnswer = { text: dialog.rus[state.currentLineIndex], correct: true };
      const incorrectOptions = dialog.options[state.currentLineIndex].map((o) => ({ text: o, correct: false }));
      const allOptions = [correctAnswer, ...incorrectOptions];
      // Простое и эффективное перемешивание
      return allOptions.sort(() => Math.random() - 0.5);
    },
  },
  actions: {
    // --- Training Flow ---
    startLevel() {
      this.currentLineIndex = 0;
      this.resetLineState();
      setTimeout(() => this.playCurrentLineAudio(), 1000);
    },
    nextLine() {
      const dialogStore = useDialogStore();
      if (this.currentLineIndex < dialogStore.currentDialog.fin.length - 1) {
        this.currentLineIndex++;
        this.resetLineState();
        this.playCurrentLineAudio();
      } else {
        const uiStore = useUiStore();
        uiStore.showModal();
      }
    },
    repeatLevel() {
      this.startLevel();
    },
    resetLineState() {
      this.recognitionText = '';
      this.geminiResult = '';
    },

    // --- Media and Recognition ---
    playCurrentLineAudio() {
      const dialogStore = useDialogStore();
      const text = dialogStore.currentDialog?.fin[this.currentLineIndex];
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fi-FI';
        speechSynthesis.speak(utterance);
      }
    },

    /**
     * Воспроизводит любой переданный финский текст.
     * @param {string} text - Текст для воспроизведения.
     */
    playText(text) {
      if (!text) return;
      // Останавливаем предыдущее воспроизведение, если оно есть
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fi-FI';
      speechSynthesis.speak(utterance);
    },

    // ACTION ДЛЯ МИКРОФОНА
    toggleSpeechRecognition() {
      // Если распознавание уже активно, останавливаем его
      if (this.recognition) {
        this.recognition.stop();
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Распознавание речи не поддерживается в этом браузере.');
        return;
      }

      const dialogStore = useDialogStore();
      const currentDialog = dialogStore.currentDialog;
      if (!currentDialog) return;

      const finText = currentDialog.fin[this.currentLineIndex];
      const rusText = currentDialog.rus[this.currentLineIndex];
      const level = currentDialog.level;

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fi-FI';
      this.recognition.continuous = false; // Лучше false, чтобы он останавливался после первой фразы
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isMicActive = true;
        this.recognitionText = 'Kuunnellaan...';
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.recognitionText = transcript;

        // Сразу после получения результата можно запустить проверку
        // Это опционально, но делает процесс более гладким
        this.checkUserTranslation(rusText, finText, level);
      };

      this.recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        this.recognitionText = 'Произошла ошибка';
      };

      this.recognition.onend = () => {
        this.isMicActive = false;
        this.recognition = null;
      };

      this.recognition.start();
    },

    // --- AI Integration ---
    async generateAndCreateDialog(creationParams) {
      this.isLoading = true;
      try {
        const prompt = this.getPromptForNewDialog(creationParams);
        const responseText = await fetchGeminiResponse(prompt);
        // const dialogData = JSON.parse(responseText);
        const cleanJsonString = responseText.trim().replace(/```json|```/g, '');
        const dialogData = JSON.parse(cleanJsonString);
        // Передаем сгенерированные данные и параметры формы в dialogStore
        const dialogStore = useDialogStore();
        const newDialogId = await dialogStore.createDialog(dialogData, creationParams);
        return newDialogId;
      } catch (error) {
        console.error('Полный цикл генерации и создания диалога провалился:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchDialogAnalysis() {
      const dialogStore = useDialogStore();
      const dialog = dialogStore.currentDialog;
      if (!dialog) return;

      this.isLoading = true;
      this.geminiResult = '';
      try {
        const fullDialogText = dialog.fin.join('\n');
        const prompt = this.getPromptInfo(fullDialogText, dialog.level);
        const rawResult = await fetchGeminiResponse(prompt);
        // Сразу форматируем в HTML здесь, в сторе
        this.geminiResult = marked.parse(rawResult);
      } catch (error) {
        console.error('Ошибка получения анализа диалога:', error);
        this.geminiResult = '<p>Не удалось загрузить анализ. Попробуйте еще раз.</p>';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Запускает проверку перевода пользователя через AI.
     * @param {string} rusText - Оригинальный русский текст.
     * @param {string} finText - Правильный финский текст.
     * @param {string} level - Уровень сложности.
     */
    async checkUserTranslation(rusText, finText, level) {
      this.isLoading = true;
      this.geminiResult = '';
      try {
        const prompt = this.getPromptForTranslation(rusText, finText, level);
        this.geminiResult = await fetchGeminiResponse(prompt);
      } catch (error) {
        console.error('Ошибка проверки перевода:', error);
        this.geminiResult = 'Не удалось проверить перевод. Попробуйте еще раз.';
      } finally {
        this.isLoading = false;
      }
    },

    getPromptForNewDialog(params) {
      const { topic, level, replicas, words } = params;
      return `Create a coherent short dialogue in Finnish on the topic of "${topic}", with a parallel Russian translation for each line. The Finnish dialogue should be at the language proficiency level ${level}, using simple structures and vocabulary appropriate for that level. The entire dialogue must consist of exactly ${replicas} replicas (lines spoken by alternating speakers, like Person A and Person B). Incorporate all the following Finnish words naturally into the dialogue: ${words}.
      
      For each Finnish replica, you must also generate three incorrect but plausible Russian translations. These incorrect options should be plausible distractors for a language learner, for example by using words that sound similar but have different meanings, incorrect grammar, or a contextually wrong translation.

      Output the response strictly in JSON format with three keys: "fin", "rus", and "options". Do not include any additional text, explanations, or keys in the JSON.
      
      Example output format:
      {
        "fin": ["Moi.", "Mitä kuuluu?"],
        "rus": ["Привет.", "Как дела?"],
        "options": [
          ["Мой.", "Пока.", "Доброе утро."],
          ["Что включено?", "Как твое имя?", "Куда ты идешь?"]
        ]
      }`;
    },

    /**
     * Формирует промпт для оценки перевода пользователя.
     */
    getPromptForTranslation(rusText, finText, level) {
      return `
        You are an expert Finnish language tutor specializing in dialogue translations. Your task is to evaluate a user's spoken Finnish translation of a Russian dialogue line by comparing it to the provided correct Finnish version taking into account the language level of the user of the corresponding ${level}. You will receive three inputs:

        Original Russian: ${rusText}.
        Correct Finnish: ${finText}.
        User's Spoken Finnish (transcription): ${this.recognitionText}.
        
        Analyze the user's transcription for semantic accuracy, naturalness, and key errors in meaning or phrasing. Ignore the presence or absence of punctuation marks, capital letters, and pauses.

        If the meaning is accurately conveyed (minor pronunciation/word choice issues are okay if intent is clear): Say something like "Отлично, смысл понятен!"
        
        If there are small errors (e.g., wrong word but overall meaning intact): Point out 1-2 specific issues briefly, e.g., "Хорошо, но вместо 'hyvää' лучше 'hyvin' для точности."
        
        If the meaning doesn't match: State "Смысл не тот" and give a short suggestion on how to say it better, e.g., "Смысл не тот — попробуй: [brief correct phrasing]."

        Respond ONLY in Russian, in 2-3 sentences maximum. Keep feedback encouraging and concise.
      `;
    },

    /**
     * Формирует промпт для получения лингвистической справки по диалогу.
     */
    getPromptInfo(fullDialogText, level) {
      if (!fullDialogText || fullDialogText.trim().length === 0) {
        return 'Недостаточно данных для анализа.';
      }
      return `
        You are a Finnish language expert specializing in linguistic analysis. Analyze the following dialogue in Finnish, assuming the user has a ${level} proficiency level.
        Provide a concise analysis in Russian, suitable for a learner at this level.
        Focus the analysis on the most interesting and non-obvious linguistic features, including:
           1.  **Interesting Vocabulary:** Identify unique or culturally specific words/phrases. Explain their meaning, usage, and why they are interesting for a learner.
           2.  **Grammatical Features:** Highlight notable grammatical structures, such as case usage, verb conjugations, or sentence structures. Explain their function and impact in simple terms.
        Do NOT include a long introductory sentence. Do NOT quote full sentences from the dialogue. Mention words or grammatical features and provide a brief explanation.
        Format the output strictly using Markdown headings and bullet points for readability.
        Dialogue: ${fullDialogText}
      `;
    },
  },
});
