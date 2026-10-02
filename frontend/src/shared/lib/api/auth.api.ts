import { JWT } from "@/shared/types";
import { APIResponse } from "@/shared/types/api";
import { TokenApi } from "./token.api";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { USE_MOCKS } from "../mock/adapter";

interface RouterLike {
  push: (href: string) => void;
}

class AuthApi extends TokenApi {
  public googleLogin = (router: RouterLike): void => {
    const baseUrl = import.meta.env.VITE_API_URL || "https://filmograf.online/";
    router.push(`${baseUrl.replace(/\/$/, "")}/api/auth/google`);
  };

  public createTemporaryToken = async (): APIResponse<JWT> => {
    return this.get("/api/auth/temporary");
  };

  public refreshToken = async (): APIResponse<JWT> => {
    return this.patch("/api/auth/refresh-token");
  };

  public verifyIdempotence = async (code: string): APIResponse<JWT> => {
    return this.post("/api/auth/verify-idempotence-code", { code });
  };

  public getAuthStatus = async (): APIResponse<boolean> => {
    return this.get("/api/auth/status");
  };

  public googleNative = (token: string): APIResponse<JWT> => {
    return this.post("/api/auth/google-native", { idToken: token });
  };

  public logout = async () => {
    // Токен чистим в любом случае: signOut падает, если вход был не через
    // Google-плагин (веб, моки).
    this.clearAccessToken();
    if (USE_MOCKS) return;
    try {
      await GoogleAuth.signOut();
    } catch (e) {
      console.error(e);
    }
  };
}

export const authApi = new AuthApi();
