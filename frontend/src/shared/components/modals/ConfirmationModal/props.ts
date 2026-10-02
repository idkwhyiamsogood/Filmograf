export interface ConfirmationModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => Promise<void> | void;
  /** Необратимое действие — кнопка подтверждения красная (по умолчанию да) */
  destructive?: boolean;
}
