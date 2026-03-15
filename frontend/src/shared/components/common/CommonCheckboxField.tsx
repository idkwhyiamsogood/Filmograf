import React from "react";
import { Label } from "@/shared/ui/label";
import { Check, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  label: string;
  handleToggle: () => void;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
}

export const CommonCheckboxField: React.FC<Props> = ({
  label,
  handleToggle,
  checked = false,
  indeterminate = false,
  disabled = false,
}) => {
  const checkboxId = `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const renderIcon = () => {
    if (indeterminate) {
      return <X className="h-3.5 w-3.5" />;
    }
    if (checked) {
      return <Check className="h-3.5 w-3.5" />;
    }
    return null;
  };

  const getStateClasses = () => {
    if (disabled) return "bg-muted border-muted-foreground/20";
    if (indeterminate) return "bg-primary border-primary";
    if (checked) return "bg-green-500 border-primary";
    return "bg-transparent border-input hover:bg-accent/50";
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        id={checkboxId}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          getStateClasses(),
        )}
      >
        {renderIcon()}
      </button>
      <Label
        htmlFor={checkboxId}
        className={cn(
          "cursor-pointer text-sm",
          disabled && "text-muted-foreground cursor-not-allowed",
          !disabled && checked && "text-green-600 font-medium",
          !disabled && indeterminate && "text-primary font-medium",
        )}
      >
        {label}
      </Label>
    </div>
  );
};
