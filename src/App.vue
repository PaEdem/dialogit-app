<!-- \\src\App.vue -->
<template>
  <div class="app-wrapper">
    <Loader v-if="isLoading" />
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useUiStore } from './stores/uiStore';
import Loader from './components/Loader.vue';
const uiStore = useUiStore();
const isLoading = computed(() => uiStore.isAppLoading);
</script>
<style scoped>
.app-wrapper {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--red-80);
}
.main {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}
</style>
