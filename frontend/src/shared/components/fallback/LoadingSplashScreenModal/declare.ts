import { ModalTypeEnum } from "@/shared/contexts/modal-context/modals.type";
import type { LoadingSplashScreenModalProps } from "./props";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    [ModalTypeEnum.SHOW_LOADING]: LoadingSplashScreenModalProps;
  }
}
