export enum Review {
  IMDB,
  Kinopoisk,
  my,
}

export type IFilm = {
  // В будущем мб надо будет добавить preview -> это видео премьера фильма
  id: number;
  title: string;
  description?: string | undefined;
  comment?: string | undefined;

  isFavorite: boolean;
  genres?: string[] | undefined;
  review: Record<Review, number | undefined>[]; // [IMDB: 8.2, Kinopoisk: 1.2, my: undefined]
  img?: string | undefined;
};
