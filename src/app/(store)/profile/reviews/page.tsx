import ReviewsContainer from "@/components/store/profile/reviews/ReviewsContainer";
import { getUserReviews } from "@/queries/profile";
import React from "react";

const PaymentReviewsPage = async () => {
  const response = await getUserReviews();
  const { reviews, totalPages } = response;
  return (
    <div className="bg-white py-3 px-6">
      <h1 className="text-lg font-bold">Your reviews</h1>
      <ReviewsContainer reviews={reviews} totalPages={totalPages} />
    </div>
  );
};

export default PaymentReviewsPage;
