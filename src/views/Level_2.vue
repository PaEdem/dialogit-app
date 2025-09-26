<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Финский текст, русский перевод и финская речь. Жми 'Microphone' и проверь произношение."
        :mic-button="true"
      >
        <template #extra-controls>
          <button
            class="btn-control mic"
            @click="trainingStore.toggleSpeechRecognition()"
            :class="{ active: trainingStore.isMicActive }"
            aria-label="Записать произношение"
          >
            <span class="material-symbols-outlined icon">mic</span>
          </button>
        </template>
      </TrainingSidebar>
    </template>

    <div class="content-wrapper">
      <div class="dialog-text-container">
        <div class="panel">
          <p
            class="finnish text"
            v-for="(line, index) in visibleLines.fin"
            :key="`fin-${index}`"
          >
            {{ line }}
          </p>
        </div>
        <div class="panel">
          <p
            class="russian text"
            v-for="(line, index) in visibleLines.rus"
            :key="`rus-${index}`"
          >
            {{ line }}
          </p>
        </div>
      </div>
      <div class="recognized-text-container">
        <p
          class="recognized-text"
          v-html="trainingStore.recognitionText"
        ></p>
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
import { computed, onMounted } from 'vue';
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

const lineIndex = computed(() => trainingStore.currentLineIndex);
const dialog = computed(() => dialogStore.currentDialog);

const visibleLines = computed(() => {
  if (!dialog.value) return { fin: [], rus: [] };
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value + 1),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<style scoped>
/* Оставляем только уникальные стили */
.btn-control.mic {
  background: var(--red);
}
.btn-control.mic:hover {
  background: var(--accent);
}
/* Стиль для активного состояния */
.btn-control.mic.active {
  background-color: var(--yellow);
  color: var(--title);
}
.btn-control.mic.active:hover {
  background-color: var(--yellow);
  opacity: 0.8;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dialog-text-container {
  display: flex;
  flex-grow: 1; /* Занимает всё доступное место */
  overflow-y: auto;
}
.panel {
  flex: 1;
  padding: 0 2rem;
}
.text {
  font-size: 1.1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--grey-b);
  line-height: 1.5;
}
.finnish {
  font-weight: 500;
  color: var(--title);
}
.russian {
  font-style: italic;
  color: var(--subtitle);
}

.recognized-text-container {
  height: 80px; /* Фиксированная высота */
  flex-shrink: 0; /* Не сжиматься */
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--back);
  border-top: 1px solid var(--grey-b);
}
.recognized-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--title);
  text-align: center;
}
</style>
