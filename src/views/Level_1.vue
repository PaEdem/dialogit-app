<template>
  <div
    v-if="dialog"
    class="dialog-view level-view"
  >
    <div class="sidebar level-sidebar">
      <div class="dialog-title">{{ dialog.title }}</div>
      <div class="description">Финский текст, русский перевод и финская речь.<br />Учи построчно.</div>
      <div class="controls">
        <button
          class="btn-control"
          @click="repeatLevel"
        >
          <span class="material-symbols-outlined icon">repeat</span>
        </button>
        <button
          class="btn-control"
          @click="repeatLine"
        >
          <span class="material-symbols-outlined icon">repeat_one</span>
        </button>
        <button
          class="btn-control play"
          @click="nextLine"
        >
          <span class="material-symbols-outlined icon">play_arrow</span>
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
      class="dialog-content"
      v-if="dialog"
    >
      <div class="dialog-text-container">
        <div class="panel">
          <p
            class="finnish text"
            v-for="(line, index) in dialog.fin.slice(0, lineIndex)"
            :key="index"
          >
            {{ line }}
          </p>
        </div>
        <div class="panel">
          <p
            class="russian text"
            v-for="(line, index) in dialog.rus.slice(0, lineIndex)"
            :key="index"
          >
            {{ line }}
          </p>
        </div>
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../stores/store';
import ModalEnd from '../components/ModalEnd.vue';

const route = useRoute();
const store = useStore();

const dialog = computed(() => store.currentDialog);
const length = computed(() => (dialog.value ? dialog.value.fin.length : 0));
const lineIndex = computed(() => store.currentLineIndex + 1);

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
const repeatLine = () => {
  if (dialog.value) {
    store.repeatLine(dialog.value);
  }
};
const nextLine = () => {
  if (dialog.value) {
    store.nextLine(dialog.value);
  }
  if (lineIndex.value > length.value) {
    store.setShowModal(true);
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
.panel {
  flex: 1;
  padding: 0.75rem 2rem;
  overflow-y: auto;
}
.dialog-text-container {
  display: flex;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
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
