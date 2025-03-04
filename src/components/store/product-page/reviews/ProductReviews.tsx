import { RatingStatisticsType } from "@/lib/types";
import React, { FC } from "react";
import ProductRatingCard from "../../cards/ProductRating";
import RatingStatisticsCard from "../../cards/RatingStatistics";

interface Props {
  productId: string | undefined;
  rating: number | undefined;
  statistics: RatingStatisticsType | undefined;
}

const ProductReviews: FC<Props> = ({ productId, rating, statistics }) => {
  const { totalReviews, ratingStatistics } = statistics || {};
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
          <RatingStatisticsCard statistics={ratingStatistics} />
        </div>
      </div>
      {totalReviews! > 0 && (
        <>
          <div className="space-y-6">
            {/* Review filters */}
            {/* Review sort */}
          </div>
          {/* Reviews */}
          <div className="mt-10 min-h-72 grid grid-cols-2 gap-6">
            {/* Pagination */}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
