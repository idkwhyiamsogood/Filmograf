import { authInstance, authLink } from "@/lib/axios";
import { AxiosResponse } from "axios";

export interface IUser {
  id: number;
  email: string;
  name: string;
  googleId?: string;
}

export interface IVerifyIdempotenceResponse {
  jwt: string;
}

class AuthApi {
  private API_URL =
    process.env.NEXT_PUBLIC_API_URL || authLink;

  /** Отправляем Google idToken с мобилки и получаем JWT */
  public verifyNativeGoogleToken = async (
    idToken: string
  ): Promise<AxiosResponse<IVerifyIdempotenceResponse>> => {
    return await authInstance.post(
      "/api/auth/google-native",
      { idToken }
    );
  };
  
  /** Получить текущего пользователя (по JWT) */
  public getCurrentUser = async (): Promise<AxiosResponse<IUser>> => {
    return await authInstance.get("/api/auth/fetch");
  };

  /** Проверка статуса */
  public getAuthStatus = async (): Promise<AxiosResponse<any>> => {
    return await authInstance.get("/api/auth/status");
  };

  /** Logout */
  public logout = (): void => {
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