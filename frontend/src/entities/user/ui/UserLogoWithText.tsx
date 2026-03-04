import React from 'react';

import { getValidURL } from '@/shared/lib';

import type { IUser } from '../model/types';
import { UserLogo } from './UserLogo';

interface Props {
  user: IUser;
}

export const UserLogoWithText: React.FC<Props> = ({ user }) => {
  const validURL = getValidURL(user.logo);

  return (
    <div className='flex gap-2 items-center justify-between'>
      <p className='text-sm'>{user.username}</p>
      
      <UserLogo logo={validURL} />
    </div>
  );
};
