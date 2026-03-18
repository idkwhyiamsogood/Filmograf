import { BaseModel } from "@/shared/types";

export enum Review {
  IMDB,
  Kinopoisk,
  Film,
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
