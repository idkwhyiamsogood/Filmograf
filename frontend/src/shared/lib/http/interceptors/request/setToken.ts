import { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

export const setToken = async (config: InternalAxiosRequestConfig) => {
  const token = getCookie("access_token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
