import { useEffect, useMemo, useState, type FC } from "react";
import { Controller } from "react-hook-form";
import { Check, Plus, Search, X } from "lucide-react";
import { useDebounce } from "react-use";

import { useCollectionForm, type CollectionRedactSchema } from "@/entities/collection";
import { useInfinityTags, useTags, useTagsSearch } from "@/entities/collection-tags";
import { useCreateTag } from "@/features/tags/create-tag/model/hooks/useCreateTag";
import { cn } from "@/shared/lib/utils";
import { BottomSheet, SheetGroup, SheetOptionRow } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

const NAME_MAX = 20;

const BigSwitch: FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <Switch
    checked={checked}
    onCheckedChange={onChange}
    className="h-7 w-12 shrink-0 [&>span]:size-6"
  />
);

/** Выбор тегов: выбранные — сверху, поиск, создание нового прямо из поиска. */
const TagPicker: FC<{ value: string[]; onToggle: (id: string) => void }> = ({ value, onToggle }) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useDebounce(() => setDebounced(query.trim()), 250, [query]);

  const { tags: all, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinityTags({ pageSize: 30 });
  const { data: found = [], isLoading: isSearching } = useTagsSearch(debounced);
  const { data: selected = [] } = useTags(value);
  const { mutate: createTag, isPending: isCreating } = useCreateTag();

  const list = debounced ? found : all;
  const exact = list.some((t) => t.name.toLowerCase() === debounced.toLowerCase());

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onToggle(t.id)}
              className="press flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
            >
              #{t.name}
              <X className="size-3.5" />
            </button>
          ))}
        </div>
      )}

      <label className="flex h-11 items-center gap-2.5 rounded-xl bg-muted px-3.5 ring-primary/50 focus-within:ring-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={30}
          placeholder="Найти или создать тег"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto">
        {(isLoading || (debounced && isSearching)) &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}

        {debounced && !exact && !isSearching && (
          <button
            type="button"
            disabled={isCreating}
            onClick={() =>
              createTag({ name: debounced }, { onSuccess: (tag) => { onToggle(tag.id); setQuery(""); } })
            }
            className="press flex items-center gap-1 rounded-full border-2 border-dashed border-primary/60 px-3 py-1.5 text-xs font-bold text-primary"
          >
            <Plus className="size-3.5" />
            Создать «{debounced}»
          </button>
        )}

        {list
          .filter((t) => !t.id.startsWith("temp-"))
          .map((t) => {
            const active = value.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(t.id)}
                className={cn(
                  "press flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  active ? "bg-brand-soft text-primary ring-1 ring-primary" : "bg-muted text-foreground",
                )}
              >
                {active && <Check className="size-3.5" />}#{t.name}
              </button>
            );
          })}

        {!debounced && hasNextPage && (
          <button
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary"
          >
            Ещё теги…
          </button>
        )}
      </div>
    </div>
  );
};

interface Props {
  isOpen: boolean;
  mode: "create" | "edit";
  initial?: Partial<CollectionRedactSchema>;
  onClose: () => void;
  onSubmit: (data: CollectionRedactSchema) => void;
}

/** Одна форма для создания и настройки подборки. */
export const CollectionFormSheet: FC<Props> = ({ isOpen, mode, initial, onClose, onSubmit }) => {
  const { collectionRedactForm: form, isPublic } = useCollectionForm();
  const name = form.watch("name") ?? "";
  const tags = form.watch("tags") ?? [];

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initial?.name ?? "",
        isPublic: initial?.isPublic ?? true,
        isCommentable: initial?.isCommentable ?? true,
        isCopiable: initial?.isCopiable ?? true,
        tags: initial?.tags ?? [],
      });
    }
  }, [isOpen]);

  const toggleTag = (id: string) =>
    form.setValue("tags", tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id], {
      shouldDirty: true,
    });

  const submit = form.handleSubmit((data) => {
    onSubmit({ ...data, name: data.name.trim() });
    onClose();
  });

  const error = form.formState.errors.name?.message;
  const canSubmit = name.trim().length > 0 && (mode === "create" || form.formState.isDirty);

  const counter = useMemo(() => `${name.length}/${NAME_MAX}`, [name]);

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="tall"
      title={mode === "create" ? "Новая подборка" : "Настройки подборки"}
      description={mode === "create" ? "Название, видимость и теги можно поменять позже" : undefined}
      footer={
        <Button
          className="mb-1 h-12 w-full rounded-xl text-[15px] font-bold"
          disabled={!canSubmit}
          onClick={submit}
        >
          {mode === "create" ? "Создать подборку" : "Сохранить"}
        </Button>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6 pt-1">
        <div className="space-y-1.5">
          <div
            className={cn(
              "flex h-14 items-center rounded-xl bg-muted px-4 ring-primary/50 focus-within:ring-2",
              error && "ring-2 ring-destructive/60",
            )}
          >
            <input
              {...form.register("name")}
              maxLength={NAME_MAX}
              autoComplete="off"
              enterKeyHint="done"
              placeholder="Например, «На выходные»"
              className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
            <span
              className={cn(
                "ml-2 text-xs tabular-nums text-muted-foreground",
                name.length >= NAME_MAX && "text-destructive",
              )}
            >
              {counter}
            </span>
          </div>
          {error && <p className="px-1 text-xs font-medium text-destructive">{error}</p>}
        </div>

        <SheetGroup title="Видимость">
          <Controller
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <SheetOptionRow
                title="Публичная"
                description="Видна всем; скрытую видите только вы"
                control={<BigSwitch checked={field.value} onChange={field.onChange} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="isCommentable"
            render={({ field }) => (
              <SheetOptionRow
                title="Обсуждение"
                description="Другие смогут комментировать подборку"
                disabled={!isPublic}
                control={<BigSwitch checked={field.value} onChange={field.onChange} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="isCopiable"
            render={({ field }) => (
              <SheetOptionRow
                title="Копирование"
                description="Другие смогут сохранить копию себе"
                disabled={!isPublic}
                control={<BigSwitch checked={field.value} onChange={field.onChange} />}
              />
            )}
          />
        </SheetGroup>

        <section className="space-y-2">
          <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Теги {tags.length > 0 && `· ${tags.length}`}
          </h3>
          <TagPicker value={tags} onToggle={toggleTag} />
        </section>
      </form>
    </BottomSheet>
  );
};
