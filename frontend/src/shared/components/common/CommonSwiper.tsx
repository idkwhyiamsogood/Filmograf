"use client";

import React from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  title: string;
  href?: string;
  childrens: ReactNode[];
}

export const CommonSwiper: React.FC<Props> = ({ title, href, childrens }) => {
  const router = useRouter();

  const handleClick = () => {
    href && router.push(href);
    return;
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xl" onClick={() => href && handleClick}>
        {title}
      </h3>
      <Carousel>
        <CarouselContent>
          {childrens.map((children) => (
            <CarouselItem>{children}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
