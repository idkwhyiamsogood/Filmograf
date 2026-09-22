import { ModalTypeEnum } from "@/shared/contexts/modal-context/modals.type";
import type { CreateTagModalProps } from "./props";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    [ModalTypeEnum.CREATE_TAG]: CreateTagModalProps;
  }
}
