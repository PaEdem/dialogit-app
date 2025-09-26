<!-- src\views\NewDialog.vue -->
<template>
  <div class="layout col-c-c">
    <div class="title">Luo uusi dialogi</div>
    <form
      @submit.prevent="handleCreateDialog"
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
      <div class="submit-wrap">
        <router-link
          to="/dialogs"
          class="btn blue"
          aria-label="Вернуться ко всем диалогам"
        >
          <span class="material-symbols-outlined icon">cancel</span>
          Peruuta
        </router-link>
        <button
          class="btn tiffany"
          type="submit"
          :disabled="!isFormValid || trainingStore.isLoading"
        >
          <span class="material-symbols-outlined icon">save</span>
          Tallenna
        </button>
      </div>
    </form>

    <p
      v-if="errorMessage"
      class="message error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTrainingStore } from '../stores/trainingStore';

const router = useRouter();
const trainingStore = useTrainingStore();

const form = ref({
  topic: '',
  words: '',
  level: 'A1',
  replicas: 8,
});
const errorMessage = ref('');
const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];
const isFormValid = computed(() => form.value.topic.trim() !== '');

const handleCreateDialog = async () => {
  errorMessage.value = '';
  // Передаем параметры формы напрямую в action
  const newDialogId = await trainingStore.generateAndCreateDialog(form.value);

  if (newDialogId) {
    router.push({ name: 'view-dialog', params: { id: newDialogId } });
  } else {
    errorMessage.value = 'Произошла ошибка при создании диалога. Попробуйте ещё раз.';
  }
};
</script>

<style scoped>
.dialog-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  background-color: var(--tiffany-90);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--grey-30);
}
.submit-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--tiffany-80);
  border-radius: 4px;
}
.message {
  font-size: var(--text);
  font-style: italic;
  font-weight: 500;
  color: var(--red-20);
  text-align: center;
  padding: 1rem 0;
  margin: auto;
}
.error {
  color: var(--red-20);
}
@media (max-width: 1280px) {
  .dialog-form {
    width: 50%;
  }
}
</style>
