import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { IMovie } from "../types/types";

class MovieApi extends BaseHttpClient {
  public getMovie = async (id: string): ApiResponse<IMovie> => {
    return this.get(`/api/movies/${id}`);
  };

  public getTop = async (): ApiResponse<number> => {
    return this.get("/api/movies/top")
  }
}

export const movieApi = new MovieApi();
