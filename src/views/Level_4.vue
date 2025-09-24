<!-- src\styles\colors.css -->
<template>
  <div
    v-if="dialog"
    class="dialog-view level-view"
  >
    <div class="sidebar level-sidebar">
      <div class="dialog-title">{{ dialog.title }}</div>
      <div class="description">Только финская речь.<br />Выбери правильный вариант.</div>
      <div class="controls">
        <button
          class="btn-control"
          @click="repeatLevel"
        >
          <span class="material-symbols-outlined icon">repeat</span>
        </button>
        <router-link :to="{ name: 'view-dialog', params: { id: dialog.id } }">
          <button class="btn-control">
            <span class="material-symbols-outlined icon">fast_forward</span>
          </button>
        </router-link>
      </div>
      <div class="grow"></div>
      <router-link
        v-if="dialog"
        to="/dialogs"
        class="btn-menu"
      >
        <span class="material-symbols-outlined icon">chat</span>
        kaikki dialogit
      </router-link>
    </div>
    <div
      class="dialog-content quiz-content"
      v-if="dialog"
    >
      <div class="options-container">
        <button
          class="btn-quiz"
          v-for="(option, index) in quizOptions"
          :key="lineIndex + '-' + index"
          @click="handleAnswer(option)"
          :class="{
            correct: answerStatus[option.text] === 'correct',
            incorrect: answerStatus[option.text] === 'incorrect',
          }"
          :disabled="answerStatus[option.text] === 'incorrect'"
        >
          {{ option.text }}
        </button>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <modal-end
      :show="store.showModal"
      @close="store.setShowModal(false)"
    >
      <template #header>
        <h3 class="title">Dialogi on ohi</h3>
      </template>
    </modal-end>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../stores/store';
import ModalEnd from '../components/ModalEnd.vue';

const route = useRoute();
const store = useStore();

const dialog = computed(() => store.currentDialog);
const length = computed(() => (dialog.value ? dialog.value.fin.length : 0));
const lineIndex = computed(() => store.currentLineIndex);
// const lineIndex = computed(() => store.currentLineIndex + 1);
const quizOptions = computed(() => store.currentQuizOptions);

// ✨ НОВОЕ СОСТОЯНИЕ ДЛЯ ОТСЛЕЖИВАНИЯ ОТВЕТОВ
const answerStatus = ref({});
const isAnswered = ref(false); // Блокировка повторных нажатий

// Сбрасываем статусы при смене реплики
watch(lineIndex, () => {
  answerStatus.value = {};
  isAnswered.value = false;
});

onMounted(() => {
  const pathSegments = route.path.split('/');
  const step = pathSegments[pathSegments.indexOf('training') + 1];
  store.setStep(step);

  store
    .getDialogById(route.params.id)
    .then(() => {
      if (dialog.value) {
        setTimeout(() => {
          store.startLevel(dialog.value);
        }, 1000);
      } else {
        console.error('Диалог не загружен');
      }
    })
    .catch((error) => {
      console.error('Ошибка при загрузке диалога:', error);
    });
});
const repeatLevel = () => {
  if (dialog.value) {
    store.repeatLevel(dialog.value);
  }
};
// const nextLine = () => {
//   if (dialog.value) {
//     store.nextLine(dialog.value);
//   }
//   if (lineIndex.value > length.value) {
//     store.setShowModal(true);
//   }
// };

// ✨ ОБНОВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ОТВЕТА
const handleAnswer = (option) => {
  if (isAnswered.value) return; // Если уже ответили, ничего не делаем

  if (option.correct) {
    isAnswered.value = true;
    answerStatus.value[option.text] = 'correct';

    setTimeout(() => {
      // Проверяем, не последняя ли это реплика
      if (lineIndex.value < length.value - 1) {
        store.nextLine(dialog.value);
      } else {
        store.setShowModal(true);
      }
    }, 1000);
  } else {
    answerStatus.value[option.text] = 'incorrect';
    // Повторяем текущую финскую фразу
    setTimeout(() => {
      store.playText(dialog.value.fin[lineIndex.value]);
    }, 500);
  }
};
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 30%;
}
.btn-control {
  font-family: 'Roboto Condensed', sans-serif;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 1rem;
  background: var(--text);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-control .icon {
  vertical-align: middle;
  font-size: 3rem;
  color: var(--pink);
}
.btn-control:hover {
  background: var(--green);
  color: var(--light);
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.btn-control:hover .icon {
  color: var(--light);
}
.btn-control.play {
  background: var(--border);
}
.btn-control.play:hover {
  background: var(--green);
}
.level-view {
  display: flex;
  height: calc(100vh - 60px);
}
.quiz-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem 1rem;
  width: 60%;
  margin: auto;
  aspect-ratio: 2 / 1;
}
.btn-quiz {
  font-family: 'Roboto Condensed', sans-serif;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  background: var(--back);
  color: var(--title);
  border-radius: 1rem;
  border: 1px solid var(--grey-b);
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s, border-color 0.3s;
}
.btn-quiz:hover {
  background: var(--border);
  color: var(--pink);
  border-radius: 1rem;
}
/* ✨ НОВЫЕ СТИЛИ ДЛЯ СТАТУСОВ */
.btn-quiz.correct {
  background-color: var(--green);
  color: white;
  border-color: var(--green);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
.btn-quiz.incorrect {
  background-color: var(--grey-l);
  color: var(--grey-b);
  border-color: var(--grey-b);
  cursor: not-allowed;
  opacity: 0.7;
}
.btn-quiz:disabled {
  pointer-events: none; /* Убираем hover-эффекты для заблокированных */
}
@media (max-width: 1280px) {
  .btn-quiz {
    font-size: 1.5rem;
  }
}
</style>
