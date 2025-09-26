// старый файл
//src/stores/store.js
import { defineStore } from 'pinia';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { compareAndFormatTexts } from '../utils/compareTexts.js';

export const useStore = defineStore('store', {
  state: () => ({
    // loading: false,
    // showModal: false,
    // allDialogs: [],
    // currentDialog: null,
    // topic: '',  удалено
    // words: '',  удалено
    // level: 'A1',  удалено
    // replicas: 8,  удалено
    // geminiResult: '',
    // step: '',  удалено
    // currentLineIndex: 0,
    // isMicActive: false,
    // recognitionText: '',
    // recognitionResult: null,
    // formattedRecognitionText: '',
    // recognition: null,
  }),
  getters: {
    // currentQuizOptions(state) {
    //   if (
    //     !state.currentDialog ||
    //     !state.currentDialog.options ||
    //     !state.currentDialog.options[state.currentLineIndex] ||
    //     !state.currentDialog.rus ||
    //     !state.currentDialog.rus[state.currentLineIndex]
    //   ) {
    //     return [];
    //   }
    //   const correctAnswer = {
    //     text: state.currentDialog.rus[state.currentLineIndex],
    //     correct: true,
    //   };
    //   const optionSet = state.currentDialog.options[state.currentLineIndex];
    //   const incorrectOptionsArray = Array.isArray(optionSet) ? optionSet : optionSet.values;
    //   if (!Array.isArray(incorrectOptionsArray)) {
    //     console.error('Не удалось извлечь массив неверных опций', incorrectOptionsArray);
    //     return [];
    //   }
    //   const incorrectOptions = incorrectOptionsArray.map((option) => ({
    //     text: option,
    //     correct: false,
    //   }));
    //   const allOptions = [correctAnswer, ...incorrectOptions];
    //   for (let i = allOptions.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    //   }
    //   return allOptions;
    // },
  },
  actions: {
    // playText(text) {
    //   const utterance = new SpeechSynthesisUtterance(text);
    //   utterance.lang = 'fi-FI';
    //   speechSynthesis.speak(utterance);
    // },
    // setStep(step) {  удалено
    //   this.step = step;
    // },
    // setShowModal(volume) {
    //   this.showModal = volume;
    // },
    // setCurrentDialog(volume) {
    //   this.currentDialog = volume;
    // },
    // saveDialogToLocalStorage(dialog) {
    //   try {
    //     const key = `dialog_${dialog.id}`;
    //     localStorage.setItem(key, JSON.stringify(dialog));
    //   } catch (e) {
    //     console.error('Ошибка сохранения в LocalStorage:', e);
    //   }
    // },
    // getDialogFromLocalStorage(id) {
    //   try {
    //     const key = `dialog_${id}`;
    //     const dialogData = localStorage.getItem(key);
    //     return dialogData ? JSON.parse(dialogData) : null;
    //   } catch (e) {
    //     console.error('Ошибка получения из LocalStorage:', e);
    //     return null;
    //   }
    // },
    // removeDialogFromLocalStorage(id) {
    //   try {
    //     const key = `dialog_${id}`;
    //     localStorage.removeItem(key);
    //   } catch (e) {
    //     console.error('Ошибка удаления из LocalStorage:', e);
    //   }
    // },
    // async deleteAndGoBack(id) {
    //   if (confirm('Вы уверены, что хотите удалить этот диалог?')) {
    //     try {
    //       await deleteDoc(doc(db, 'dialogs', id));
    //       this.removeDialogFromLocalStorage(id);
    //       return true;
    //     } catch (error) {
    //       console.error('Ошибка при удалении документа: ', error);
    //       alert('Произошла ошибка при удалении диалога.');
    //       return false;
    //     }
    //   }
    //   return false;
    // },
    // async getAllDialogsFromFS() {
    //   this.loading = true;
    //   this.allDialogs = [];

    //   const user = auth.currentUser;
    //   if (!user) {
    //     console.error('Пользователь не авторизован.');
    //     this.loading = false;
    //     return;
    //   }

    //   try {
    //     const dialogsCollection = collection(db, 'dialogs');
    //     const q = query(dialogsCollection, where('userId', '==', user.uid));
    //     const querySnapshot = await getDocs(q);
    //     this.allDialogs = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //   } catch (e) {
    //     this.loading = false;
    //     console.error('Ошибка при загрузке диалогов:', e.message);
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    // async getDialogById(id) {
    //   this.loading = true;
    //   this.currentDialog = null;

    //   const cachedDialog = this.getDialogFromLocalStorage(id);
    //   if (cachedDialog) {
    //     this.currentDialog = cachedDialog;
    //     this.loading = false;
    //     console.log('Диалог загружен из LocalStorage.');
    //     return;
    //   }

    //   try {
    //     const docRef = doc(db, 'dialogs', id);
    //     const docSnap = await getDoc(docRef);

    //     if (docSnap.exists()) {
    //       const dialogData = { id: docSnap.id, ...docSnap.data() };

    //       if (dialogData.options && dialogData.options[0] && dialogData.options[0].values) {
    //         dialogData.options = dialogData.options.map((item) => item.values);
    //       }

    //       this.currentDialog = dialogData;
    //       this.saveDialogToLocalStorage(dialogData);
    //     } else {
    //       console.error('Нет такого документа!');
    //     }
    //   } catch (e) {
    //     this.loading = false;
    //     console.error('Ошибка загрузки диалога:', e.message);
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    // async saveDialogToFS(dialogData) {
    //   this.loading = true;
    //   const user = auth.currentUser;
    //   if (!user) {
    //     console.error('Не удалось сохранить диалог: пользователь не авторизован.');
    //     this.loading = false;
    //     return null;
    //   }
    //   try {
    //     const dialogsCollection = collection(db, 'dialogs');
    //     const optionsForFirestore = dialogData.options.map((optionSet) => {
    //       return { values: optionSet };
    //     });

    //     const dataToSave = {
    //       ...dialogData,
    //       options: optionsForFirestore,
    //       userId: user.uid,
    //       createdAt: new Date(),
    //     };
    //     const newDialogRef = await addDoc(dialogsCollection, dataToSave);
    //     const newDialogId = newDialogRef.id;

    //     this.saveDialogToLocalStorage({ id: newDialogId, ...dataToSave, options: dialogData.options });

    //     return newDialogId;
    //   } catch (e) {
    //     console.error('Ошибка сохранения нового диалога:', e.message);
    //     return null;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    //     getPromptForNewDialog() {
    //       return `
    //         Create a coherent short dialogue in Finnish on the topic of "${this.topic}", with a parallel Russian translation for each line. The Finnish dialogue should be at the language proficiency level ${this.level}, using simple structures and vocabulary appropriate for that level. The entire dialogue must consist of exactly ${this.replicas} replicas (lines spoken by alternating speakers, like Person A and Person B). Incorporate all the following Finnish words naturally into the dialogue: ${this.words}.

    // For each Finnish replica, you must also generate three incorrect but plausible Russian translations. These incorrect options should be plausible distractors for a language learner, for example by using words that sound similar but have different meanings, incorrect grammar, or a contextually wrong translation.

    // Output the response strictly in JSON format with three keys: "fin", "rus", and "options".
    // - "fin": an array of strings containing the Finnish replicas.
    // - "rus": an array of strings containing the direct and correct Russian translations, corresponding to the "fin" array.
    // - "options": an array of arrays. Each inner array must correspond to a replica in the "fin" array and contain exactly three incorrect Russian translations for it.

    // Ensure the dialogue flows logically and remains on topic. Do not include any additional text, explanations, or keys in the JSON.

    // Example output format:
    // {
    //   "fin": [
    //     "Moi.",
    //     "Mitä kuuluu?"
    //   ],
    //   "rus": [
    //     "Привет.",
    //     "Как дела?"
    //   ],
    //   "options": [
    //     ["Мой.", "Пока.", "Доброе утро."],
    //     ["Что включено?", "Как твое имя?", "Куда ты идешь?"]
    //   ]
    // }
    //       `;
    //     },
    //     getPromptForTranslation(rusText, finText, level) {
    //       return `
    //         You are an expert Finnish language tutor specializing in dialogue translations. Your task is to evaluate a user's spoken Finnish translation of a Russian dialogue line by comparing it to the provided correct Finnish version taking into account the language level of the user of the corresponding ${level}. You will receive three inputs:

    //         Original Russian: ${rusText}.
    //         Correct Finnish: ${finText}.
    //         User's Spoken Finnish (transcription): ${this.recognitionText}.

    //         Analyze the user's transcription for semantic accuracy, naturalness, and key errors in meaning or phrasing. Ignore the presence or absence of punctuation marks, capital letters, and pauses.

    //         If the meaning is accurately conveyed (minor pronunciation/word choice issues are okay if intent is clear): Say something like "Отлично, смысл понятен!"
    //         If there are small errors (e.g., wrong word but overall meaning intact): Point out 1-2 specific issues briefly, e.g., "Хорошо, но вместо 'hyvää' лучше 'hyvin' для точности."
    //         If the meaning doesn't match: State "Смысл не тот" and give a short suggestion on how to say it better, e.g., "Смысл не тот — попробуй: [brief correct phrasing]."

    //         Respond ONLY in Russian, in 2-3 sentences maximum. Keep feedback encouraging and concise.
    //         `;
    //     },
    //     getPromptInfo(finText) {
    //       if (!finText || finText.trim().length === 0) {
    //         return 'Недостаточно данных для анализа.';
    //       }
    //       return `
    //         You are a Finnish language expert specializing in linguistic analysis. Analyze the following dialogue in Finnish, assuming the user has a ${this.level} proficiency level.
    //         Provide a concise analysis in Russian, suitable for a learner at this level.
    //         Focus the analysis on the most interesting and non-obvious linguistic features, including:
    //         1.  **Interesting Vocabulary:** Identify unique or culturally specific words/phrases. Explain their meaning, usage, and why they are interesting for a learner.
    //         2.  **Grammatical Features:** Highlight notable grammatical structures, such as case usage, verb conjugations, or sentence structures. Explain their function and impact in simple terms.
    //         Do NOT include a long introductory sentence. Do NOT quote full sentences from the dialogue. Mention words or grammatical features and provide a brief explanation.
    //         Format the output strictly using Markdown headings and bullet points for readability.
    //         Dialogue: ${finText}
    //       `;
    //     },
    // async askGemini(prompt) {
    //   this.geminiResult = '';
    //   this.loading = true;
    //   try {
    //     const geminiResponse = await this.getResponse(prompt);
    //     this.geminiResult = geminiResponse;
    //   } catch (e) {
    //     this.loading = false;
    //     console.error('askGemini: Ошибка при запросе к Gemini:', e.message);
    //     this.geminiResult = 'Извините, произошла ошибка при проверке. Попробуйте еще раз.';
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    // async getResponse(prompt) {
    //   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    //   const genAI = new GoogleGenerativeAI(API_KEY);
    //   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    //   try {
    //     const result = await model.generateContent(prompt);
    //     const response = result.response;
    //     const text = response.text();
    //     return text;
    //   } catch (e) {
    //     console.error('Ошибка при запросе к Gemini:', e.message);
    //     try {
    //       const groq = new Groq({
    //         apiKey: import.meta.env.VITE_GROQ_API_KEY,
    //         dangerouslyAllowBrowser: true,
    //       });
    //       const groqChatCompletion = await groq.chat.completions.create({
    //         messages: [
    //           {
    //             role: 'user',
    //             content: prompt,
    //           },
    //         ],
    //         model: 'llama3-8b-8192',
    //       });
    //       const groqText = groqChatCompletion.choices[0]?.message?.content || '';
    //       return groqText;
    //     } catch (e) {
    //       console.error('Ошибка при запросе к Groq:', e.message);
    //       throw e;
    //     }
    //   }
    // },
    // startLevel(dialog) {
    //   this.recText = '';
    //   this.recResult = null;
    //   this.formattedRecText = null;
    //   this.currentLineIndex = 0;
    //   this.geminiResult = '';
    //   if (this.step === 'level-1' || this.step === 'level-2' || this.step === 'level-4') {
    //     this.playText(dialog.fin[this.currentLineIndex]);
    //   }
    // },
    // nextLine(dialog) {
    //   this.recText = '';
    //   this.recResult = null;
    //   this.formattedRecText = null;
    //   this.currentLineIndex++;
    //   this.geminiResult = '';
    //   if (this.step === 'level-1' || this.step === 'level-2' || this.step === 'level-4') {
    //     if (dialog.fin[this.currentLineIndex]) {
    //       this.playText(dialog.fin[this.currentLineIndex]);
    //     }
    //   }
    // },
    // repeatLevel(dialog) {
    //   this.recText = '';
    //   this.recResult = null;
    //   this.formattedRecText = null;
    //   this.currentLineIndex = 0;
    //   this.startLevel(dialog);
    //   this.geminiResult = '';
    // },
    // repeatLine(dialog) {
    //   this.recText = '';
    //   this.recResult = null;
    //   this.formattedRecText = null;
    //   this.geminiResult = '';
    //   if (this.step === 'level-1' || this.step === 'level-2') {
    //     this.playText(dialog.fin[this.currentLineIndex]);
    //   }
    // },
    toogleMic(dialog) {
      this.isMicActive = !this.isMicActive;
      if (this.isMicActive) {
        this.startRecognition(dialog);
      } else {
        this.stopRecognition();
      }
    },
    startRecognition(dialog) {
      this.recognitionText = '';
      this.recognitionResult = null;
      this.formattedRecognitionText = null;
      this.geminiResult = '';

      const finText = dialog.fin[this.currentLineIndex];
      const rusText = dialog.rus[this.currentLineIndex];
      const { level } = dialog;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('SpeechRecognition API не поддерживается в этом браузере');
        this.isMicActive = false;
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fi-FI';
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        const { formattedText, score } = compareAndFormatTexts(finText, transcript);

        this.recognitionText = transcript;
        this.recognitionResult = { score };
        this.formattedRecognitionText = formattedText;
      };

      this.recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
        this.isMicActive = false;
        this.recognition.stop();
      };

      this.recognition.onend = () => {
        this.isMicActive = false;
        this.recognition = null;

        if (this.step === 'level-3' && this.recognitionText.length > 0) {
          this.checkTranslation(rusText, finText, level);
        }
      };

      this.recognition.start();
    },
    stopRecognition() {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
    },
    // checkTranslation(rusText, finText, level) {
    //   const prompt = this.getPromptForTranslation(rusText, finText, level);
    //   this.askGemini(prompt);
    // },
  },
});
