import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { LoadingSplashScreen } from "@/shared/components";
import { useAuth } from "@/shared/hooks";
import { useRouter, useSearchParams } from "@/shared/lib/router-compat";

export const Route = createFileRoute("/auth-success")({
  component: AuthSuccessPage,
});

// Сюда бэкенд возвращает после веб-OAuth с одноразовым кодом.
function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const { callAuthError, verifyToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const idempotence = searchParams.get("idempotence");

    (async () => {
      try {
        if (!idempotence) throw new Error("No idempotence code");
        // Пользователь перезапросится сам — UserProvider следит за токеном.
        await verifyToken(idempotence);
      } catch {
        callAuthError();
      } finally {
        router.replace("/");
      }
    })();
  }, []);

  return <LoadingSplashScreen showMessage />;
}
