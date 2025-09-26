// src/utils/dataTransformer.js

/**
 * Преобразует объект диалога в формат, совместимый с Firestore.
 * Оборачивает вложенный массив 'options' в массив объектов.
 * @param {object} dialogData - Объект диалога.
 * @returns {object} - Преобразованный объект.
 */
export function prepareDialogForFirestore(dialogData) {
  if (!dialogData.options || !Array.isArray(dialogData.options)) {
    return dialogData;
  }
  const optionsForFirestore = dialogData.options.map((optionSet) => ({ values: optionSet }));
  return { ...dialogData, options: optionsForFirestore };
}

/**
 * Преобразует объект диалога из формата Firestore в рабочий формат приложения.
 * Извлекает вложенный массив из 'options'.
 * @param {object} dialogData - Объект диалога из Firestore.
 * @returns {object} - Преобразованный объект.
 */
export function prepareDialogFromFirestore(dialogData) {
  if (dialogData.options && dialogData.options[0]?.values) {
    const options = dialogData.options.map((item) => item.values);
    return { ...dialogData, options };
  }
  return dialogData;
}

/**
 * Сохраняет диалог в LocalStorage.
 * @param {object} dialog - Объект диалога для сохранения.
 */
export function saveDialogToCache(dialog) {
  if (!dialog || !dialog.id) return;
  try {
    const key = `dialog_${dialog.id}`;
    // Сохраняем "чистые" данные, готовые к работе
    localStorage.setItem(key, JSON.stringify(dialog));
  } catch (e) {
    console.error('Ошибка сохранения в LocalStorage:', e);
  }
}

/**
 * Загружает диалог из LocalStorage.
 * @param {string} id - ID диалога.
 * @returns {object|null} - Объект диалога или null.
 */
export function getDialogFromCache(id) {
  if (!id) return null;
  try {
    const key = `dialog_${id}`;
    const dialogData = localStorage.getItem(key);
    return dialogData ? JSON.parse(dialogData) : null;
  } catch (e) {
    console.error('Ошибка получения из LocalStorage:', e);
    return null;
  }
}

/**
 * Удаляет диалог из LocalStorage.
 * @param {string} id - ID диалога.
 */
export function removeDialogFromCache(id) {
  if (!id) return;
  try {
    const key = `dialog_${id}`;
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Ошибка удаления из LocalStorage:', e);
  }
}
