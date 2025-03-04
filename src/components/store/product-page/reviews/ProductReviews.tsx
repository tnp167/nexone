import { RatingStatisticsType } from "@/lib/types";
import React, { FC } from "react";

interface Props {
  productId: string | undefined;
  rating: number | undefined;
  statistics: RatingStatisticsType | undefined;
}

const ProductReviews: FC<Props> = ({ productId, rating, statistics }) => {
  const { totalReviews } = statistics || {};
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
          {/* Rating Card  */}

          {/* Rating stats card */}
        </div>
      </div>
      {totalReviews! > 0 && (
        <>
          <div className="space-y-6">
            {/* Review filters */}
            {/* Review sort */}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
