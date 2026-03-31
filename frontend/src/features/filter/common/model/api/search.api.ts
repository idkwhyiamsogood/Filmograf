import { BaseHttpClient } from "@/shared/lib";

// types
import type { Collection } from "@/entities/collection";
import type { IMovie } from "@/entities/movie";
import type { APIResponse } from "@/shared/types/api";
import type { FilterOptions } from "../types/types";

class SearchApi extends BaseHttpClient {
  public searchMovies = (options: FilterOptions): APIResponse<IMovie[]> => {
    return this.post("api/search/movies", options);
  };

  public searchCollections = (
    options: FilterOptions,
  ): APIResponse<Collection[]> => {
    return this.post("api/search/collections", options);
  };
}

export const searchApi = new SearchApi();
