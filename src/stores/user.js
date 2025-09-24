//src/stores/user.js
import { defineStore } from 'pinia';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  googleProvider,
} from '../firebase.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    loading: true,
  }),
  actions: {
    initUser() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.isLoggedIn = !!user;
          this.loading = false;
          resolve();
        });
      });
    },
    async loginWithEmail(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error('Ошибка входа:', error.code);
        throw error;
      }
    },
    async registerWithEmail(email, password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error('Ошибка регистрации:', error.code);
        throw error;
      }
    },
    async loginWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error('Ошибка входа через Google:', error.code);
        throw error;
      }
    },
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Ошибка выхода:', error.code);
        throw error;
      }
    },
  },
});
