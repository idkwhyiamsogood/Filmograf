import { FC } from "react";
import { Clapperboard } from "lucide-react";

interface Props {
  message?: string | undefined;
  showMessage?: boolean | undefined;
}

export const LoadingSplashScreen: FC<Props> = ({ showMessage = false, message }) => (
  <div className="flex h-[70dvh] w-full flex-col items-center justify-center gap-4">
    <div className="relative flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-primary">
      <Clapperboard className="size-8 animate-pulse" />
    </div>
    <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
      <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
    </div>
    {showMessage && (
      <p className="text-sm text-muted-foreground">{message ?? "Загружаем…"}</p>
    )}
  </div>
);
