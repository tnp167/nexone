"use client";

import React, { useState } from "react";
import { ReviewWithImageType, VariantInfoType } from "@/lib/types";
import ReviewDetails from "../../forms/ReviewDetails";

const AddReview = ({
  productId,
  reviews,
  variantsInfo,
}: {
  productId: string;
  reviews: ReviewWithImageType[];
  variantsInfo: VariantInfoType[];
}) => {
  const [reviewsData, setReviewsData] =
    useState<ReviewWithImageType[]>(reviews);

  return (
    <div>
      <ReviewDetails
        productId={productId}
        variantsInfo={variantsInfo}
        setReviews={setReviewsData}
      />
    </div>
  );
};

export default AddReview;
