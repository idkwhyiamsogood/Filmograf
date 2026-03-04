import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";
import type { IUser } from "./types";
import { JWT } from "@/shared/types";

// вынести отдельный api для пользователя 

class UserApi extends BaseHttpClient {
  public googleLogin = (): void => {
    window.location.href = `${this.http}/api/auth/google`;
  };

  public verifyIdempotence = async (code: string): ApiResponse<JWT> => {
    return this.post("/api/auth/verify-idempotence-code", { code });
  };

  public fetchProfile = async (): ApiResponse<IUser> => {
    return this.get("/api/auth/fetch");
  };

  public getAuthStatus = async (): ApiResponse<any> => {
    return this.get("/api/auth/status");
  };

  public logout = (): void => {
    this.clearAccessToken();
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

  public clearAccessToken = (): void => {
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

export const userApi = new UserApi();
