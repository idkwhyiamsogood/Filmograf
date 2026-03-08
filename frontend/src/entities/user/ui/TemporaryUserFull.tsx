"use client";

import React from "react";

import { getValidURL } from "@/shared/lib";

import type { IUser } from "../model/types";
import { UserLogo } from "./UserLogo";

import { useModals } from "@/shared/hooks";

interface Props {
  user: IUser;
}

export const TemporaryUserFull: React.FC<Props> = ({ user }) => {
  const { openModal } = useModals();

  const validURL = getValidURL(user.avatarURL);

  return (
    <div
      className="flex gap-2 items-center justify-between"
      onClick={() => openModal("authorization")}
    >
      <div>
        <p className="text-sm">Временный пользователь</p>
      </div>

      <UserLogo logo={validURL} />
    </div>
  );
};
