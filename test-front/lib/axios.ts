// lib/axios.ts
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
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Если 401 и не пробовали обновить токен
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Пытаемся обновить токен - используем сам инстанс, но без интерцептора
          const response = await axios.post(`${authLink}/api/auth/refresh-token`, {}, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const { access_token } = response.data;
          
          if (access_token) {
            localStorage.setItem("access_token", access_token);
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Очищаем токены и перенаправляем на главную, а не на /login
          localStorage.removeItem("access_token");
          localStorage.removeItem("id_token");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export const authInstance = settingUpAxiosInstance(authLink);