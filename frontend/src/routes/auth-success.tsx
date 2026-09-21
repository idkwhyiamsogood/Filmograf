import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CommonWrapper, LoadingSplashScreen } from "@/shared/components";
import { useAuth } from "@/shared/hooks";
import { useUser } from "@/entities/user";
import { useRouter, useSearchParams } from "@/shared/lib/router-compat";

export const Route = createFileRoute("/auth-success")({
  component: AuthSuccessRoute,
});

function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const { callAuthError, verifyToken, token } = useAuth();
  const { setCurrentUser } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const idempotence = searchParams.get("idempotence");

      if (!idempotence) {
        callAuthError();
        return;
      }

      verifyToken(idempotence);
    } catch (e) {
      callAuthError();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setCurrentUser();
    } finally {
      router.push("/");
    }
  }, [loading]);

  return <div>{loading && <LoadingSplashScreen />}</div>;
}

function AuthSuccessRoute() {
  return (
    <CommonWrapper>
      <AuthSuccessPage />
    </CommonWrapper>
  );
}
