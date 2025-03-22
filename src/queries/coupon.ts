"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { Coupon } from "@prisma/client";

// Function: upsertCoupon
// Description: Upserts a coupon into the database, updating it if it exists or creating a new one if not.
// Permission Level: Seller only
// Parameters:
//   - coupon: Coupon object containing details of the coupon to be upserted.
//   - storeUrl: String representing the store's unique URL, used to retrieve the store ID.
// Returns: Updated or newly created coupon details.
export const upsertCoupon = async (coupon: Coupon, storeUrl: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized");
    }
    if (
      !coupon.code ||
      !coupon.discount ||
      !coupon.startDate ||
      !coupon.endDate
    ) {
      throw new Error("Invalid coupon details");
    }

    if (!storeUrl) {
      throw new Error("Store URL is required");
    }

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const existingCoupon = await db.coupon.findFirst({
      where: {
        AND: [
          { code: coupon.code },
          { storeId: store.id },
          {
            NOT: {
              id: coupon.id,
            },
          },
        ],
      },
    });

    if (existingCoupon) {
      throw new Error("Coupon already exists");
    }

    const couponDetails = await db.coupon.upsert({
      where: {
        id: coupon.id,
      },
      update: { ...coupon, storeId: store.id },
      create: { ...coupon, storeId: store.id },
    });

    return couponDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upsert coupon");
  }
};

// Function: getStoreCoupons
// Description: Retrieves all coupons for a specific store based on the provided store URL.
// Permission Level: Seller only
// Parameters:
//   - storeUrl: String representing the store's unique URL, used to retrieve the store ID.
// Returns: Array of coupon details for the specified store.
export const getStoreCoupons = async (storeUrl: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized");
    }

    if (!storeUrl) {
      throw new Error("Store URL is required");
    }

    //Retrieve store ID and ensure it belongs to the user
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    if (store.userId !== user.id) {
      throw new Error("Unauthorized. You do not have access to this store.");
    }

    //Retrieve and return all coupons for the specified store
    const coupons = await db.coupon.findMany({
      where: { storeId: store.id },
    });

    return coupons;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve coupons");
  }
};

// Function: getCoupon
// Description: Retrieves a specific coupon from the database.
// Access Level: Public
// Parameters:
//   - couponId: The ID of the coupon to be retrieved.
// Returns: Details of the requested coupon.
export const getCoupon = async (couponId: string) => {
  try {
    const coupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    return coupon;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve coupon");
  }
};

// Function: deleteCoupon
// Description: Deletes a coupon from the database.
// Permission Level: Seller only (must be the store owner)
// Parameters:
//   - couponId: The ID of the coupon to be deleted.
//   - storeUrl: The URL of the store associated with the coupon.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteCoupon = async (couponId: string, storeUrl: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error("Unauthorized. You do not have access to this store.");
    }

    if (!storeUrl || !couponId) {
      throw new Error(
        "Invalid parameters, store URL and coupon ID is required."
      );
    }

    const store = await db.store.findUnique({
      where: { url: storeUrl },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    if (store.userId !== user.id) {
      throw new Error("Unauthorized. You do not have access to this store.");
    }

    const response = await db.coupon.delete({
      where: { id: couponId, storeId: store.id },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete coupon");
  }
};
