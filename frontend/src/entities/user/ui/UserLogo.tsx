import React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { getValidURL } from '@/shared/lib';

interface Props {
  logo: string;
}

export const UserLogo: React.FC<Props> = ({ logo }) => {

  return (
    <Avatar>
      <AvatarImage src={logo} alt="user-log" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
