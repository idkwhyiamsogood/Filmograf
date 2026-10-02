import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Entity } from "@/shared/types";
import type { Comment } from "./types";

/** Лента корневых комментариев сущности — страницы по COMMENTS_PAGE штук. */
export type CommentsData = InfiniteData<Comment[], number>;

export const COMMENTS_PAGE = 10;

export const commentsKey = (entity: Pick<Entity, "type" | "entityId">) =>
  ["parentComments", entity.type, entity.entityId] as const;

/** Обновить комментарий на любой глубине дерева. null — удалить из дерева. */
export const updateInTree = (
  list: Comment[],
  id: string,
  fn: (c: Comment) => Comment | null,
): Comment[] => {
  let changed = false;
  const next: Comment[] = [];
  for (const c of list) {
    if (c.id === id) {
      changed = true;
      const updated = fn(c);
      if (updated) next.push(updated);
      continue;
    }
    if (c.childs?.length) {
      const childs = updateInTree(c.childs, id, fn);
      if (childs !== c.childs) {
        changed = true;
        next.push({ ...c, childs });
        continue;
      }
    }
    next.push(c);
  }
  return changed ? next : list;
};

/** Применить изменение к ленте комментариев сущности. */
export const updateCommentsCache = (
  qc: QueryClient,
  entity: Pick<Entity, "type" | "entityId">,
  fn: (pages: Comment[][]) => Comment[][],
) => {
  qc.setQueryData<CommentsData>(commentsKey(entity), (old) =>
    old ? { ...old, pages: fn(old.pages) } : old,
  );
};

export const updateCommentInCache = (
  qc: QueryClient,
  entity: Pick<Entity, "type" | "entityId">,
  id: string,
  fn: (c: Comment) => Comment | null,
) => {
  updateCommentsCache(qc, entity, (pages) => pages.map((p) => updateInTree(p, id, fn)));
  qc.setQueryData<Comment>(["comment", id], (old) => (old ? fn(old) ?? old : old));
};

/** Добавить ответ в ветку (родитель может быть на любой глубине). */
export const insertReply = (
  qc: QueryClient,
  entity: Pick<Entity, "type" | "entityId">,
  parentId: string,
  reply: Comment,
) =>
  updateCommentInCache(qc, entity, parentId, (parent) => ({
    ...parent,
    childsCount: parent.childsCount + 1,
    childs: [...(parent.childs ?? []), reply],
  }));
