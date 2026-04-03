import { AxiosResponse } from "axios";

export type APIResponse<T = undefined> = Promise<AxiosResponse<T>>;

export interface APIError {
  statusCode: number;
  message: string;
  code: string;
  data: any;
}

export interface IdsEntity {
  ids: string[];
}

export interface SearchedIds {
  entityIds: string[];
  type: number;
}

export interface QueryParams {
  page?: number;
  count?: number;
}
