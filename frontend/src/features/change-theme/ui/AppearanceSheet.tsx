import { useState, type FC } from "react";
import { Check, Monitor, Moon, Shuffle, Sun } from "lucide-react";

import { useAppearance } from "@/shared/context";
import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import {
  dailyPalette,
  DEFAULT_APPEARANCE,
  PALETTES,
  resolvePalette,
  type AppearanceSettings,
  type ThemeMode,
} from "@/shared/lib/appearance";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Switch } from "@/shared/ui/switch";

const MODES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "Авто", icon: Monitor },
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
];

const swatch = (hue: number, chroma: number, darkText: boolean) =>
  `oklch(${darkText ? 0.72 : 0.6} ${chroma} ${hue})`;

export const AppearanceSheet: FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { settings, setAppearance } = useAppearance();
  // Выбор копится в черновике и применяется только по «Сохранить»;
  // закрыть шторку без сохранения — отменить изменения.
  const [draft, setDraft] = useState<AppearanceSettings>(settings);
  const palette = resolvePalette(draft);
  const isDaily = draft.accent === "daily";
  const today = dailyPalette();

  const same = (a: AppearanceSettings, b: AppearanceSettings) => a.accent === b.accent && a.mode === b.mode;
  const isDirty = !same(draft, settings);
  const isDefault = same(draft, DEFAULT_APPEARANCE);

  const setMode = (mode: ThemeMode) => setDraft((d) => ({ ...d, mode }));
  const setAccent = (accent: string) => setDraft((d) => ({ ...d, accent }));

  const save = () => {
    if (isDirty) setAppearance(draft);
    closeModal("appearance");
  };

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && closeModal("appearance")}
      title="Оформление"
      description="Тема и акцентный цвет приложения"
      footer={
        <div className="flex gap-2 pb-1">
          <Button
            variant="secondary"
            className="h-12 flex-1 rounded-xl text-[15px] font-bold"
            disabled={isDefault}
            onClick={() => setDraft(DEFAULT_APPEARANCE)}
          >
            Сбросить
          </Button>
          <Button className="h-12 flex-1 rounded-xl text-[15px] font-bold" disabled={!isDirty} onClick={save}>
            Сохранить
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-1 pb-2">
        <section className="space-y-2">
          <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Тема</h3>
          <div role="radiogroup" className="grid grid-cols-3 gap-2">
            {MODES.map(({ value, label, icon: Icon }) => {
              const active = draft.mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(value)}
                  className={cn(
                    "press flex flex-col items-center gap-1.5 rounded-2xl py-3 text-sm font-semibold ring-1 transition-colors",
                    active ? "bg-brand-soft text-primary ring-primary" : "bg-muted/60 ring-transparent",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Цвет</h3>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted/60 p-3.5">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
              style={{
                background: `conic-gradient(from 0deg, ${PALETTES.map((p) => swatch(p.hue, p.chroma, p.darkText)).join(", ")}, ${swatch(PALETTES[0].hue, PALETTES[0].chroma, true)})`,
              }}
            >
              <Shuffle className="size-5 drop-shadow" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">Цвет дня</span>
              <span className="block text-xs text-muted-foreground">
                Каждый день — новый акцент. Сегодня: {today.name}
              </span>
            </span>
            <Switch
              checked={isDaily}
              onCheckedChange={(on) => setAccent(on ? "daily" : palette.id)}
              className="h-7 w-12 shrink-0 [&>span]:size-6"
            />
          </label>

          <div role="radiogroup" aria-label="Акцентный цвет" className="grid grid-cols-5 gap-x-2 gap-y-3 pt-1">
            {PALETTES.map((p) => {
              const active = !isDaily && draft.accent === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={p.name}
                  onClick={() => setAccent(p.id)}
                  className="press flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full ring-offset-2 ring-offset-popover transition-all",
                      active ? "ring-2 ring-foreground" : isDaily && palette.id === p.id ? "ring-2 ring-dashed ring-muted-foreground" : "",
                    )}
                    style={{ background: swatch(p.hue, p.chroma, p.darkText) }}
                  >
                    {active && <Check className={cn("size-5", p.darkText ? "text-black/70" : "text-white")} strokeWidth={3} />}
                  </span>
                  <span className={cn("text-[11px] font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

      </div>
    </BottomSheet>
  );
};
