import { BaseHttpClient } from "@/shared/lib";

// types
import type { SearchedIds } from "@/shared/types/api";
import type { APIResponse } from "@/shared/types/api";
import type { FilterOptions } from "@/features/filter/";


class SearchApi extends BaseHttpClient {
  public searchMovies = (options: FilterOptions, search: string): APIResponse<SearchedIds> => {
    return this.post(`api/search/movies?query=${search}`, options);
  };

  public searchCollections = (
    options: FilterOptions,
    search: string,
  ): APIResponse<SearchedIds> => {
    return this.post(`api/search/collections`, options);
  };
}

export const searchApi = new SearchApi();
