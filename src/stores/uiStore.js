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
      this.isModalActive = true;
    },
    hideModal() {
      this.isModalActive = false;
    },
  },
});
