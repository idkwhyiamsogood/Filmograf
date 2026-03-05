"use client";

// types
import { FC, useEffect } from "react";

// components
import { useModals } from "@/shared/hooks";
import { useAuth } from "@/shared/hooks";

const Page: FC = () => {
  const { openModal } = useModals();
  const { token } = useAuth();

  useEffect(() => {
    !token && openModal("authorization");
  }, [])

  return null;
};

export default Page;
