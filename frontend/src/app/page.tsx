"use client";

// types
import { FC } from "react";

// components
import { Rating, ratingMock } from "@/features/RenderStarRating";

import { useAuth } from "@/shared/hooks/useAuth";

const Page: FC = () => {
  const auth = useAuth();

  return (
    <div>
      <Rating data={ratingMock} />
    </div>
  );
};

export default Page;
