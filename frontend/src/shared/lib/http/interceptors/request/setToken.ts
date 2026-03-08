import { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

export const setToken = async (config: InternalAxiosRequestConfig) => {
  if (window !== undefined) {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};
