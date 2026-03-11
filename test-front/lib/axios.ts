import axios from "axios";

export const authLink =
  // process.env.NEXT_PUBLIC_API_URL || "https://filmograf.online";
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090";

const settingUpAxiosInstance = (link: string) => {
  const axiosInstance = axios.create({
    baseURL: link,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return axiosInstance;
};

export const authInstance = settingUpAxiosInstance(authLink);