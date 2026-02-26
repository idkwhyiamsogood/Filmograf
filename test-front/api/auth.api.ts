// api/auth.api.ts
import { authInstance } from "@/lib/axios";
import { AxiosResponse } from "axios";

export interface IUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface IAuthStatus {
  isAuthenticated: boolean;
  authenticationType: string | null;
}

export interface IAuthTokens {
  access_token: string;
  id_token?: string | null;
  refresh_token?: string;
}

class AuthApi {
  // ======================
  // AUTH ACTIONS
  // ======================

  /** Перенаправление на Google OAuth */
  public googleLogin = (): void => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090"}/api/auth/google`;
  };

  /** Получение информации о текущем пользователе */
  public getCurrentUser = async (): Promise<AxiosResponse<IUser>> => {
    return await authInstance.get("/api/auth/user");
  };

  /** Получение статуса аутентификации */
  public getAuthStatus = async (): Promise<AxiosResponse<IAuthStatus>> => {
    return await authInstance.get("/api/auth/status");
  };

  /** Выход из системы */
  public logout = async (): Promise<AxiosResponse<void>> => {
    const response = await authInstance.post("/api/auth/logout");
    this.clearTokens();
    return response;
  };

  /** Обновление токена */
  public refreshToken = async (): Promise<AxiosResponse<IAuthTokens>> => {
    return await authInstance.post("/api/auth/refresh-token");
  };

  /** Обработка callback после Google OAuth */
  public handleCallback = (): IAuthTokens | null => {
    if (typeof window === "undefined") return null;
    
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");
    const error = params.get("error");
    
    if (error) {
      console.error("OAuth error:", error);
      return null;
    }
    
    if (accessToken) {
      // Сохраняем токены
      localStorage.setItem("access_token", accessToken);
      if (idToken) localStorage.setItem("id_token", idToken);
      
      // Очищаем URL от параметров, но оставляем на главной
      window.history.replaceState({}, document.title, "/");
      
      return { access_token: accessToken, id_token: idToken };
    }
    
    return null;
  };

  // ======================
  // TOKEN MANAGEMENT
  // ======================

  /** Получить access token */
  public getAccessToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  /** Установить access token */
  public setAccessToken = (token: string): void => {
    localStorage.setItem("access_token", token);
  };

  /** Удалить токены */
  public clearTokens = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
  };

  /** Проверить, авторизован ли пользователь */
  public isAuthenticated = async (): Promise<boolean> => {
    try {
      const response = await this.getAuthStatus();
      return response.data.isAuthenticated;
    } catch {
      return false;
    }
  };
}

export const authApi = new AuthApi();