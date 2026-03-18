import { AxiosResponse } from "axios";

export type APIResponse<T = undefined> = Promise<AxiosResponse<T>>;

export interface APIError {
  statusCode: number;
  message: string;
  code: string;
  data: any;
}
