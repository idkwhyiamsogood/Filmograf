

import React from "react";

import { getValidURL } from "@/shared/lib";

import type { IUser } from "../model/types";
import { UserLogo } from "./UserLogo";

import { ModalType } from "@/shared/types";


interface Props {
  user: IUser;
  onClick: (type: ModalType) => void;
}

export const TemporaryUserFull: React.FC<Props> = ({ user, onClick }) => {
  const validURL = getValidURL(user.avatarURL);

  return (
    <div
      className="flex gap-2 items-center justify-between"
      onClick={() => onClick("authorization")}
    >
      <div>
        <p className="text-sm">Временный пользователь</p>
      </div>

      <UserLogo logo={validURL} />
    </div>
  );
};
