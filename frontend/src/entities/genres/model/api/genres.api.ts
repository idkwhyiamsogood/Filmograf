import { BaseHttpClient } from "@/shared/lib/http/axios";
import { APIResponse } from "@/shared/types/api";

import type { Genre } from "../types/types";

class GenreApi extends BaseHttpClient {
  public getGenres = async (): APIResponse<Genre[]> => {
    return this.get(`/api/genres/`);
  };

  // search service
  public searchGenres = (query: string): APIResponse<Genre[]> => {
    return this.get(`api/search/genres?query=${query}`);
  };
}

export const genreApi = new GenreApi();
