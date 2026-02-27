// lib/axios.ts
import { authApi } from "@/api/auth.api";
import axios from "axios";

export const authLink = "http://localhost:5090";

const settingUpAxiosInstance = (link: string) => {
  const axiosInstance = axios.create({
    baseURL: `${link}`,
    withCredentials: true, // ВАЖНО: добавляем для отправки куки
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Интерцептор для добавления токена
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Интерцептор для обработки ошибок
  axiosInstance.interceptors.request.use((config) => {
    const token = authApi.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance;
}

export const authInstance = settingUpAxiosInstance(authLink);