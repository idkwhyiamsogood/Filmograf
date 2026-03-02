"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/api/auth.api";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idempotence = searchParams.get("idempotence");
    console.log(idempotence);

    if (!idempotence) {
      setError("Missing idempotence code");
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyIdempotence(idempotence);
        console.log(idempotence);

        const jwt = response.data.jwt;
        console.log(jwt);

        authApi.setAccessToken(jwt);

        // редиректим на главную
        router.replace("/");
      } catch (err) {
        console.error(err);
        setError("Authorization failed");
      }
    };

    verify();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Auth error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Authorizing...
    </div>
  );
}