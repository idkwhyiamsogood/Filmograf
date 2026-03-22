export type BaseModel = {
  id: string;
  createDate: Date | string;
  updateDate: Date | string;
};

export type BaseID = Pick<BaseModel, "id">;

export type EntityType = "movie" | "collection";