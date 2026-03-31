import { BaseHttpClient } from "@/shared/lib";

// types
import type { APIResponse, QueryParams } from "@/shared/types/api";
import type { SearcedTags, Tag } from "../types";

class CollecionTagsApi extends BaseHttpClient {
  public getTags = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<Tag[]> => {
    return this.get(
      `api/collections/tags?Page=${params.page}&Count=${params.count}`,
    );
  };

  public getTag = async (id: string): APIResponse<Tag> => {
    return this.get(`api/collections/tags/${id}`);
  };

  public batchMany = async (ids: string[]): APIResponse<Tag[]> => {
    return this.post("api/collections/tags", ids);
  };

  public updateTag = async (
    id: string,
    data: { text: string },
  ): APIResponse<null> => {
    return this.patch(`api/collections/tags/${id}`, data);
  };

  public createTag = async (data: { name: string }): APIResponse<Tag> => {
    return this.post("api/collections/tags/", data);
  };

  public deleteTag = async (id: string): APIResponse<null> => {
    return this.delete(`api/collections/tags/${id}`);
  };

  // search service
  public searchTags = (query: string): APIResponse<SearcedTags> => {
    return this.get(`api/search/tags?query=${query}`);
  };
}

export const collecionTagsApi = new CollecionTagsApi();
