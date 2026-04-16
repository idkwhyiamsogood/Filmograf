import axios from "axios";

export const authLink =
  "https://filmograf.online";
  // process.env.NEXT_PUBLIC_API_URL || "http://192.168.162.222:5090";

export const getToken = () => localStorage.getItem("access_token");
export const setToken = (token: string) => localStorage.setItem("access_token", token);

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
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return axiosInstance;
};

export const authInstance = settingUpAxiosInstance(authLink);