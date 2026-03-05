import { JWT } from "@/shared/types";
import { ApiResponse } from "@/shared/types/api";
import { TokenApi } from "./token.api";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class AuthApi extends TokenApi {
  public googleLogin = (router: AppRouterInstance): void => {
    router.push(`http://localhost:5090/api/auth/google`);
  };

  public createTemporaryToken = async (): ApiResponse<JWT> => {
    return this.get("/api/auth/temporary");
  };

  public verifyIdempotence = async (code: string): ApiResponse<JWT> => {
    return this.post("/api/auth/verify-idempotence-code", { code });
  };

  public getAuthStatus = async (): ApiResponse<any> => {
    return this.get("/api/auth/status");
  };

  public logout = (): void => {
    this.clearAccessToken();
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
