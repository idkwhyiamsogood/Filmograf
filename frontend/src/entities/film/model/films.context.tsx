// types
import type { ReactNode, FC } from "react";
import type { IFilm } from "./types";

// fn
import { createContext } from "react";

// hooks
import { useReducer, useContext } from "react";

type FilmAction =
  | { type: "SET_FILM_LIST"; payload: IFilm[] }
  | { type: "ADD_FILM"; payload: IFilm }
  | { type: "DELETE_FILM"; payload: number }
  | { type: "UPDATE_FILM"; payload: Partial<IFilm> };

export interface FilmContextType {
  films: IFilm[];

  setFilms: (payload: IFilm[]) => void;
  addFilm: (payload: IFilm) => void;
  deleteFilm: (payload: number) => void;
  updateFilm: (payload: Partial<IFilm>) => void;
}

export const FilmContext = createContext<FilmContextType | undefined>(
  undefined
);

const filmReducer = (state: IFilm[], action: FilmAction): IFilm[] => {
  switch (action.type) {
    case "SET_FILM_LIST":
      return [...action.payload];
    case "ADD_FILM":
      return [...state, action.payload];
    case "DELETE_FILM":
      return state.filter((film) => film.id !== action.payload);
    case "UPDATE_FILM":
      return state.map((film) =>
        film.id === action.payload.id ? { ...film, ...action.payload } : film
      );
    default:
      return state;
  }
};

interface FilmProviderProps {
  children: ReactNode;
}

export const FilmProvider: FC<FilmProviderProps> = ({ children }) => {
  const [films, dispatch] = useReducer(filmReducer, []);

  // нужно ли вообще ?
  const setFilms = (data: IFilm[]) => {
    dispatch({ type: "SET_FILM_LIST", payload: data });
  };

  const addFilm = (data: IFilm) => {
    dispatch({ type: "ADD_FILM", payload: data });

    // event on add
  };

  const deleteFilm = (data: number) => {
    dispatch({ type: "DELETE_FILM", payload: data });

    // event on delete
  };

  // toggleFavorite вызываем из нее же
  const updateFilm = (data: Partial<IFilm>) => {
    dispatch({ type: "UPDATE_FILM", payload: data });

    // event on update
  };

  const value: FilmContextType = {
    films,
    setFilms,
    addFilm,
    deleteFilm,
    updateFilm,
  };

  return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
};

// Хук для использования контекста
export const useFilm = (): FilmContextType => {
  const context = useContext(FilmContext);
  if (context === undefined) {
    throw new Error("useFilm must be used within a FilmProvider");
  }
  return context;
};