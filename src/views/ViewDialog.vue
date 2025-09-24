<!-- src\views\ViewDialog.vue -->
<template>
  <div
    v-if="dialog"
    class="dialog-view"
  >
    <div class="sidebar">
      <div class="dialog-title">{{ dialog.title }}</div>
      <button
        class="btn-menu"
        @click="getInfo"
      >
        <span class="material-symbols-outlined icon">question_mark</span>
        Dialogin analyysi
      </button>
      <button
        class="btn-menu"
        @click="listenDialog"
      >
        <span class="material-symbols-outlined icon">brand_awareness</span>
        Kuuntele dialogia
      </button>
      <div class="grow"></div>
      <router-link :to="{ name: 'level-1', params: { id: dialog.id } }">
        <button class="btn-menu">
          <span class="material-symbols-outlined icon">transcribe</span>
          Kuuntele ja opi
        </button>
      </router-link>
      <router-link :to="{ name: 'level-2', params: { id: dialog.id } }">
        <button class="btn-menu">
          <span class="material-symbols-outlined icon">record_voice_over</span>
          Puhu ja tarkista
        </button>
      </router-link>
      <router-link :to="{ name: 'level-3', params: { id: dialog.id } }">
        <button class="btn-menu">
          <span class="material-symbols-outlined icon">translate</span>
          Käännä ja tarkista
        </button>
      </router-link>
      <router-link :to="{ name: 'level-4', params: { id: dialog.id } }">
        <button class="btn-menu">
          <span class="material-symbols-outlined icon">hearing</span>
          Kuuntele ja tarkista
        </button>
      </router-link>
      <div class="grow"></div>
      <router-link
        v-if="dialog"
        to="/dialogs"
        class="btn-menu"
      >
        <span class="material-symbols-outlined icon">chat</span>
        kaikki dialogit
      </router-link>
      <button
        class="btn-menu"
        @click="deleteAndGoBack"
      >
        <span class="material-symbols-outlined icon">delete</span>
        Poista dialogi
      </button>
    </div>
    <div class="dialog-content">
      <div class="scroll-container">
        <div
          v-for="(fin, index) in dialog.fin"
          :key="index"
          class="dialog-line"
        >
          <p class="finnish-text">{{ fin }}</p>
          <p class="russian-text">{{ dialog.rus[index] }}</p>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <modal
        :show="store.showModal && isGeminiResult"
        @close="store.setShowModal(false)"
      >
        <template #header>
          <h3 class="title">Лексика и грамматика</h3>
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../stores/store';
import Modal from '../components/Modal.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const dialog = computed(() => {
  return store.currentDialog;
});
const isGeminiResult = computed(() => {
  return !!store.geminiResult;
});

onMounted(() => {
  store.getDialogById(route.params.id);
  if (dialog.value) {
    store.isViewBatton = true;
    store.setCurrentDialog(dialog.value);
  }
});
const deleteAndGoBack = async () => {
  const success = await store.deleteAndGoBack(route.params.id);
  if (success) {
    router.push({ name: 'all-dialogs' });
  }
};
const listenDialog = () => {
  if (!dialog.value) return;
  const finText = dialog.value.fin.join('. ');
  store.playText(finText);
};
const getInfo = () => {
  if (!dialog.value) return;
  store.geminiResult = '';
  const finText = dialog.value.fin.join('. ');
  const promptForInfo = store.getPromptInfo(finText);
  store.askGemini(promptForInfo);
  store.setShowModal(true);
};
</script>

<style scoped>
/* .dialog-view {
  position: relative;
  display: flex;
  gap: 1rem;
  width: 80%;
  height: 90vh;
  margin: 0 auto;
  margin-top: 5vh;
}
.sidebar {
  display: flex;
  flex-direction: column;
  width: 20%;
  background: var(--subtitle);
  border-radius: 0.5rem;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.dialog-content {
  flex: 1;
  height: 100%;
  background-color: var(--light);
  border: 1px solid var(--grey-b);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.dialog-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--pink);
  text-align: center;
  margin-bottom: 1rem;
  flex-grow: 1;
}
.scroll-container {
  max-height: 100%;
  overflow-y: auto;
} */
.dialog-line {
  margin-right: 1rem;
  border-bottom: 1px solid var(--grey-b);
}
.finnish-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--title);
  margin: 0.5rem 0;
}
.russian-text {
  font-size: 1rem;
  font-style: italic;
  color: var(--text);
  margin: 0.5rem 0;
  padding-left: 2rem;
}
</style>
