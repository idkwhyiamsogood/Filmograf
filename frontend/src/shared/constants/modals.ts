import { lazy } from "react";

export const MODALS = {
  "create-bookmark": lazy(() => 
    import("@/features/collection/create-collection").then(module => ({ 
      default: module.CreateCollectionModal 
    }))
  ),
  "confirmation": lazy(() => 
    import("@/shared/components/").then(module => ({ 
      default: module.ConfirmationModal 
    }))
  ),
  "update-bookmark": lazy(() => 
    import("@/features/collection/update-collection").then(module => ({ 
      default: module.UpdateCollectionModal 
    }))
  ),
  "authorization": lazy(() => 
    import("@/widgets/LoginModal/AuthorizationModal").then(module => ({ 
      default: module.AuthorizationModal 
    }))
  ),
  "loading": lazy(() => 
    import("@/shared/components/").then(module => ({ 
      default: module.LoadingSplashScreenModal 
    }))
  ),
  "right-menu": lazy(() => 
    import("@/widgets/RightMenu").then(module => ({ 
      default: module.RightMenu 
    }))
  ),
} as const;