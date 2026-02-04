// types
import type { FC } from "react";

// enums
import { Review } from "entities/film";

// components
import { RatingItem } from "./RatingItem";

// icons
import { User } from "lucide-react";
import IMDB from "@/public/imdb.png"
import Kinopoisk from "@/public/kp.png"

interface Props {
  data: Record<Review, number | undefined>[]
}

export const Rating: FC<Props> = ({ data }) => {
  const reviewValues = Object.values(Review)
    .filter(value => typeof value === 'number') as Review[];

  const sourceImg = [IMDB, Kinopoisk, User];

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((item, index) => {
        const ratingValue = item[reviewValues[index]];
        
        // Пропускаем если рейтинга нет
        if (ratingValue === undefined) return null;
        
        return (
          <RatingItem 
            key={reviewValues[index]}
            rating={ratingValue} 
            sourceImg={sourceImg[index]}
          />
        );
      })}
    </div>
  );
};