import { JWT } from "@/shared/types";
import { APIResponse } from "@/shared/types/api";
import { TokenApi } from "./token.api";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class AuthApi extends TokenApi {
  public googleLogin = (router: AppRouterInstance): void => {
    // this.get("/api/auth/google/");
    router.push(`https://filmograf.online/api/auth/google`);
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
    try {
      await GoogleAuth.signOut();
      this.clearAccessToken();
    } catch (e) {
      console.error(e);
    }
  };
}

export const authApi = new AuthApi();
