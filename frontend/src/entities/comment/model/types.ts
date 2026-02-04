export interface IComment {
  id: number;
  text: string;
  user: object // like type user in type collection

  parentComment: string | undefined;
  childs: IComment[];

  createdAt: Date;
  updatedAt: Date;
}

export type CommentCreate = Omit<IComment, "id">