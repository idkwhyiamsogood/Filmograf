import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";
import type { IUser } from "../types";

class UserApi extends BaseHttpClient {
  public getMe = async (): APIResponse<IUser> => {
    return this.get("/api/auth/fetch");
  };
}

export const userApi = new UserApi();
