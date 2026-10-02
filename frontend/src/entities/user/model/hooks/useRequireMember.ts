import { useCallback } from "react";

import { useAuth } from "@/shared/hooks";
import { useModals } from "@/shared/contexts/modal-context";

/**
 * Оборачивает действие, доступное только вошедшим (оценки, комментарии,
 * подборки): гостю вместо ответа 403 от бэка показываем шторку входа
 * с понятной причиной.
 *
 * const requireMember = useRequireMember();
 * onClick={() => requireMember("оценивать фильмы", () => openRateSheet())}
 */
export const useRequireMember = () => {
  const { isGuest } = useAuth();
  const { openModal } = useModals();

  return useCallback(
    (reason: string, action?: () => void) => {
      if (isGuest) {
        openModal("authorization-menu", { reason });
        return false;
      }
      action?.();
      return true;
    },
    [isGuest, openModal],
  );
};
