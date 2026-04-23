import { BaseHttpClient } from "@/shared/lib";

// types
import type { QueryParams, SearchedIds } from "@/shared/types/api";
import type { APIResponse } from "@/shared/types/api";
import type { FilterOptions, CollectionParams, MovieParams } from "@/features/filter/";
import { HubConnection } from "@microsoft/signalr";

class SearchApi extends BaseHttpClient {
  public searchMovies = (
    search: string,
    options: MovieParams,
    queryParam: QueryParams = { page: 0, count: 21 },
  ): APIResponse<SearchedIds> => {
    const trimmed = search?.trim?.() ?? "";
    const queryPart = trimmed ? `query=${encodeURIComponent(trimmed)}&` : "";
    return this.post(
      `api/search/movies?${queryPart}roomId=${"wqe"}&Page=${queryParam.page}&Count=${queryParam.count}`,
      options,
    );
  };

  public searchCollections = (
    search: string,
    options: CollectionParams,
    queryParam: QueryParams = { page: 0, count: 21 },
  ): APIResponse<SearchedIds> => {
    const trimmed = search?.trim?.() ?? "";
    const queryPart = trimmed ? `query=${encodeURIComponent(trimmed)}&` : "";
    return this.post(
      `api/search/collections?${queryPart}Page=${queryParam.page}&Count=${queryParam.count}`,
      options,
    );
  };
}

export const searchApi = new SearchApi();
