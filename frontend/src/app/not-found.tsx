import React from 'react';

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className="bg-background">
      404 бро я еще не сделал эту страницу :(
    </div>
  );
};

export default Page;