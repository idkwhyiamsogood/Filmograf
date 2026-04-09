import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";
import type { IUser, UserLight } from "../types";

class UserApi extends BaseHttpClient {
  public getMe = async (): APIResponse<IUser> => {
    return this.get("/api/auth/fetch");
  };

  public getUser = async (userId: string): APIResponse<UserLight> => {
    return this.get(`/api/users/${userId}`);
  };
}

export const userApi = new UserApi();
