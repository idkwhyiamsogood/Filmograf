export interface ConfirmationModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => Promise<void> | void;
}
