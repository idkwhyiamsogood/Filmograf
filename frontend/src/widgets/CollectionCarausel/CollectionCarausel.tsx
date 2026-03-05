import React from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";

interface Props {
  className?: string;
}

export const CollectionCarausel: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xl">Подборки</h3>
      <Carousel>
        <CarouselContent>
          
        </CarouselContent>
      </Carousel>
    </div>
  );
};
