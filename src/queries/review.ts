"use server";

import { db } from "@/lib/db";
import { ReviewDetailsType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";

// Function: upsertReview
// Description: Upserts a review into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only for creation/updation of reviews.
// Parameters:
//   - productId: ID of the product the review is associated with.
//   - review: Review object containing details of the review to be upserted.
// Returns: Updated or newly created review details.
export const upsertReview = async (
  productId: string,
  review: ReviewDetailsType
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");

    if (!productId) throw new Error("Product ID is required");
    if (!review) throw new Error("Review is required");

    const existingReview = await db.review.findFirst({
      where: {
        productId,
        userId: user.id,
      },
    });

    let reviewData: ReviewDetailsType = review;

    if (existingReview) {
      reviewData = {
        ...reviewData,
        id: existingReview.id,
      };
    }

    const reviewDetails = await db.review.upsert({
      where: {
        id: reviewData.id,
      },
      update: {
        ...reviewData,
        images: {
          deleteMany: {},
          create: reviewData.images.map((img) => ({
            url: img.url,
          })),
        },
        userId: user.id,
      },
      create: {
        ...reviewData,
        images: {
          create: reviewData.images.map((img) => ({
            url: img.url,
          })),
        },
        productId,
        userId: user.id,
      },
      include: {
        images: true,
        user: true,
      },
    });

    //Calculate new average rating
    const productReviews = await db.review.findMany({
      where: {
        productId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = productReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating = totalRating / productReviews.length;

    const updatedProduct = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: averageRating,
        numReviews: productReviews.length,
      },
    });

    return reviewDetails;
  } catch (error) {
    console.error("Failed to upsert review", error);
    throw new Error("Failed to upsert review");
  }
};
