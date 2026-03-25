import { Button } from "@/shared/ui/button";
import { FC } from "react";
import { Send } from "lucide-react";
import { X } from "lucide-react";

interface Props {
  setInactive: () => void;
  handleSend: () => void;
  isSmall: boolean;
}

export const CommentEditorActions: FC<Props> = ({
  setInactive,
  handleSend,
  isSmall,
}) => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Button type="button" variant="ghost" onClick={setInactive}>
        {isSmall ? <X className="size-4" /> : "Отмена"}
      </Button>
      <Button type="button" onClick={handleSend}>
        {isSmall ? <Send className="size-4" /> : "Отправить"}
      </Button>
    </div>
  );
};
