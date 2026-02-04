import React from "react";

import type { FC } from "react";

import { Rating } from "@/features/RenderStarRating";
import { ratingMock } from "@/features/RenderStarRating";

import { FilmWrapper, FilmCover } from "entities/film";

const Page: FC = () => {
  return (
    <FilmWrapper items={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}/>
  );
};

export default Page;
