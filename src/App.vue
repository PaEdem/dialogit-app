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
import { useStore } from './stores/store';
import Loader from './components/Loader.vue';

const store = useStore();
const isLoading = computed(() => {
  return store.loading;
});
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--back);
}
.main {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}
</style>
