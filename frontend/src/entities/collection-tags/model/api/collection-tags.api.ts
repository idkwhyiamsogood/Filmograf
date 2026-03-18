import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { Tag } from "../types";

// поиск по имени тегов 

class CollecionTagsApi extends BaseHttpClient {
  public getTags = async (): ApiResponse<Tag[]> => {
    return this.get("api/collections/tags");
  }

  public getTagsByName = async (value: string): ApiResponse<Tag[]> => {
    return this.get(`api/collection/tags/${value}`);
  }

  public createTag = async (name: string): ApiResponse<null> => {
    return this.post("api/collections/tags/", name)
  }

  public deleteTags = async (id: string): ApiResponse<null> => {
    return this.delete(`api/collections/tags/${id}`)
  }
};

export const collecionTagsApi = new CollecionTagsApi();
