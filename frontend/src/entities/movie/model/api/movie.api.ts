import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";

import type { IdsEntity, QueryParams } from "@/shared/types";
import type { IMovie, MoviesRates } from "../types/types";

class MovieApi extends BaseHttpClient {
  public getMovie = async (id: string): APIResponse<IMovie> => {
    return this.get(`/api/movies/${id}`);
  };

  public getTop = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(
      `/api/movies/top?Page=${params.page}&Count=${params.count}`,
    );
  };

  public getRecommended = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(
      `/api/movies/recommended?Page=${params.page}&Count=${params.count}`,
    );
  };

  public getPopular = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(
      `/api/movies/popular?Page=${params.page}&Count=${params.count}`,
    );
  };

  public batchMany = async (data: IdsEntity): APIResponse<IMovie[]> => {
    return this.post("/api/movies/batch-many", data);
  };

  public rateMovie = async (rate: number, id: string): APIResponse<null> => {
    return this.put(`/api/movies/rate/${id}`, { rate: rate });
  };

  public getMyRates = async (): APIResponse<MoviesRates[]> => {
    return this.get("/api/movies/rate/my");
  };
};

export const movieApi = new MovieApi();
