import { useEffect, useMemo, useState, type FC } from "react";
import { Controller } from "react-hook-form";
import { Check, Plus, Search } from "lucide-react";
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

/** Выбор тегов: отмечаются прямо в общем списке, поиск, создание нового из поиска. */
const TagPicker: FC<{ value: string[]; onToggle: (id: string) => void }> = ({ value, onToggle }) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useDebounce(() => setDebounced(query.trim()), 250, [query]);

  const { tags: all, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinityTags({ pageSize: 30 });
  const { data: found = [], isLoading: isSearching } = useTagsSearch(debounced);
  const { data: selected = [] } = useTags(value);
  const { mutate: createTag, isPending: isCreating } = useCreateTag();

  // Выбранные теги, которых нет на загруженных страницах, — в начало списка,
  // чтобы их всегда можно было увидеть и снять.
  const list = debounced
    ? found
    : [...selected.filter((t) => !all.some((a) => a.id === t.id)), ...all];
  const exact = list.some((t) => t.name.toLowerCase() === debounced.toLowerCase());

  return (
    <div className="space-y-3">
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

      {/* Без своей прокрутки — скроллится только шторка */}
      <div className="flex flex-wrap gap-1.5">
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
  // Два шага, как раньше: 1 — название и видимость, 2 — теги.
  const [step, setStep] = useState<0 | 1>(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
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
  const hasName = name.trim().length > 0;
  const canSubmit = hasName && (mode === "create" || form.formState.isDirty);

  const next = async () => {
    if (await form.trigger("name")) setStep(1);
  };

  const counter = useMemo(() => `${name.length}/${NAME_MAX}`, [name]);

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size={step === 1 ? "tall" : "auto"}
      title={step === 0 ? (mode === "create" ? "Новая подборка" : "Настройки подборки") : "Теги"}
      description={
        <span className="flex items-center gap-2">
          <span className="flex gap-1">
            {[0, 1].map((i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full transition-all", i === step ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30")}
              />
            ))}
          </span>
          Шаг {step + 1} из 2 · {step === 0 ? "название и видимость" : "по ним подборку будет проще найти"}
        </span>
      }
      onBack={step === 1 ? () => setStep(0) : undefined}
      footer={
        step === 0 ? (
          <Button className="mb-1 h-12 w-full rounded-xl text-[15px] font-bold" disabled={!hasName} onClick={next}>
            Далее
          </Button>
        ) : (
          <div className="mb-1 grid grid-cols-[auto_1fr] gap-2">
            <Button variant="secondary" className="h-12 rounded-xl px-5 text-[15px] font-bold" onClick={() => setStep(0)}>
              Назад
            </Button>
            <Button className="h-12 rounded-xl text-[15px] font-bold" disabled={!canSubmit} onClick={submit}>
              {mode === "create" ? "Создать подборку" : "Сохранить"}
            </Button>
          </div>
        )
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          step === 0 ? next() : submit();
        }}
        className="flex flex-col gap-6 pt-1"
      >
        {step === 0 && (
          <>
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
          </>
        )}

        {step === 1 && <TagPicker value={tags} onToggle={toggleTag} />}
      </form>
    </BottomSheet>
  );
};
