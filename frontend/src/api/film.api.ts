import axios from "@/shared/lib/axios";
import { AxiosResponse } from "axios";

class FilmApi {
  // PATH
  // @ts-ignore
  fetchFilmById = (id: number): Promise<AxiosResponse<any>> => 
    axios.get(`/movie/${id}`)

  // QUERY  
  // @ts-ignore
  fetchFilmByTitle = (title: string, page: number): Promise<AxiosResponse<any>> =>
    axios.get(`/movie/search?page=${page}&query=${title}`);

}

export default new FilmApi;