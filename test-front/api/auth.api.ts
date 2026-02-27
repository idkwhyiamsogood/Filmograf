// api/auth.api.ts
import { authInstance } from "@/lib/axios";
import { AxiosResponse } from "axios";

export interface IUser {
  id: number;
  email: string;
  name: string;
  googleId?: string;
}

export interface IAuthStatus {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
}

class AuthApi {
  private API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090";

  // ======================
  // AUTH FLOW
  // ======================

  /** Редирект на Google */
  public googleLogin = (): void => {
    window.location.href = `${this.API_URL}/api/auth/google`;
  };

  /** Обработка callback: получаем НАШ jwt */
  public handleCallback = (): string | null => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return null;
    }

    if (token) {
      localStorage.setItem("access_token", token);

      // чистим URL
      window.history.replaceState({}, document.title, "/");
      return token;
    }

    return null;
  };

  // ======================
  // API CALLS
  // ======================

  /** Получить текущего пользователя (по JWT) */
  public getCurrentUser = async (): Promise<AxiosResponse<IUser>> => {
    return await authInstance.get("/api/auth/fetch");
  };

  /** Проверка статуса */
  public getAuthStatus = async (): Promise<AxiosResponse<IAuthStatus>> => {
    return await authInstance.get("/api/auth/status");
  };

  /** Logout (удаляем JWT локально) */
  public logout = async (): Promise<void> => {
    this.clearToken();
  };

  // ======================
  // TOKEN MANAGEMENT
  // ======================

  public getAccessToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  public setAccessToken = (token: string): void => {
    localStorage.setItem("access_token", token);
  };

  public clearToken = (): void => {
    localStorage.removeItem("access_token");
  };

  public isAuthenticated = async (): Promise<boolean> => {
    try {
      await this.getAuthStatus();
      return true;
    } catch {
      return false;
    }
  };
}

export const authApi = new AuthApi();