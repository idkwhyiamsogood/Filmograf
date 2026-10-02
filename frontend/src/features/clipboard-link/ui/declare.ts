import type { ClipboardLinkProps } from "./ClipboardLinkSheet";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    "clipboard-link": ClipboardLinkProps;
  }
}
