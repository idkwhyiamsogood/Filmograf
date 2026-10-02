import type { FC } from "react";
import { ClipboardCheck } from "lucide-react";

import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import { useRouter } from "@/shared/lib/router-compat";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Poster } from "@/shared/ui/poster";

export interface ClipboardLinkProps {
  path: string;
  kind: "movie" | "collection";
  title: string;
  subtitle?: string;
  poster?: string;
}

export const ClipboardLinkSheet: FC<BaseModalProps & ClipboardLinkProps> = ({
  isOpen,
  path,
  kind,
  title,
  subtitle,
  poster,
}) => {
  const { closeModal } = useModals();
  const router = useRouter();
  const close = () => closeModal("clipboard-link");

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      title="Ссылка из буфера обмена"
      description={kind === "movie" ? "Открыть этот фильм?" : "Открыть эту подборку?"}
      footer={
        <div className="grid grid-cols-2 gap-2 pb-1">
          <Button variant="secondary" className="h-12 rounded-xl text-[15px] font-bold" onClick={close}>
            Не сейчас
          </Button>
          <Button
            className="h-12 rounded-xl text-[15px] font-bold"
            onClick={() => {
              close();
              router.push(path);
            }}
          >
            Открыть
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-3">
        <div className="w-16 shrink-0">
          <Poster src={poster} alt={title} width={64} rounded="rounded-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-base font-extrabold">{title}</p>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
            <ClipboardCheck className="size-3.5" /> Скопировано
          </p>
        </div>
      </div>
    </BottomSheet>
  );
};
