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
  /** Меньший, встраиваемый вид — для карточек/секций внутри страницы, а не на всю страницу */
  compact?: boolean;
}

export const QueryErrorState: FC<Props> = ({
  error,
  onRetry,
  notFoundMessage = "Ничего не найдено",
  serverErrorMessage = "Не удалось загрузить данные. Попробуйте ещё раз.",
  className = "",
  compact = false,
}) => {
  const isNotFound = getApiErrorStatus(error) === 404;
  const Icon = isNotFound ? SearchX : ServerCrash;

  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-center px-6 ${
        compact ? "h-40 gap-2" : "h-[calc(100vh-15rem)] gap-4"
      } ${className}`}
    >
      <Icon
        className={`text-muted-foreground opacity-65 ${compact ? "h-6 w-6" : "h-10 w-10"}`}
      />

      <p
        className={`text-muted-foreground max-w-xs ${compact ? "text-xs" : "text-sm"}`}
      >
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
