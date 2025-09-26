<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Финский текст, русский перевод и финская речь. Учи построчно."
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
  // +1 чтобы показать текущую строчку
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value + 1),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  await dialogStore.fetchDialogById(props.id);
  // Запускаем тренировку только после того, как диалог точно загружен
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<style scoped>
/* Оставляем только стили для контента */
.panel {
  flex: 1;
  padding: 0 2rem;
  overflow-y: auto;
  height: 100%;
}
.dialog-text-container {
  display: flex;
  width: 100%;
  height: 100%; /* Важно для скролла */
  overflow-y: hidden;
}
.text {
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 400;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--grey-b);
  line-height: 1.5;
}
.finnish {
  font-weight: 500;
  color: var(--title);
}
.russian {
  color: var(--subtitle);
}
</style>
