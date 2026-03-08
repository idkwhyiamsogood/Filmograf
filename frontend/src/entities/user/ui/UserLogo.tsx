import React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { getValidURL } from '@/shared/lib';

interface Props {
  logo: string;
}

export const UserLogo: React.FC<Props> = ({ logo }) => {
  const logoURL = getValidURL(logo);

  return (
    <Avatar>
      <AvatarImage src={logoURL} alt="user-log" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
