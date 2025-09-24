<!-- src\components\Auth.vue -->
<template>
  <div class="auth-container">
    <div class="form">
      <h2 class="title auth-title">{{ isLoginMode ? 'Kirjaudu sisään' : 'Rekisteröidy' }}</h2>

      <form @submit.prevent="handleSubmit">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          class="btn clear auth-btn"
        >
          <span class="material-symbols-outlined icon">{{ isLoginMode ? 'login' : 'account_circle' }}</span>
          {{ isLoginMode ? 'Kirjaudu sisään' : 'Rekisteröidy' }}
        </button>
      </form>

      <div class="divider">
        <span>tai</span>
      </div>

      <button
        @click="handleGoogleSignIn"
        class="btn clear google-btn"
      >
        <img
          class="icon google-icon"
          src="../assets/google.svg"
          alt=""
        />
        Googlella
      </button>

      <p class="toggle-mode">
        {{ isLoginMode ? 'Eikö ole tiliäsi?' : 'Onko jo tilisi?' }}
        <span
          @click="toggleMode"
          class="toggle-link"
        >
          {{ isLoginMode ? 'Rekisteröidy' : 'Kirjaudu sisään' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const mode = ref('login'); // 'login' или 'signup'

const isLoginMode = computed(() => mode.value === 'login');

const handleSubmit = async () => {
  try {
    if (isLoginMode.value) {
      await userStore.loginWithEmail(email.value, password.value);
    } else {
      await userStore.registerWithEmail(email.value, password.value);
    }
    router.push({ name: 'all-dialogs' });
  } catch (error) {
    alert(error.message);
  }
};

const handleGoogleSignIn = async () => {
  try {
    await userStore.loginWithGoogle();
    router.push({ name: 'all-dialogs' });
  } catch (error) {
    alert(error.message);
  }
};

const toggleMode = () => {
  mode.value = isLoginMode.value ? 'signup' : 'login';
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  height: 100vh;
  background-color: var(--pink);
}
.auth-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.form {
  min-width: 25%;
  background: var(--back);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
}
.google-btn {
  width: 100%;
  margin-top: 0;
}
.auth-btn {
  width: 100%;
  margin-top: 1.5rem;
}
.google-icon {
  width: 18px;
}
.divider {
  margin: 1.5rem 0;
  position: relative;
  width: 100%;
  text-align: center;
}
.divider span {
  background: var(--back);
  color: var(--subtitle);
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}
.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--border);
  z-index: 0;
}
.toggle-mode {
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--subtitle);
}
.toggle-link {
  font-size: 1rem;
  padding-left: 0.5rem;
  color: var(--border);
  cursor: pointer;
  text-decoration: underline;
}
</style>
