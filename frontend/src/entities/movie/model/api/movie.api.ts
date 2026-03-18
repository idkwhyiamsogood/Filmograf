import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { IMovie } from "../types/types";

interface QueryParams {
  page?: number;
  count?: number;
}

interface MovieIds {
  ids: string[]
}

class MovieApi extends BaseHttpClient {
  public getMovie = async (id: string): ApiResponse<IMovie> => {
    return this.get(`/api/movies/${id}`);
  };

  public getTop = async (
    params: QueryParams = { page: 0, count: 21 },
  ): ApiResponse<MovieIds> => {
    return this.get(
      `/api/movies/top?Page=${params.page}&Count=${params.count}`,
    );
  };

  public getRecommended = async (
    params: QueryParams = { page: 0, count: 21 },
  ): ApiResponse<MovieIds> => {
    return this.get(`
      /api/movies/recommended?Page=${params.page}&Count=${params.count}`);
  };

  public batchMany = async (data: MovieIds): ApiResponse<IMovie[]> => {
    return this.post("/api/movies/batch-many", data);
  };
}

export const movieApi = new MovieApi();
