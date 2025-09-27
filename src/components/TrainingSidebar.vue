<template>
  <div class="training-sidebar-content">
    <p class="description">{{ description }}</p>
    <div class="controls">
      <button
        class="btn-control"
        @click="trainingStore.repeatLevel()"
        aria-label="Повторить уровень"
      >
        <span class="material-symbols-outlined icon">repeat</span>
        Повторить диалог
      </button>
      <button
        class="btn-control"
        @click="trainingStore.playCurrentLineAudio()"
        aria-label="Повторить реплику"
      >
        <span class="material-symbols-outlined icon">repeat_one</span>
        Повторить реплику
      </button>
      <button
        class="btn-control play"
        @click="trainingStore.nextLine()"
        aria-label="Следующая реплика"
      >
        <span class="material-symbols-outlined icon">play_arrow</span>
        Следующая реплика
      </button>
      <slot name="extra-controls"></slot>
      <router-link
        :to="{ name: 'view-dialog', params: { id: dialogId } }"
        class="btn-control"
        aria-label="Закончить тренировку"
      >
        <span class="material-symbols-outlined icon">output_circle</span>
        Закончить тренировку
      </router-link>
    </div>
    <div class="grow"></div>
  </div>
</template>

<script setup>
import { useTrainingStore } from '../stores/trainingStore';

defineProps({
  description: { type: String, required: true },
  dialogId: { type: String, required: true },
});

const trainingStore = useTrainingStore();
</script>

<style scoped>
.training-sidebar-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Занимает всё доступное место в сайдбаре */
}
.description {
  font-size: var(--subtext);
  color: var(--tiffany-10);
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.4;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
