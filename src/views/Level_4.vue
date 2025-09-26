<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Только финская речь. Выбери правильный вариант."
      >
        <template #extra-controls>
          <button
            class="btn-control"
            disabled
          >
            <span class="material-symbols-outlined icon">mic_off</span>
          </button>
        </template>
      </TrainingSidebar>
    </template>

    <div class="quiz-content">
      <div class="options-container">
        <button
          class="btn-quiz"
          v-for="(option, index) in trainingStore.currentQuizOptions"
          :key="`${trainingStore.currentLineIndex}-${index}`"
          @click="handleAnswer(option)"
          :class="{
            correct: answerStatus[option.text] === 'correct',
            incorrect: answerStatus[option.text] === 'incorrect',
          }"
          :disabled="answerStatus[option.text] === 'incorrect' || isAnswered"
        >
          {{ option.text }}
        </button>
      </div>
    </div>
  </DialogLayout>

  <Teleport to="body">
    <ModalEnd
      :show="uiStore.isModalActive"
      @close="uiStore.hideModal()"
    >
      <template #header><h3 class="title">Dialogi on ohi</h3></template>
    </ModalEnd>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import { useUiStore } from '../stores/uiStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import ModalEnd from '../components/ModalEnd.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
const uiStore = useUiStore();

const answerStatus = ref({});
const isAnswered = ref(false);

watch(
  () => trainingStore.currentLineIndex,
  () => {
    answerStatus.value = {};
    isAnswered.value = false;
  }
);

const handleAnswer = (option) => {
  if (isAnswered.value) return;

  if (option.correct) {
    isAnswered.value = true;
    answerStatus.value[option.text] = 'correct';
    setTimeout(() => {
      trainingStore.nextLine();
    }, 1000);
  } else {
    answerStatus.value[option.text] = 'incorrect';
    trainingStore.playCurrentLineAudio();
  }
};

onMounted(async () => {
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<style scoped>
/* Оставляем только уникальные стили */
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
  gap: 2rem;
  width: 80%;
  max-width: 900px;
}
.btn-quiz {
  font-family: 'Roboto Condensed', sans-serif;
  height: 120px; /* Фиксированная высота для единообразия */
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  background: var(--back);
  color: var(--title);
  border-radius: 1rem;
  border: 1px solid var(--grey-b);
  transition: all 0.2s ease-in-out;
}
.btn-quiz:not(:disabled):hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: var(--pink);
}
.btn-quiz.correct {
  background-color: var(--green);
  color: white;
  border-color: var(--green);
  transform: scale(1.05);
}
.btn-quiz.incorrect {
  background-color: #fcebeb; /* Легкий красный фон */
  color: #c62828;
  border-color: #c62828;
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
