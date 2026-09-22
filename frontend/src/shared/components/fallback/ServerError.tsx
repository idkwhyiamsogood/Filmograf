import type { FC } from "react";
import { ServerCrash } from "lucide-react";

import { Link } from "@/shared/ui/link";
import { Button } from "@/shared/ui/button";

interface Props {
  className?: string;
  onRetry?: () => void;
}

export const ServerError: FC<Props> = ({ className = "", onRetry }) => {
  return (
    <main
      className={`relative grid min-h-screen place-items-center bg-background overflow-hidden ${className}`}
    >
      <div className="relative z-10 text-center px-6">
        <ServerCrash className="mx-auto mb-4 h-12 w-12 text-primary" />

        <p className="text-base font-semibold text-primary animate-bounce">
          Упс :(
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Что-то пошло не так
        </h1>

        <p className="mt-6 text-base leading-7 text-muted-foreground max-w-md mx-auto">
          Сервер временно недоступен. Попробуйте обновить страницу чуть
          позже.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            onClick={onRetry ?? (() => window.location.reload())}
            className="rounded-2xl px-10 py-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Обновить
          </Button>
          <Link
            href="/"
            className="inline-block rounded-2xl border border-border px-10 py-4 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServerError;
