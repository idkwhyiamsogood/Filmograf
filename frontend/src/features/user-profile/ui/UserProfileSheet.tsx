import type { FC } from "react";
import { BadgeCheck, FolderOpen, UserRound } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { CollectionCover, collectionApi, type Collection } from "@/entities/collection";
import { UserLogo, useUser, useUserLight } from "@/entities/user";
import { EmptyState } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import { pluralize } from "@/shared/lib";
import { useRouter } from "@/shared/lib/router-compat";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

export interface UserProfileProps {
  userId: string;
}

const SCAN_PAGES = 3;
const PAGE = 50;

/**
 * Публичные подборки автора. Отдельной ручки «подборки пользователя» на бэке
 * нет (есть только /collections/my для себя), поэтому собираем их из
 * публичной выдачи — это может быть не полный список.
 */
const useAuthorCollections = (userId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["author-collections", userId],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const found: Collection[] = [];
      for (let page = 0; page < SCAN_PAGES; page++) {
        const { data } = await collectionApi.getPopular({ page, count: PAGE });
        const ids = data.ids ?? [];
        if (!ids.length) break;
        const { data: batch } = await collectionApi.batchMany({ ids });
        batch.forEach((c) => queryClient.setQueryData(["collection", c.id], c));
        found.push(...batch.filter((c) => c.userId === userId && c.isPublic && !c.isDeleted));
        if (ids.length < PAGE) break;
      }
      return found;
    },
  });
};

export const UserProfileSheet: FC<BaseModalProps & UserProfileProps> = ({ isOpen, userId }) => {
  const { closeModal } = useModals();
  const router = useRouter();
  const { user: me } = useUser();
  const { data: user, isLoading, isError } = useUserLight(userId);
  const { data: collections = [], isLoading: isCollectionsLoading } = useAuthorCollections(userId);

  const close = () => closeModal("user-profile");
  const isMe = me?.id === userId;

  return (
    <BottomSheet open={isOpen} onOpenChange={(open) => !open && close()} title="Профиль" size="tall">
      {isError ? (
        <EmptyState icon={UserRound} title="Профиль недоступен" description="Пользователь удалён или скрыт." />
      ) : (
        <div className="flex flex-col gap-6 pb-2">
          <section className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-b from-brand-soft to-transparent px-4 pt-6 pb-4 text-center">
            {isLoading ? (
              <Skeleton className="size-20 rounded-full" />
            ) : (
              <UserLogo logo={user?.avatarUrl} name={user?.name} className="size-20 text-2xl ring-4 ring-background" />
            )}
            <div>
              <h2 className="flex items-center justify-center gap-1.5 text-xl font-extrabold">
                {isLoading ? <Skeleton className="h-6 w-40" /> : user?.name ?? "Пользователь"}
                {user?.isAdmin && <BadgeCheck className="size-5 text-primary" aria-label="Команда Filmograf" />}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.isAdmin ? "Команда Filmograf" : isMe ? "Это вы" : "Зритель Filmograf"}
                {!isCollectionsLoading &&
                  ` · ${pluralize(collections.length, ["подборка", "подборки", "подборок"])}`}
              </p>
            </div>
            {isMe && (
              <Button
                variant="secondary"
                className="h-10 rounded-xl font-bold"
                onClick={() => {
                  close();
                  router.push("/profile");
                }}
              >
                Открыть мой профиль
              </Button>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Публичные подборки
            </h3>
            {isCollectionsLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
                ))}
              </div>
            ) : collections.length ? (
              <div className="grid grid-cols-2 gap-3" onClick={(e) => (e.target as HTMLElement).closest("a") && close()}>
                {collections.map((c) => (
                  <CollectionCover key={c.id} collection={c} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FolderOpen}
                title="Публичных подборок нет"
                description="Или они пока не попали в общую выдачу."
                className="py-8"
              />
            )}
          </section>
        </div>
      )}
    </BottomSheet>
  );
};
