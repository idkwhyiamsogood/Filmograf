import { ModalTypeEnum } from "@/shared/contexts/modal-context/modals.type";
import type { UpdateCollectionModalProps } from "./props";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    [ModalTypeEnum.UPDATE_BOOKMARK]: UpdateCollectionModalProps;
  }
}
