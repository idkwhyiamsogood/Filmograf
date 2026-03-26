"use client";

// types
import { FC, useEffect } from "react";

// components
import { useAuth, useModals } from "@/shared/hooks";


const Page: FC = () => {
  const { openModal } = useModals();
  const { token } = useAuth();

  useEffect(() => {
    !token && openModal("authorization-menu");
  }, []);

  return null;
};

export default Page;
