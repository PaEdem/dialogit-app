<template>
  <div
    class="layout"
    v-if="dialog"
  >
    <aside class="sidebar sb-gap">
      <div class="buttons-wrapper">
        <router-link
          to="/dialogs"
          class="btn grey full"
          aria-label="Вернуться ко всем диалогам"
        >
          <span class="material-symbols-outlined icon">arrow_back_ios</span>
          Takaisin dialogeihin
        </router-link>
      </div>

      <slot name="sidebar-content"></slot>
    </aside>

    <main class="content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDialogStore } from '../stores/dialogStore';

const dialogStore = useDialogStore();
const dialog = computed(() => dialogStore.currentDialog);
</script>

<style scoped>
.sb-gap {
  gap: 0.75rem;
}
.buttons-wrapper {
  display: flex;
  width: 100%;
  margin-bottom: 1.5rem;
}
</style>
