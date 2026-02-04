"use client";

// types
import type { FC, ReactNode } from "react";
import type { IFilm } from "../types/types";

// fn
import { createContext } from "react";

// hooks
import { useReducer } from "react";

type FilmAction =
  | { type: "SET_FILM_LIST"; payload: IFilm[] }
  | { type: "ADD_FILM"; payload: IFilm }
  | { type: "DELETE_FILM"; payload: string }
  | { type: "UPDATE_FILM"; payload: Partial<IFilm> };

export interface FilmContextType {
  films: IFilm[];
  setFilms: (payload: IFilm[]) => void;
  addFilm: (payload: IFilm) => void;
  deleteFilm: (payload: string) => void;
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
  };

  const deleteFilm = (data: string) => {
    dispatch({ type: "DELETE_FILM", payload: data });
  };

  // toggleFavorite вызываем из нее же
  const updateFilm = (data: Partial<IFilm>) => {
    dispatch({ type: "UPDATE_FILM", payload: data });
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
