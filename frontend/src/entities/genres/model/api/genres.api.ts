import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";

import type { Genre } from "../types/types";

class GenreApi extends BaseHttpClient {
  public getGenres = async (): APIResponse<Genre[]> => {
    return this.get(`/api/genres/`);
  };
}

export const genreApi = new GenreApi();
