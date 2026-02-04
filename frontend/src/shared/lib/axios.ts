import axios from 'axios';
import { TokenStorage } from '@/core/Storage';

export const serverLink = 'http://77.239.97.156:5350/api';

// Создаем экземпляр хранилища токенов
const tokenStorage = new TokenStorage("");

const axiosInstance = axios.create({
  baseURL: `${serverLink}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для автоматической подстановки токена
axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers['X-Auth-Token'] = token;
  }
  return config;
});

// Интерцептор для обработки ошибок авторизации
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Токен невалидный - удаляем его
      await tokenStorage.removeToken();
      // Можно добавить редирект на страницу логина
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;