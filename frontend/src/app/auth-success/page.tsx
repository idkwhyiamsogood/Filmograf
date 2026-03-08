"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FC, useEffect, useState } from "react";

import { LoadingSplashScreen } from "@/shared/components";
import { useAuth } from "@/shared/hooks";
import { useUser } from "@/entities/user";

const AuthSuccessPage: FC = () => {
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
};

export default AuthSuccessPage;
