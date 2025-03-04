"use client";

import React, { FC } from "react";
import ReactStars from "react-rating-stars-component";

interface Props {
  rating: number;
}

const ProductRatingCard: FC<Props> = ({ rating }) => {
  const fixedRating = Number(rating.toFixed(2));
  return (
    <div className="h-44 flex-1">
      <div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflowhidden rounded-lg">
        <div className="text-6xl font-bold">{rating}</div>
        <div className="py-1.5">
          <ReactStars
            count={5}
            value={fixedRating}
            color="#E2DFDF"
            activeColor="#FFD804"
            edit={false}
            size={24}
            char="★"
          />
        </div>
        <div className="text-[#8dd02a] leading-5 mt-2">
          All from verified purchases
        </div>
      </div>
    </div>
  );
};

export default ProductRatingCard;
