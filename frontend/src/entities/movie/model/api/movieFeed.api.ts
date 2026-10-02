import { BaseHttpClient } from "@/shared/lib/http/axios";
import { APIResponse } from "@/shared/types/api";

export type FeedSource = "IMDb" | "Kinopoisk";

export interface FeedMovies {
  source: FeedSource;
  url: string;
}

// Админские ручки парсинга (MoviesService/FeedController, [Admin]).
class MovieFeedApi extends BaseHttpClient {
  public parseSourceMovie = async (data: FeedMovies): APIResponse<null> => {
    return this.post("/api/movies/feed/parse-source-movie", data);
  };

  public parseSourceCollection = async (data: FeedMovies): APIResponse<null> => {
    return this.post("/api/movies/feed/parse-source-collection", data);
  };

  public compileChart = async (): APIResponse<null> => {
    return this.post("/api/movies/feed/compile-chart");
  };

  public reParseOneMovie = async (movieId: string): APIResponse<null> => {
    return this.post(`/api/movies/feed/${movieId}/re-parse-one-movie`);
  };

  /** @returns количество исправленных фильмов */
  public fixParsingBugs = async (): APIResponse<number> => {
    return this.post("/api/movies/feed/nahyi-parsing-bugs");
  };
}

export const movieFeedApi = new MovieFeedApi();
