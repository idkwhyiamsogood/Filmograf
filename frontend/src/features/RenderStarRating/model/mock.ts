import { Review } from "@/entities/movie";

export const mock: Record<Review, number | undefined>[] = [
  {
    [Review.IMDB]: 8.4,
    [Review.Kinopoisk]: 7.9,
    [Review.my]: 9.2
  },
  {
    [Review.IMDB]: 7.1,
    [Review.Kinopoisk]: 7.5,
    [Review.my]: 8.0
  },
  {
    [Review.IMDB]: 9.0,
    [Review.Kinopoisk]: 8.7,
    [Review.my]: 8.5
  },
  {
    [Review.IMDB]: 6.8,
    [Review.Kinopoisk]: 7.2,
    [Review.my]: undefined 
  },
  {
    [Review.IMDB]: undefined,
    [Review.Kinopoisk]: 6.5,
    [Review.my]: 7.8
  }
];
