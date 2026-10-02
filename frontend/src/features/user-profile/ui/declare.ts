import type { UserProfileProps } from "./UserProfileSheet";

declare module "@/shared/contexts/modal-context/modals.type" {
  export interface ModalPropsMap {
    "user-profile": UserProfileProps;
  }
}
