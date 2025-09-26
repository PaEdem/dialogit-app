<!-- src\views\AllDialogs.vue -->
<template>
  <div class="layout">
    <aside class="sidebar jc-sp-b">
      <router-link
        :to="{ name: 'new-dialog' }"
        class="btn pink full"
      >
        <span class="material-symbols-outlined icon">add</span>
        Luo uusi dialogi
      </router-link>
      <div class="user-box">
        <div class="displayName">{{ userStore.user?.displayName || 'Käyttäjä' }}</div>
        <button
          @click="handleLogout"
          class="btn grey full"
        >
          <span class="material-symbols-outlined icon">logout</span>
          Kirjaudu ulos
        </button>
      </div>
    </aside>
    <main class="content">
      <div
        v-if="dialogs.length > 0"
        class="levels-group"
      >
        <template
          v-for="level in levels"
          :key="level"
        >
          <div
            v-if="groupedDialogs[level].length > 0"
            class="level-group"
          >
            <DialogCard
              v-for="dialog in groupedDialogs[level]"
              :key="dialog.id"
              :dialog="dialog"
            />
          </div>
        </template>
      </div>
      <div
        v-else
        class="message"
      >
        <div class="message-text">Sinulla ei ole vielä dialogeja.</div>
        <router-link
          :to="{ name: 'new-dialog' }"
          class="btn accent message-btn"
        >
          <span class="material-symbols-outlined icon">add</span>
          Luo ensimmäinen dialogi
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDialogStore } from '../stores/dialogStore';
import { useUserStore } from '../stores/userStore';
import DialogCard from '../components/DialogCard.vue';
import Loader from '../components/Loader.vue';

const router = useRouter();
const dialogStore = useDialogStore();
const userStore = useUserStore();

const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];

const dialogs = computed(() => dialogStore.allDialogs);

const groupedDialogs = computed(() => {
  const groups = {};
  levels.forEach((level) => {
    groups[level] = dialogs.value.filter((d) => d.level === level);
  });
  return groups;
});

const handleLogout = async () => {
  await userStore.logout();
  router.push({ name: 'auth' }); // После выхода - на страницу логина
};

onMounted(() => {
  dialogStore.fetchAllDialogs();
});
</script>

<style scoped>
.user-box {
  width: 100%;
  text-align: center;
}
.displayName {
  font-size: var(--text);
  font-weight: 300;
  color: var(--winkle-20);
  margin-bottom: 1rem;
}
.levels-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}
.level-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.level-title {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--subtitle);
  border-bottom: 1px solid var(--grey-b);
  padding-bottom: 0.5rem;
}
.dialogs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
.message-text {
  font-size: 1.25rem;
  color: var(--subtitle);
  margin-bottom: 2rem;
}
.message-btn {
  margin-top: 2rem;
}
</style>
