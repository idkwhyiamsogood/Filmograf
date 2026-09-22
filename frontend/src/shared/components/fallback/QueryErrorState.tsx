import type { FC } from "react";
import { RefreshCw, SearchX, ServerCrash } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { getApiErrorStatus } from "@/shared/lib";

interface Props {
  error?: unknown;
  onRetry?: () => void;
  notFoundMessage?: string;
  serverErrorMessage?: string;
  className?: string;
}

export const QueryErrorState: FC<Props> = ({
  error,
  onRetry,
  notFoundMessage = "Ничего не найдено",
  serverErrorMessage = "Не удалось загрузить данные. Попробуйте ещё раз.",
  className = "",
}) => {
  const isNotFound = getApiErrorStatus(error) === 404;
  const Icon = isNotFound ? SearchX : ServerCrash;

  return (
    <div
      className={`flex w-full h-[calc(100vh-15rem)] flex-col items-center justify-center gap-4 text-center px-6 ${className}`}
    >
      <Icon className="h-10 w-10 text-muted-foreground opacity-65" />

      <p className="text-sm text-muted-foreground max-w-xs">
        {isNotFound ? notFoundMessage : serverErrorMessage}
      </p>

      {!isNotFound && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onRetry ?? (() => window.location.reload())}
        >
          <RefreshCw className="h-4 w-4" />
          Повторить
        </Button>
      )}
    </div>
  );
};

export default QueryErrorState;
