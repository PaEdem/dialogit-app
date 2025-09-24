//src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './styles/main.css';
import './styles/colors.css';
import './styles/buttons.css';
import { useUserStore } from './stores/user.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const userStore = useUserStore();
userStore.initUser().then(() => {
  app.mount('#app');
});
