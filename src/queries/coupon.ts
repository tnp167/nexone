"use server";

import { db } from "@/lib/db";
import { CartWithCartItemsType } from "@/lib/types";
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

/**
 * Applies a coupon to a cart for items belonging to the coupon's store.
 *
 * @param couponCode - The coupon code to apply.
 * @param cartId - The ID of the cart to apply the coupon to.
 * @returns A message indicating success or failure, along with the updated cart.
 */

export const applyCoupon = async (
  couponCode: string,
  cartId: string
): Promise<{ message: string; cart: CartWithCartItemsType }> => {
  try {
    //Fetch the coupon details
    const coupon = await db.coupon.findUnique({
      where: {
        code: couponCode,
      },
      include: {
        store: true,
      },
    });
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    //Validate the coupon's data range
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (currentDate < startDate || currentDate > endDate) {
      throw new Error("Coupon is not valid for this date");
    }

    //Fetch the cart and validate its existance
    const cart = await db.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        cartItems: true,
        coupon: true,
      },
    });
    if (!cart) {
      throw new Error("Cart not found");
    }

    //Ensure no copupon is already applied to cart
    if (cart.couponId) {
      throw new Error("Coupon already applied to cart");
    }

    //Filter items from the store associated with the coupon
    const storeId = coupon.storeId;
    const storeItems = cart.cartItems.filter(
      (item) => item.storeId === storeId
    );

    if (storeItems.length === 0) {
      throw new Error(
        "No items in the cart belong to the store associated with the coupon"
      );
    }

    //Calculate the discount of the store items
    const storeSubTotal = storeItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const storeShippingTotal = storeItems.reduce((acc, item) => {
      return acc + item.shippingFee;
    }, 0);

    const storeTotal = storeSubTotal + storeShippingTotal;

    const discountAmount = (storeTotal * coupon.discount) / 100;

    const newCartTotal = cart.total - discountAmount;

    //Update the cart with the applied coupon and new total
    const updatedCart = await db.cart.update({
      where: { id: cartId },
      data: {
        total: newCartTotal,
        couponId: coupon.id,
      },
      include: {
        cartItems: true,
        coupon: true,
      },
    });

    return {
      message: `Coupon applied successfully. Discount: £${discountAmount.toFixed(
        2
      )} applied to ${storeItems.length} items.`,
      cart: updatedCart,
    };
  } catch (error: any) {
    console.error("Error applying coupon", error);
    throw new Error("Failed to apply coupon");
  }
};
