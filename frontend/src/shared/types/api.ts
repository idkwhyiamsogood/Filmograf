import { AxiosResponse } from "axios";

export type ApiResponse<T = undefined> = Promise<AxiosResponse<T>>