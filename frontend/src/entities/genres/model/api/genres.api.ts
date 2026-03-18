import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { Genre } from "../types/types";

class GenreApi extends BaseHttpClient {
  public getGenres = async (): ApiResponse<Genre[]> => {
    return this.get(`/api/genres/`);
  };
}

export const genreApi = new GenreApi();
