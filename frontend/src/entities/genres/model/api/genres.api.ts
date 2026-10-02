import { BaseHttpClient } from "@/shared/lib/http/axios";
import type { APIResponse, QueryParams, SearchedIds } from "@/shared/types/api";

import type { Genre } from "../types/types";

class GenreApi extends BaseHttpClient {
  public getGenres = async (): APIResponse<Genre[]> => {
    return this.get(`/api/genres/`);
  };

  // search service
  public searchGenres = (
    query: string,
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<SearchedIds> => {
    return this.get(
      `api/search/genres?query=${encodeURIComponent(query)}&Page=${params.page}&Count=${params.count}`,
    );
  };
}

export const genreApi = new GenreApi();
