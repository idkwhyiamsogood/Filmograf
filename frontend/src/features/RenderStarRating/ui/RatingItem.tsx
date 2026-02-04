// types
import type { FC } from "react";
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";

// components
import Image from "next/image";

interface Props {
  rating: number;
  sourceImg: StaticImageData | LucideIcon;
}

export const RatingItem: FC<Props> = ({ rating, sourceImg }) => {
  const SourceIcon = sourceImg as LucideIcon;
  
  return (
    <div className="flex gap-1.25 items-center">
      {('src' in sourceImg) ? (
        <Image 
          alt="Rating source" 
          src={sourceImg} 
          width={20} 
          height={20} 
          className="w-5 h-5"
        />
      ) : (
        <SourceIcon className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{rating}/10</span>
    </div>
  );
};