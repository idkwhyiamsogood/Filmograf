import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { Collection } from "../types";

// todo add new entity genres

class CollecionApi extends BaseHttpClient {
  public getCollection = async (id: string): ApiResponse<Collection> => {
    return this.get(`/api/collections/${id}`);
  }

  public deleteCollection = async (id: string): ApiResponse<Collection> => {
    return this.delete(`/api/collections/${id}`);
  }
}

export const collecionApi = new CollecionApi();
