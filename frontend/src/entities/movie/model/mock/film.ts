import { IFilm, Review } from "../types/types";

export const mockFilm: IFilm = {
  id: "1",
  title: "Test Film",
  description: "Test description",
  comment: "Test comment",
  isFavorite: true,
  genres: ["Action", "Drama"],
  review: {
    [Review.IMDB]: 8.2,
    [Review.Kinopoisk]: 7.8,
    [Review.Film]: 9.0
  },
  img: "https://example.com/image.jpg"
};

export const mockFilms: IFilm[] = [
  {
    id: "1",
    title: "Film One",
    description: "Desc one",
    comment: "Comment one",
    isFavorite: true,
    genres: ["Action"],
    review: { [Review.IMDB]: 8.5, [Review.Kinopoisk]: 8.0, [Review.Film]: 9.0 },
    img: "img1.jpg"
  },
  {
    id: "2",
    title: "Film Two",
    description: "Desc two",
    isFavorite: false,
    genres: ["Drama", "Comedy"],
    review: { [Review.IMDB]: 7.2, [Review.Kinopoisk]: 7.5, [Review.Film]: undefined },
    img: "img2.jpg"
  }
];