<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Финский текст, русский перевод и финская речь. Учи построчно."
      >
        <template #extra-controls>
          <button
            class="btn-control mic off"
            disabled
          >
            <span class="material-symbols-outlined icon">mic_off</span>
            Микрофон OFF
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
    <Modal>
      <div class="ohi">
        <h3 class="ohi-title">Harjoitus on ohi</h3>
        <div class="ohi-message">
          Hyvää työtä! Voit aloittaa alusta tai valita toisen harjoituksen.<br />
          <br />
          Отличная работа! Можете начать заново или выбрать другую тренировку.
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
// import { useUiStore } from '../stores/uiStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
// const uiStore = useUiStore();

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

<style scoped></style>
