<!-- src\components\DialogCard.vue -->
<template>
  <router-link
    :to="{ name: 'view-dialog', params: { id: dialog.id } }"
    class="dialog-card"
  >
    <div class="card-content">
      <div class="card-title">{{ dialog.title }}</div>
      <div class="card-info">
        <span class="levelClass">Taso {{ dialog.level }}</span>
        <!-- <span>{{ dialog.fin.length }} riviä</span> -->
        <span>{{ dialog.replicasCount }} riviä</span>
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
  flex: 0 1 400px;
  min-width: 450px;
  margin: 8px;
  background-color: var(--winkle-90);
  border: 1px solid var(--winkle-80);
  border-radius: 0.5rem;
  padding: 1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.dialog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card-title {
  color: var(--tiffany-20);
  font-size: var(--subtitle);
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.card-info {
  display: flex;
  justify-content: space-between;
  font-size: var(--subtext);
  color: var(--grey-30);
}
.levelClass {
  font-weight: 600;
}
</style>
