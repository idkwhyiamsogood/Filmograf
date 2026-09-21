import { InternalAxiosRequestConfig } from "axios";

export const setToken = async (config: InternalAxiosRequestConfig) => {
  if (window !== undefined) {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};
