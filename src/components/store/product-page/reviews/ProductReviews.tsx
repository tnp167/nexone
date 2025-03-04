"use client";

import {
  ProductPageDataType,
  RatingStatisticsType,
  ReviewWithImageType,
} from "@/lib/types";
import React, { FC, useState } from "react";
import ProductRatingCard from "../../cards/ProductRating";
import RatingStatisticsCard from "../../cards/RatingStatistics";
import ReviewCard from "../../cards/Review";

interface Props {
  productId: string | undefined;
  rating: number | undefined;
  statistics: RatingStatisticsType | undefined;
  reviews: ReviewWithImageType[];
}

const ProductReviews: FC<Props> = ({
  productId,
  rating,
  statistics,
  reviews,
}) => {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);
  const { totalReviews, ratingStatistics } = statistics || {};
  const half = Math.ceil(data.length / 2);
  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Customer Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-ceter gap-4">
          <ProductRatingCard rating={rating || 0} />
          <RatingStatisticsCard statistics={ratingStatistics || []} />
        </div>
      </div>
      {totalReviews! > 0 && (
        <>
          <div className="space-y-6">
            {/* Review filters */}
            {/* Review sort */}
          </div>
          {/* Reviews */}
          <div className="mt-10 min-h-72 grid grid-cols-2 gap-3">
            {data.length > 0 && (
              <>
                <div className="flex flex-col gap-3">
                  {data.slice(0, half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {data.slice(half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            )}
            {/* Pagination */}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
