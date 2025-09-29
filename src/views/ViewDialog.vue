<!-- \\src\views\ViewDialog.vue -->
<template>
  <DialogLayout>
    <template #sidebar-content>
      <button
        class="btn grey-light full"
        @click="getInfo"
        aria-label="Анализ диалога"
      >
        <span class="material-symbols-outlined icon">question_mark</span>
        Анализ диалога
      </button>
      <div class="play">
        <button
          class="btn grey-light pad-h-05"
          @click="listenDialog"
          aria-label="Прослушать весь диалог"
        >
          <span class="material-symbols-outlined icon">volume_up</span>
          Прослушать диалог
        </button>
        <button
          class="btn pink pad-h-05"
          @click="stopPlay"
        >
          <span class="material-symbols-outlined icon m-0">volume_off</span>
        </button>
      </div>

      <div class="grow"></div>
      <router-link
        v-for="level in trainingLevels"
        :key="level.name"
        :to="{ name: level.name, params: { id: props.id } }"
      >
        <button class="btn grey-light full">
          <span class="material-symbols-outlined icon">{{ level.icon }}</span>
          {{ level.text }}
        </button>
      </router-link>
      <div class="grow"></div>
      <button
        class="btn grey full"
        @click="handleDelete"
        aria-label="Удалить диалог"
      >
        <span class="material-symbols-outlined icon">delete</span>
        Удалить диалог
      </button>
    </template>
    <div class="dialog-title">
      <div class="subtitle ml-a ta-c">{{ dialog.title }}</div>
      <div class="dialog-level">{{ dialog.level }}</div>
    </div>
    <div class="scroll-container">
      <div
        v-for="(fin, index) in dialogStore.currentDialog.fin"
        :key="index"
        class="dialog-line"
      >
        <p class="finnish-text">{{ fin }}</p>
        <p class="russian-text">{{ dialogStore.currentDialog.rus[index] }}</p>
      </div>
    </div>
  </DialogLayout>

  <Teleport to="body">
    <Modal>
      <div v-html="trainingStore.geminiResult"></div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '../stores/uiStore';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import DialogLayout from '../components/DialogLayout.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();
const uiStore = useUiStore();
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();

const dialog = computed(() => dialogStore.currentDialog);
const trainingLevels = [
  { name: 'level-1', icon: 'transcribe', text: 'Учить построчно' },
  { name: 'level-2', icon: 'record_voice_over', text: 'Говори правильно' },
  { name: 'level-3', icon: 'translate', text: 'Переводи правильно' },
  { name: 'level-4', icon: 'hearing', text: 'Понимание на слух' },
];

onMounted(() => {
  dialogStore.fetchDialogById(props.id);
});
const handleDelete = async () => {
  const success = await dialogStore.deleteDialog(props.id);
  if (success) {
    router.push({ name: 'all-dialogs' });
  }
};
const listenDialog = () => {
  const dialog = dialogStore.currentDialog;
  if (!dialog) return;
  const fullText = dialog.fin.join('. ');
  trainingStore.playText(fullText);
};
const stopPlay = () => {
  trainingStore.stopSpeech();
};
const getInfo = async () => {
  await trainingStore.fetchDialogAnalysis();
  uiStore.showModal();
};
</script>

<style scoped>
.dialog-title {
  display: flex;
  justify-content: center;
}
.dialog-level {
  margin-left: auto;
  letter-spacing: 3px;
  font-weight: 400;
  font-size: var(--subtitle);
  color: var(--tiffany-20);
}
.ml-a {
  margin-left: auto;
}
.play {
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0.25rem;
}
.pad-h-05 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.scroll-container {
  padding-right: 1rem;
}
.dialog-line {
  border-bottom: 1px solid var(--grey-70);
}
.finnish-text {
  font-size: var(--text);
  font-weight: 500;
  color: var(--tiffany-20);
  margin: 0.75rem 0;
}
.russian-text {
  font-size: var(--subtext);
  font-style: italic;
  color: var(--winkle-40);
  margin: 0.75rem 0;
  padding-left: 2rem;
}
</style>
