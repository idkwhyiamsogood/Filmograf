import { api } from "@/api/index";
import { toastMessage } from "@/components/index";

export const FilmService = {
  fetchFilmById: async (id: number) => {
    try {
      const req = await api.filmApi.fetchFilmById(id);
      return req.data;
    } catch (e: unknown) {
      console.error(e);

      toastMessage.showMessage("Фильм не найден");
    }
  },

  fetchFilmByTitle: async (title: string, page: number = 1) => {
    try {
      const req = await api.filmApi.fetchFilmByTitle(title, page);
      return req.data;
    } catch (e: unknown) {
      console.error(e);

      toastMessage.showMessage("Фильм не найден");
    }
  },
};
