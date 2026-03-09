import React from "react";

import { getValidURL, getDaysFromReg } from "@/shared/lib";

import type { IUser } from "../model/types";
import { UserLogo } from "./UserLogo";

import { TemporaryUserFull } from "./TemporaryUserFull";

interface Props {
  user: IUser;
  isComment: boolean;
  openModal: () => void;
}

export const UserFull: React.FC<Props> = ({ user, isComment = true, openModal }) => {
  if (user.userType === "Guest") return <TemporaryUserFull user={user} onClick={openModal}/>;

  const validURL = getValidURL(user.avatarURL);

  return (
    <div className="flex gap-2 items-center justify-between">
      <div>
        <p className="text-sm">{user.name}</p>
        {!isComment && (
          <p className="text-[12px] text-accent-foreground/70">
            Вы с нами {getDaysFromReg(user.createDate)} !
          </p>
        )}
      </div>

      <UserLogo logo={validURL} />
    </div>
  );
};
