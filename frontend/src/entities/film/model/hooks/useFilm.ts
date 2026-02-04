import { useContext } from "react";
import { FilmContext, FilmContextType } from "../context/films.context";

export const useFilm = (): FilmContextType => {
  const context = useContext(FilmContext);
  if (context === undefined) {
    throw new Error("Необходимо подключение соответствующего провайдера!");
  }
  return context;
};
