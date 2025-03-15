"use server";

import { db } from "@/lib/db";
import { CartProductType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getShippingDetails } from "./product";
import { ShippingAddress } from "@prisma/client";

/**
 * @name followStore
 * @description - Toggle follow status for a store by the current user.
 *              - If the user is not following the store, it follows the store.
 *              - If the user is already following the store, it unfollows the store.
 * @access User
 * @param storeId - The ID of the store to be followed/unfollowed.
 * @returns {boolean} - Returns true if the user is now following the store, false if unfollowed.
 */

export const followStore = async (storeId: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    const store = await db.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) throw new Error("Store not found");

    const userData = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userData) throw new Error("User not found");

    const userFollowingStore = await db.user.findUnique({
      where: {
        id: user.id,
        following: {
          some: {
            id: storeId,
          },
        },
      },
    });

    if (userFollowingStore) {
      await db.store.update({
        where: {
          id: storeId,
        },
        data: {
          followers: {
            disconnect: { id: userData.id },
          },
        },
      });
      return false;
    } else {
      await db.store.update({
        where: {
          id: storeId,
        },
        data: {
          followers: { connect: { id: userData.id } },
        },
      });
      return true;
    }
  } catch (error) {
    console.error("Failed to follow store", error);
    return false;
  }
};

/*
 * Function: saveUserCart
 * Description: Saves the user's cart by validating product data from the database and ensuring no frontend manipulation.
 * Permission Level: User who owns the cart
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */
export const saveUserCart = async (
  cartProducts: CartProductType[]
): Promise<boolean> => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const userId = user.id;

  // Search for exisiting user cart
  const userCart = await db.cart.findFirst({
    where: { userId },
  });

  //Delete any exisiting user cart
  if (userCart) {
    await db.cart.delete({
      where: {
        userId,
      },
    });
  }

  //Fetch product, variant, and size data from the database for validation
  const validateCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      //Fetch product, variant, and size data from the database
      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          store: true,
          freeShipping: {
            include: {
              eligibleCountries: true,
            },
          },
          variants: {
            where: {
              id: variantId,
            },
            include: {
              images: true,
              sizes: {
                where: {
                  id: sizeId,
                },
              },
            },
          },
        },
      });

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      )
        throw new Error(
          `Invalid product or variant/size for product ${productId}, variant ${variantId}, size ${sizeId}`
        );

      const variant = product.variants[0];
      const size = variant.sizes[0];

      //Validate stock and price
      const validQuantity = Math.min(quantity, size.quantity);

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      //Calculate shipping details
      const countryCookie = await getCookie("userCountry", { cookies });

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (countryCookie) {
        const country = JSON.parse(countryCookie);
        const tempDetails = await getShippingDetails(
          product.shippingFeeMethod,
          country,
          product.store,
          product.freeShipping
        );

        if (typeof tempDetails !== "boolean") {
          details = tempDetails;
        }
      }

      let shippingFee = 0;
      const { shippingFeeMethod } = product;
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : details.shippingFee + details.extraShippingFee * (quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee = details.shippingFee * (variant.weight || 0) * quantity;
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQuantity + shippingFee;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        storeId: product.storeId,
        sku: variant.sku,
        name: `${product.name} - ${variant.variantName}`,
        image: variant.images[0].url,
        size: size.size,
        quantity: validQuantity,
        price,
        shippingFee,
        totalPrice,
      };
    })
  );

  //Recalculate the cart's total price and shipping fee
  const subTotal = validateCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFees = validateCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0
  );

  const total = subTotal + shippingFees;

  const cart = await db.cart.create({
    data: {
      cartItems: {
        create: validateCartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          storeId: item.storeId,
          sku: item.sku,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
        })),
      },
      shippingFees,
      subTotal,
      total,
      userId,
    },
  });

  if (cart) return true;
  return false;
};

// Function: getUserShippingAddresses
// Description: Retrieves all shipping addresses for a specific user.
// Permission Level: User who owns the addresses
// Parameters: None
// Returns: List of shipping addresses for the user.
export const getUserShippingAddresses = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");

    //Retrieve all shipping addresses for the specidfied user
    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        country: true,
      },
    });
    return shippingAddresses;
  } catch (error) {
    console.error("Failed to get user shipping addresses", error);
    throw error;
  }
};

// Function: getUserShippingAddresses
// Description: Retrieves all shipping addresses for a specific user.
// Permission Level: User who owns the addresses
// Parameters: None
// Returns: List of shipping addresses for the user.
export const upsertShippingAddress = async (address: ShippingAddress) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");
    if (!address) throw new Error("Address is required");

    // Making the rest of address default false when adding a new default address
    if (address.default) {
      const addressDB = await db.shippingAddress.findUnique({
        where: { id: address.id },
      });
      if (addressDB) {
        try {
          await db.shippingAddress.updateMany({
            where: {
              userId: user.id,
              default: true,
            },
            data: {
              default: false,
            },
          });
        } catch (error) {
          console.error("Failed to update default shipping address", error);
          throw new Error("Failed to update default shipping address");
        }
      }
    }

    const upsertedAddress = await db.shippingAddress.upsert({
      where: {
        id: address.id,
      },
      update: {
        ...address,
        userId: user.id,
      },
      create: {
        ...address,
        userId: user.id,
      },
    });

    return upsertedAddress;
  } catch (error) {
    console.error("Failed to upsert shipping address", error);
    throw new Error("Failed to upsert shipping address");
  }
};
