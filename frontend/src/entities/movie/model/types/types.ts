import { BaseModel } from "@/shared/types";

export enum Review {
  IMDb = "IMDb",
  Kinopoisk = "Kinopoisk",
  Film = "Film",
  ByUser = "ByUser",
}

export interface IMovie extends BaseModel {
  name: string;
  description?: string | undefined;
  year: string; 
  ageLimit: number; // not-correct
  time: string;
  imageUrl: string;
  previewImageLink: string;
  movieLink: string;
  genreIds: string[];

  rates: Record<Review, number>
};


export interface MoviesRates extends Omit<BaseModel, "id"> {
  movieId: string;
  rate: number;
}