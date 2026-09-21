import { BaseHttpClient } from "@/shared/lib/http/axios";
import { APIResponse } from "@/shared/types/api";

import type { Collection, CreateCollection, UpdateCollection } from "../types";
import type { IdsEntity, QueryParams } from "@/shared/types/";

class CollecionApi extends BaseHttpClient {
  public getCollection = async (id: string): APIResponse<Collection> => {
    return this.get(`/api/collections/${id}`);
  };

  public createCollection = async (
    data: CreateCollection,
  ): APIResponse<Collection> => {
    return this.post("/api/collections", data);
  };

  public updateCollection = async (
    data: UpdateCollection,
  ): APIResponse<null> => {
    return this.patch(`/api/collections/${data.id}`, data.data);
  };

  public deleteCollection = async (id: string): APIResponse<null> => {
    return this.delete(`/api/collections/${id}`);
  };

  public batchMany = async (data: IdsEntity): APIResponse<Collection[]> => {
    return this.post(`/api/collections/batch-many`, data);
  };

  public getMy = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(`/api/collections/my?Page=${params.page}&Count=${params.count}`);
  };

  public getPopular = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(
      `/api/collections/popular?Page=${params.page}&Count=${params.count}`,
    );
  };

  public getRecommended = async (
    params: QueryParams = { page: 0, count: 21 },
  ): APIResponse<IdsEntity> => {
    return this.get(
      `/api/collections/recommended?Page=${params.page}&Count=${params.count}`,
    );
  };

  public copyCollection = async (id: string, data: CreateCollection): APIResponse<Collection> => {
    return this.post(`/api/collections/${id}/copy`, data);
  };

  public addMovieToCollection = async (
    movieId: string,
    collectionId: string,
  ): APIResponse<null> => {
    return this.put(`/api/collections/${collectionId}/movie/${movieId}`);
  };

  public deleteMovieFromCollection = async (
    movieId: string,
    collectionId: string,
  ): APIResponse<null> => {
    return this.delete(`/api/collections/${collectionId}/movie/${movieId}`);
  };
}

export const collectionApi = new CollecionApi();
