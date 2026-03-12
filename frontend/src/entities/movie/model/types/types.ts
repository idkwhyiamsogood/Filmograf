import { BaseModel } from "@/shared/types";

export enum Review {
  IMDB,
  Kinopoisk,
  Film,
}

// movie genres
export interface IGenres extends BaseModel {
  name: string;
}

export interface IMovie extends BaseModel {
  name: string;
  description?: string | undefined;
  year: string;
  ageLimit: number;
  time: string;
  imageUrl: string;
  previewImageLink: string;
  movieLink: string;
  genresIds: string[];

  rates: Record<Review, number>
};
