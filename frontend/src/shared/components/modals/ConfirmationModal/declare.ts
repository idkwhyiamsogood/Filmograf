import { ModalTypeEnum } from "@/shared/contexts/modal-context/modals.type";
import type { ConfirmationModalProps } from "./props";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    [ModalTypeEnum.CONFIRMATION_MENU]: ConfirmationModalProps;
  }
}
