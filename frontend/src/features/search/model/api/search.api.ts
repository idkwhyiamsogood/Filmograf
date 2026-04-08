import { BaseHttpClient } from "@/shared/lib";

// types
import type { QueryParams, SearchedIds } from "@/shared/types/api";
import type { APIResponse } from "@/shared/types/api";
import type { FilterOptions } from "@/features/filter/";
import { HubConnection } from "@microsoft/signalr";

class SearchApi extends BaseHttpClient {
  public searchMovies = (
    options: FilterOptions,
    search: string,
    room: HubConnection,

    queryParam: QueryParams = { page: 0, count: 21 },
  ): APIResponse<SearchedIds> => {
    return this.post(
      `api/search/movies?query=${search}&roomId=${room}&Page=${queryParam.page}&Count=${queryParam.count}`,
      options,
    );
  };

  public searchCollections = (
    options: FilterOptions,
    search: string,
    room: HubConnection,

    queryParam: QueryParams = { page: 0, count: 21 },
  ): APIResponse<SearchedIds> => {
    return this.post(
      `api/search/collections?query=${search}&roomId=${room}&Page=${queryParam.page}&Count=${queryParam.count}`,
      options,
    );
  };
}

export const searchApi = new SearchApi();
