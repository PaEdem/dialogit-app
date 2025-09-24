<!-- src\components\DialogCard.vue -->
<template>
  <router-link
    :to="`/dialog/${dialog.id}`"
    class="dialog-card"
  >
    <div class="card-content">
      <div class="card-title">{{ dialog.title }}</div>
      <div class="card-info">
        <span class="levelClass">Taso {{ dialog.level }}</span>
        <span>{{ dialog.fin.length }} riviä</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  dialog: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.dialog-card {
  display: block;
  background-color: var(--grey-3);
  border: 1px solid var(--grey-b);
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.dialog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card-title {
  color: var(--title);
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.card-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text);
}
.levelClass {
  font-weight: 600;
  color: var(--text);
}
</style>
