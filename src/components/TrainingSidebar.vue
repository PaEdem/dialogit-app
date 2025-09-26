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
      </button>
      <button
        class="btn-control"
        @click="trainingStore.playCurrentLineAudio()"
        aria-label="Повторить реплику"
      >
        <span class="material-symbols-outlined icon">repeat_one</span>
      </button>
      <button
        class="btn-control play"
        @click="trainingStore.nextLine()"
        aria-label="Следующая реплика"
      >
        <span class="material-symbols-outlined icon">play_arrow</span>
      </button>
      <slot name="extra-controls"></slot>
      <router-link
        :to="{ name: 'view-dialog', params: { id: dialogId } }"
        class="btn-control"
        aria-label="Закончить тренировку"
      >
        <span class="material-symbols-outlined icon">fast_forward</span>
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
  font-size: 0.9rem;
  color: var(--subtitle);
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.4;
}
.controls {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
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
  color: var(--pink); /* Цвет для иконок */
}
.btn-control .icon {
  font-size: 3rem;
}
.btn-control:hover {
  background: var(--green);
  color: var(--light);
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.btn-control.play {
  background: var(--border);
}
.btn-control.play:hover {
  background: var(--green);
}
.grow {
  flex-grow: 1;
}
</style>
