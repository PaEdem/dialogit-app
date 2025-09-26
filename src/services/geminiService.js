// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Отправляет промпт в Gemini и возвращает текстовый ответ.
 * @param {string} prompt - Текстовый промпт для модели.
 * @returns {Promise<string>} - Ответ от Gemini.
 */
export async function fetchGeminiResponse(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Ошибка при запросе к Gemini:', error);
    // Пробрасываем ошибку дальше, чтобы action в сторе мог её обработать
    throw new Error('Не удалось получить ответ от Gemini.');
  }
}
