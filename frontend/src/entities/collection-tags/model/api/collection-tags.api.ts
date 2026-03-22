import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";

import type { Tag } from "../types";

// поиск по имени тегов

class CollecionTagsApi extends BaseHttpClient {
  public getTags = async (): APIResponse<Tag[]> => {
    return this.get("api/collections/tags");
  };

  public getTagsByName = async (value: string): APIResponse<Tag[]> => {
    return this.get(`api/collection/tags/${value}`);
  };

  public createTag = async (data: { name: string }): APIResponse<null> => {
    return this.post("api/collections/tags/", data);
  };

  public deleteTag = async (id: string): APIResponse<null> => {
    return this.delete(`api/collections/tags/${id}`);
  };
}

export const collecionTagsApi = new CollecionTagsApi();
