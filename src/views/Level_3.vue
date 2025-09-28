<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description='Русский перевод. Жми "Microphone" и говори. Повторно нажами на "Microphone" и проверь правильность фразы на финском.'
        :mic-button="true"
      >
        <template #extra-controls>
          <button
            class="btn-control mic"
            @click="trainingStore.toggleSpeechRecognition()"
            :class="{ active: trainingStore.isMicActive }"
            aria-label="Записать перевод"
          >
            <span class="material-symbols-outlined icon">{{ trainingStore.isMicActive ? 'mic' : 'mic_off' }}</span>
            Микрофон {{ trainingStore.isMicActive ? 'ON' : 'OFF' }}
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
          v-if="trainingStore.geminiResult"
          class="gemini-result"
        >
          {{ trainingStore.geminiResult }}
        </p>
        <p
          v-else
          class="placeholder-text"
        >
          Нажмите на "Микрофон", чтобы проверить свой перевод...
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
          (Отличная работа! Можете начать заново или выбрать другую тренировку.)
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();

const lineIndex = computed(() => trainingStore.currentLineIndex);
const dialog = computed(() => dialogStore.currentDialog);

const visibleLines = computed(() => {
  if (!dialog.value) return { fin: [], rus: [] };
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  trainingStore.setCurrentTrainingType('level-3');
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.recognized-text-container {
  height: 80px;
  flex-shrink: 0; /* Не сжиматься */
  overflow-y: auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid var(--tiffany-70);
}
.recognized-text {
  font-size: var(--subtitle);
  font-weight: 500;
  color: var(--tiffany-20);
  text-align: center;
}
.placeholder-text {
  font-size: var(--subtext);
  font-style: italic;
  color: var(--grey-50);
}
.gemini-result {
  font-size: var(--text);
  font-style: italic;
  color: var(--red-20);
}
</style>
