<!-- src\views\NewDialog.vue -->
<template>
  <div class="new-dialog-view">
    <h2 class="title">Luo uusi dialogi</h2>
    <form
      @submit.prevent="createDialog"
      class="dialog-form"
    >
      <div class="form-group">
        <label for="topic">Тема диалога:</label>
        <input
          id="topic"
          v-model="form.topic"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="words">Обязательные слова (через запятую):</label>
        <input
          id="words"
          v-model="form.words"
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="level">Уровень сложности:</label>
        <select
          id="level"
          v-model="form.level"
          required
        >
          <option
            v-for="level in levels"
            :key="level"
            :value="level"
          >
            {{ level }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="replicas">Количество реплик:</label>
        <input
          id="replicas"
          v-model.number="form.replicas"
          type="number"
          min="2"
          max="20"
          required
        />
      </div>

      <button
        class="btn blue submit-btn"
        type="submit"
        :disabled="!isFormValid"
      >
        <span class="material-symbols-outlined icon"> save </span>
        Tallenna
      </button>
    </form>
    <p
      v-if="statusMessage"
      class="message"
      :class="{ error: isError }"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/store';

const router = useRouter();
const store = useStore();

const form = ref({
  topic: '',
  words: '',
  level: 'A1',
  replicas: 8,
});

const statusMessage = ref('');
const isError = ref(false);

const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];

const isFormValid = computed(() => form.value.topic.trim() !== '');

// GENERATE DIALOG
const generateDialog = async () => {
  const prompt = store.getPromptForNewDialog();
  await store.askGemini(prompt);
  const cleanJsonString = store.geminiResult.trim().replace(/```json|```/g, '');
  const jsonResponse = JSON.parse(cleanJsonString);
  return {
    title: form.value.topic,
    level: form.value.level,
    fin: jsonResponse.fin,
    rus: jsonResponse.rus,
    options: jsonResponse.options,
  };
};

const createDialog = async () => {
  statusMessage.value = 'Генерируем диалог... Это может занять некоторое время.';
  isError.value = false;

  const topic = form.value.topic[0].toUpperCase() + form.value.topic.slice(1);

  store.topic = topic;
  // store.topic = form.value.topic;
  store.words = form.value.words;
  store.level = form.value.level;
  store.replicas = form.value.replicas;
  try {
    const dialogData = await generateDialog();
    // SAVE DIALOG TO FIRESTORE
    if (dialogData) {
      const dialogId = await store.saveDialogToFS(dialogData);
      if (dialogId) {
        statusMessage.value = 'Диалог успешно создан и сохранён!';
        router.push({ name: 'view-dialog', params: { id: dialogId } });
      } else {
        throw new Error('Не удалось сохранить диалог в Firestore.');
      }
    } else {
      throw new Error('Не удалось сгенерировать диалог с Gemini.');
    }
  } catch (e) {
    console.error('Ошибка при создании диалога:', e.message);
    statusMessage.value = 'Произошла ошибка при создании диалога. Попробуйте ещё раз.';
    isError.value = true;
  }
};
</script>

<style scoped>
.new-dialog-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
}
.dialog-form {
  display: flex;
  flex-direction: column;
  width: 30%;
  margin: 2rem auto;
  background-color: var(--green-3);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.85rem;
  font-weight: 400;

  color: var(--text);
}
.submit-btn {
  margin: 0 0 0 auto;
}
input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--grey-b);
  border-radius: 4px;
}
.message {
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 500;
  color: var(--title);
  text-align: center;
  padding: 1rem 0;
  margin: auto;
}
.error {
  color: var(--red);
}
@media (max-width: 1280px) {
  .dialog-form {
    width: 50%;
  }
}
</style>
