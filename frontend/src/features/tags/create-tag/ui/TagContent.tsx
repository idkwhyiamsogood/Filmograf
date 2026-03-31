import type { FC } from "react";

import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { MessageCircleWarning } from "lucide-react";

import { useTagsForm } from "../model/hooks/useTagsForm";

interface Props {
  text: string;
} 

export const TagContent: FC<Props> = ({ text }) => {
  const { tagsForm } = useTagsForm(text);

  return (
    <div className="space-y-2.5">
      <FormField
        control={tagsForm.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Введите название закладки"
                className="w-full rounded-2xl"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-2.5">
        <MessageCircleWarning size={16} />
        <Label className="text-sm text-muted">
          При создании тега коллекции учтите, что они являются общедоступными и
          могут быть использованы другими пользователями без вашего согласия.
        </Label>
      </div>
    </div>
  );
};
