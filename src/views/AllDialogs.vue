<!-- src\views\AllDialogs.vue -->
<template>
  <div class="all-dialogs-view">
    <div class="sidebar">
      <button
        @click="createNewDialog"
        class="btn accent"
      >
        <span class="material-symbols-outlined icon">add</span>
        Luoda dialogi
      </button>
      <div class="box">
        <div class="displayName">{{ displayName }}</div>
        <button
          @click="handleLogout"
          class="btn-side"
        >
          <span class="material-symbols-outlined icon">logout</span>
          kirjaudu ulos
        </button>
      </div>
    </div>
    <div class="all-dialogs">
      <div
        class="levels-group"
        v-if="dialogs.length"
      >
        <div
          v-for="level in levels"
          :key="level"
          class="level-group"
        >
          <div class="dialogs-list">
            <DialogCard
              v-for="dialog in groupedDialogs[level]"
              :key="dialog.id"
              :dialog="dialog"
            />
          </div>
        </div>
      </div>
      <div
        class="message"
        v-else
      >
        <div class="message-text">Нет диалогов для обучения.</div>
        <button
          @click="createNewDialog"
          class="btn accent message-btn"
        >
          <span class="material-symbols-outlined icon">add</span>
          Luoda dialogi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/store';
import { useUserStore } from '../stores/user';
import DialogCard from '../components/DialogCard.vue';

const router = useRouter();
const store = useStore();
const userStore = useUserStore();
const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];

const dialogs = computed(() => store.allDialogs);
const displayName = computed(() => userStore.user?.displayName || '');

// Группируем диалоги по уровням
const groupedDialogs = computed(() => {
  const groups = {};
  levels.forEach((level) => {
    groups[level] = store.allDialogs.filter((d) => d.level === level);
  });
  return groups;
});

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push({ name: 'readme' });
  } catch (error) {
    console.error('Ошибка выхода:', error.message);
  }
};

const createNewDialog = () => {
  if (!!dialogs.length) return;
  router.push({ name: 'new-dialog' });
};

// Загружаем диалоги при загрузке компонента
onMounted(() => {
  store.getAllDialogsFromFS();
});
</script>

<style scoped>
.all-dialogs-view {
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
  justify-content: space-between;
  align-items: center;
  width: 20%;
  background: var(--subtitle);
  border-radius: 0.5rem;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.box {
  width: 100%;
}
.displayName {
  font-size: 1.25rem;
  font-weight: 300;
  text-align: center;
  color: var(--pink);
  margin-bottom: 1rem;
}
.all-dialogs {
  flex: 1;
  overflow-y: auto;
  background: var(--back);
  padding: 0.5rem 0 0 1rem;
}
.level-group {
  margin-bottom: 1rem;
}
.dialogs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  gap: 1rem;
}
.message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}
.message-text {
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 500;
  color: var(--title);
}
.message-btn {
  margin-top: 2rem;
}
@media (max-width: 1440px) {
  .dialogs-list {
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  }
}
</style>
