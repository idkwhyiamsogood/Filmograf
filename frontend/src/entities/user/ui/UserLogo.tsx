import React from 'react';
import Image from 'next/image';

interface Props {
  logo: string;
}

export const UserLogo: React.FC<Props> = ({ logo }) => {
  return (
    <div>
      <Image src={logo} alt='user-logo' width={50} height={50}/>
    </div>
  );
};
