export interface Tag {
  id: string;
  name: string;
  createData: Date | string;
}

export interface SearcedTags {
  entityIds: string[];
  type: number;
}