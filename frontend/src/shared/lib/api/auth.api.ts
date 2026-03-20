import { JWT } from "@/shared/types";
import { APIResponse } from "@/shared/types/api";
import { TokenApi } from "./token.api";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class AuthApi extends TokenApi {
  public googleLogin = (router: AppRouterInstance): void => {
    router.push(`https://filmograf.online/api/auth/google`);
  };

  public createTemporaryToken = async (): APIResponse<JWT> => {
    return this.get("/api/auth/temporary");
  };

  public verifyIdempotence = async (code: string): APIResponse<JWT> => {
    return this.post("/api/auth/verify-idempotence-code", { code });
  };

  public getAuthStatus = async (): APIResponse<boolean> => {
    return this.get("/api/auth/status");
  };

  public logout = (): void => {
    this.clearAccessToken();
  };
}

export const authApi = new AuthApi();
