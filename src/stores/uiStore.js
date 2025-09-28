//src/stores/uiStore.js
import { defineStore } from 'pinia';
import { useDialogStore } from './dialogStore';
import { useUserStore } from './userStore';
import { useTrainingStore } from './trainingStore';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    isModalActive: false,
  }),
  getters: {
    isAppLoading() {
      const dialogStore = useDialogStore();
      const userStore = useUserStore();
      const trainingStore = useTrainingStore();
      return this.isLoading || dialogStore.isLoading || userStore.isLoading || trainingStore.isLoading;
    },
  },
  actions: {
    setLoading(value) {
      this.isLoading = value;
    },
    showModal() {
      const trainingStore = useTrainingStore();
      if (trainingStore.currentTrainingType !== 'level-4') {
        this.isModalActive = true;
      } else {
        setTimeout(() => (this.isModalActive = true), 1000);
      }
    },
    hideModal() {
      this.isModalActive = false;
    },
  },
});
