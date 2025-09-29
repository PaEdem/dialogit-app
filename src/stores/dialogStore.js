import { defineStore } from 'pinia';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import {
  prepareDialogForFirestore,
  prepareDialogFromFirestore,
  getDialogFromCache,
  saveDialogToCache,
  getDialogsListFromCache,
  saveDialogsListToCache,
  clearAllDialogCache,
} from '../utils/dataTransformer';

export const useDialogStore = defineStore('dialogs', {
  state: () => ({
    allDialogs: [], // Теперь здесь будет храниться ОБЛЕГЧЕННЫЙ список
    currentDialog: null, // А здесь - ПОЛНЫЙ объект текущего диалога
    isLoading: false,
  }),
  actions: {
    // --- ACTIONS ---

    // 1. Обновленный fetchAllDialogs
    async fetchAllDialogs() {
      this.isLoading = true;
      try {
        const cachedList = getDialogsListFromCache();
        if (cachedList) {
          this.allDialogs = cachedList;
          return; // Нашли в кеше - выходим
        }

        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'dialogs'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const dialogsFromFS = querySnapshot.docs.map((doc) =>
          prepareDialogFromFirestore({ id: doc.id, ...doc.data() })
        );

        saveDialogsListToCache(dialogsFromFS); // Сохраняем в кеш
        this.allDialogs = getDialogsListFromCache(); // Записываем в state уже облегченный список
      } catch (error) {
        console.error('Ошибка загрузки диалогов:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. fetchDialogById - его логика уже была правильной, ничего не меняем
    async fetchDialogById(id) {
      this.isLoading = true;
      this.currentDialog = null;
      try {
        const cachedDialog = getDialogFromCache(id);
        if (cachedDialog) {
          this.currentDialog = cachedDialog;
          this.isLoading = false;
          return;
        }

        const docRef = doc(db, 'dialogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dialogData = prepareDialogFromFirestore({ id: docSnap.id, ...docSnap.data() });
          this.currentDialog = dialogData;
          saveDialogToCache(dialogData);
        }
      } catch (error) {
        console.error('Ошибка загрузки диалога:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 3. createDialog и deleteDialog теперь должны очищать кеш
    async createDialog(dialogData, creationParams) {
      this.isLoading = true;
      const user = auth.currentUser;
      if (!user) {
        this.isLoading = false;
        return null;
      }

      try {
        const dataToSave = prepareDialogForFirestore({
          ...dialogData,
          title: creationParams.topic,
          level: creationParams.level,
          userId: user.uid,
          createdAt: new Date(),
        });
        const docRef = await addDoc(collection(db, 'dialogs'), dataToSave);
        clearAllDialogCache(); // ОЧИЩАЕМ КЕШ, чтобы список обновился
        return docRef.id;
      } catch (error) {
        console.error('Ошибка сохранения диалога:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteDialog(id) {
      if (!confirm('Вы уверены, что хотите удалить этот диалог?')) return false;
      this.isLoading = true;
      try {
        await deleteDoc(doc(db, 'dialogs', id));
        clearAllDialogCache(); // ОЧИЩАЕМ КЕШ, чтобы список обновился
        // Обновляем state вручную, чтобы не делать лишний запрос
        this.allDialogs = this.allDialogs.filter((d) => d.id !== id);
        if (this.currentDialog?.id === id) this.currentDialog = null;
        return true;
      } catch (error) {
        console.error('Ошибка удаления документа:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
