// src\router\index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import Readme from '../views/Readme.vue';
import Auth from '../components/Auth.vue';
import AllDialogs from '../views/AllDialogs.vue';
import NewDialog from '../views/NewDialog.vue';
import ViewDialog from '../views/ViewDialog.vue';
import Level_1 from '../views/Level_1.vue';
import Level_2 from '../views/Level_2.vue';
import Level_3 from '../views/Level_3.vue';
import Level_4 from '../views/Level_4.vue';

const routes = [
  {
    path: '/',
    name: 'readme',
    component: Readme,
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/dialogs',
    name: 'all-dialogs',
    component: AllDialogs,
    meta: { requiresAuth: true },
  },
  {
    path: '/new',
    name: 'new-dialog',
    component: NewDialog,
    meta: { requiresAuth: true },
  },
  {
    path: '/dialog/:id',
    name: 'view-dialog',
    component: ViewDialog,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/training/level-1/:id',
    name: 'level-1',
    component: Level_1,
    meta: { requiresAuth: true },
  },
  {
    path: '/training/level-2/:id',
    name: 'level-2',
    component: Level_2,
    meta: { requiresAuth: true },
  },
  {
    path: '/training/level-3/:id',
    name: 'level-3',
    component: Level_3,
    meta: { requiresAuth: true },
  },
  {
    path: '/training/level-4/:id',
    name: 'level-4',
    component: Level_4,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isLoggedIn) {
    return { name: 'readme' };
  }

  if ((to.name === 'readme' || to.name === 'auth') && isLoggedIn) {
    return { name: 'all-dialogs' };
  }
});

export default router;
