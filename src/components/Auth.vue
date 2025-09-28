<!-- src\components\Auth.vue -->
<template>
  <div class="auth-container">
    <div class="form">
      <div class="auth-subtitle subtitle">{{ isLoginMode ? 'Kirjaudu sisään' : 'Rekisteröidy' }}</div>

      <p
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </p>

      <form @submit.prevent="handleSubmit">
        <input
          type="email"
          v-model="email"
          placeholder="Sähköposti"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Salasana"
          required
        />

        <button
          type="submit"
          class="btn green auth-btn"
          :disabled="isLoading"
        >
          <span
            v-if="!isLoading"
            class="material-symbols-outlined icon"
            >{{ isLoginMode ? 'login' : 'account_circle' }}</span
          >
          {{ isLoginMode ? 'Kirjaudu sisään' : 'Rekisteröidy' }}
        </button>
      </form>

      <div class="divider"><span>tai</span></div>

      <button
        @click="handleGoogleSignIn"
        class="btn green google-btn"
        :disabled="isLoading"
      >
        <img
          class="icon google-icon"
          src="../assets/google.svg"
          alt="Google icon"
        />
        Googlella
      </button>

      <p class="toggle-mode">
        {{ isLoginMode ? 'Eikö ole tiliäsi?' : 'Onko jo tilisi?' }}
        <button
          @click="toggleMode"
          class="toggle-link"
        >
          {{ isLoginMode ? 'Rekisteröidy' : 'Kirjaudu sisään' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore'; // Используем новый userStore
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const mode = ref('login');

// ✨ НОВЫЕ СОСТОЯНИЯ ДЛЯ UX
const isLoading = ref(false);
const errorMessage = ref('');

const isLoginMode = computed(() => mode.value === 'login');

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = ''; // Сбрасываем ошибку
  try {
    if (isLoginMode.value) {
      await userStore.loginWithEmail(email.value, password.value);
    } else {
      await userStore.registerWithEmail(email.value, password.value);
    }
    router.push({ name: 'all-dialogs' });
  } catch (error) {
    // ✨ ПОКАЗЫВАЕМ ДРУЖЕЛЮБНУЮ ОШИБКУ
    errorMessage.value = getFriendlyErrorMessage(error.code);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await userStore.loginWithGoogle();
    router.push({ name: 'all-dialogs' });
  } catch (error) {
    errorMessage.value = getFriendlyErrorMessage(error.code);
  } finally {
    isLoading.value = false;
  }
};

const toggleMode = () => {
  mode.value = isLoginMode.value ? 'signup' : 'login';
  errorMessage.value = '';
};

// ✨ УТИЛИТА ДЛЯ ПРЕОБРАЗОВАНИЯ ОШИБОК FIREBASE
function getFriendlyErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/wrong-password':
      return 'Väärä salasana. Yritä uudelleen.';
    case 'auth/user-not-found':
      return 'Käyttäjää ei löytynyt tällä sähköpostilla.';
    case 'auth/email-already-in-use':
      return 'Tämä sähköposti on jo käytössä.';
    default:
      return 'Tapahtui virhe. Yritä uudelleen myöhemmin.';
  }
}
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
}
.auth-subtitle {
  margin-bottom: 2rem;
}
.form {
  min-width: 25%;
  background: var(--tiffany-90);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
}
input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--tiffany-80);
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
  background: var(--tiffany-90);
  color: var(--tiffany-20);
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
  background-color: var(--tiffany-20);
  z-index: 0;
}
.toggle-mode {
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--tiffany-20);
}
.error-message {
  color: var(--red-20);
  margin-bottom: 1rem;
  font-weight: 500;
}
.toggle-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 1rem;
  padding-left: 0.5rem;
  color: var(--winkle-60);
  cursor: pointer;
  text-decoration: underline;
}
</style>
