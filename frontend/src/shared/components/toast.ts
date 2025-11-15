import {toast} from "sonner";

export const toastMessage = {
    showMessage: (message: string) => toast.message(message),
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message)
}