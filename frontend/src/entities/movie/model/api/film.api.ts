import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { IMovie } from "../types/types";

interface QueryParams {
  page?: number;
  count?: number;
}

class MovieApi extends BaseHttpClient {
  public getMovie = async (id: string): ApiResponse<IMovie> => {
    return this.get(`/api/movies/${id}`);
  };

  public getTop = async (params: QueryParams = {page: 0, count: 21}): ApiResponse<IMovie[]> => {
    return this.get(
      `/api/movies/top?Page=${params.page}&Count=${params.count}`,
    );
  };
}

export const movieApi = new MovieApi();
