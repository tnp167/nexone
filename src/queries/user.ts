"use server";

import { db } from "@/lib/db";
import { CartProductType, CartWithCartItemsType, Country } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import {
  getDeliveryDetailsForStoreByCountry,
  getProductShippingFee,
  getShippingDetails,
} from "./product";
import { CartItem, ShippingAddress } from "@prisma/client";
import { Country as CountryDB } from "@prisma/client";
import { applyCoupon } from "./coupon";

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

export const placeOrder = async (
  shippingAddress: ShippingAddress,
  cartId: string
): Promise<{ orderId: string }> => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const userId = user.id;

  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) throw new Error("Cart not found");

  const cartItems = cart.cartItems;

  const validatedCartItems = await Promise.all(
    cartItems.map(async (cartItem) => {
      const { productId, variantId, sizeId, quantity } = cartItem;

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
      const countryId = shippingAddress.countryId;

      const tempCountry = await db.country.findUnique({
        where: {
          id: countryId,
        },
      });

      if (!tempCountry) throw new Error("Country not found");

      const country = {
        name: tempCountry.name,
        code: tempCountry.code,
        city: "",
        region: "",
      };

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (country) {
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

  //Define the type of grouped items by store
  type GroupedItems = {
    [storeId: string]: typeof validatedCartItems;
  };

  //Group validated items by store
  const groupedItems = validatedCartItems.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.storeId]) acc[item.storeId] = [];
    acc[item.storeId].push(item);
    return acc;
  }, {} as GroupedItems);

  const order = await db.order.create({
    data: {
      userId: userId,
      shippingAddressId: shippingAddress.id,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      subTotal: 0,
      shippingFees: 0,
      total: 0,
    },
  });

  let orderTotalPrice = 0;
  let orderShippingFee = 0;

  for (const [storeId, items] of Object.entries(groupedItems)) {
    const groupedTotalPrice = items.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    const groupShippingFee = items.reduce(
      (acc, item) => acc + item.shippingFee,
      0
    );

    const { shippingService, deliveryTimeMin, deliveryTimeMax } =
      await getDeliveryDetailsForStoreByCountry(
        storeId,
        shippingAddress.countryId
      );

    const orderGroup = await db.orderGroup.create({
      data: {
        orderId: order.id,
        storeId: storeId,
        status: "Pending",
        subTotal: groupedTotalPrice - groupShippingFee,
        shippingFees: groupShippingFee,
        total: groupedTotalPrice,
        shippingService: shippingService || "International Delivery",
        shippingDeliveryMin: deliveryTimeMin || 7,
        shippingDeliveryMax: deliveryTimeMax || 30,
      },
    });

    //Create order items
    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderGroupId: orderGroup.id,
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          sku: item.sku,
          name: item.name,
          image: item.image,
          size: item.size,
          price: item.price,
          totalPrice: item.totalPrice,
          quantity: item.quantity,
          shippingFee: item.shippingFee,
        },
      });
    }

    //Update order totals
    orderTotalPrice += groupedTotalPrice;
    orderShippingFee += groupShippingFee;
  }

  //Update the main order with totals
  await db.order.update({
    where: { id: order.id },
    data: {
      subTotal: orderTotalPrice - orderShippingFee,
      shippingFees: orderShippingFee,
      total: orderTotalPrice,
    },
  });

  return { orderId: order.id };
};

export const emptyUserCart = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");

    const userId = user.id;

    const response = await db.cart.delete({
      where: { userId },
    });

    if (response) return true;
  } catch (error) {
    console.error("Failed to empty user cart", error);
    throw new Error("Failed to empty user cart");
  }
};

/*
 * Function: updateCartWithLatest
 * Description: Keeps the cart updated with latest info (price,qty,shipping fee...).
 * Permission Level: Public
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */
export const updateCartWithLatest = async (
  cartProducts: CartProductType[]
): Promise<CartProductType[]> => {
  //Fetch product, variant, and size data from the database
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      //Fetch product, variant, and size data from the database
      const product = await db.product.findUnique({
        where: { id: productId },
        include: {
          store: true,
          freeShipping: {
            include: {
              eligibleCountries: true,
            },
          },
          variants: {
            where: { id: variantId },
            include: {
              sizes: {
                where: { id: sizeId },
              },
              images: true,
            },
          },
        },
      });

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      )
        throw new Error("Invalid product or variant/size");

      const variant = product.variants[0];
      const size = variant.sizes[0];

      //Calculate shipping details
      const countryCookie = await getCookie("userCountry", { cookies });

      let details = {
        shippingService: product.store.defaultShippingService,
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
        deliveryTimeMin: 0,
        deliveryTimeMax: 0,
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

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      const validatedQuantity = Math.min(quantity, size.quantity);

      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        name: product.name,
        sku: variant.sku,
        image: variant.images[0].url,
        variantName: variant.variantName,
        variantImage: variant.images[0].url,
        stock: size.quantity,
        weight: variant?.weight || 0,
        shippingMethod: product.shippingFeeMethod,
        size: size.size,
        quantity: validatedQuantity,
        price,
        shippingFee: details.shippingFee,
        extraShippingFee: details.extraShippingFee,
        shippingService: details.shippingService,
        deliveryTimeMin: details.deliveryTimeMin,
        deliveryTimeMax: details.deliveryTimeMax,
        isFreeShipping: details.isFreeShipping,
      };
    })
  );

  return validatedCartItems;
};

export const addToWishlist = async (
  productId: string,
  variantId: string,
  sizeId?: string
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const userId = user.id;

  try {
    const existingWishlistItems = await db.wishlist.findFirst({
      where: {
        userId,
        productId,
        variantId,
      },
    });

    if (existingWishlistItems) throw new Error("Product already in wishlist");

    return await db.wishlist.create({
      data: {
        userId,
        productId,
        variantId,
        sizeId,
      },
    });
  } catch (error) {
    console.error("Failed to add to wishlist", error);
    throw new Error("Failed to add to wishlist");
  }
};

/*
 * Function: updateCheckoutProductstWithLatest
 * Description: Keeps the cart updated with latest info (price,qty,shipping fee...).
 * Permission Level: Public
 * Parameters:
 *   - cartProducts: An array of product objects from the frontend cart.
 *   - address: Country.
 * Returns:
 *   - An object containing the updated cart with recalculated total price and validated product data.
 */
export const updateCheckoutProductsWithLatest = async (
  cartProducts: CartItem[],
  address: CountryDB | undefined
): Promise<CartWithCartItemsType> => {
  //Fetch product, variant, and size data from the database
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      //Fetch product, variant, and size data from the database
      const product = await db.product.findUnique({
        where: { id: productId },
        include: {
          store: true,
          freeShipping: {
            include: {
              eligibleCountries: true,
            },
          },
          variants: {
            where: { id: variantId },
            include: {
              sizes: {
                where: { id: sizeId },
              },
              images: true,
            },
          },
        },
      });

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      )
        throw new Error("Invalid product or variant/size");

      const variant = product.variants[0];
      const size = variant.sizes[0];

      //Calculate shipping details
      const countryCookie = await getCookie("userCountry", { cookies });

      const country = address
        ? address
        : countryCookie
        ? JSON.parse(countryCookie)
        : null;

      if (!country) throw new Error("Country not found");

      let shippingFee = 0;

      const { shippingFeeMethod, freeShipping, store } = product;

      const fee = await getProductShippingFee(
        shippingFeeMethod,
        country,
        store,
        freeShipping,
        variant.weight || 0,
        quantity
      );
      if (fee) {
        shippingFee = fee;
      }

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      const validatedQuantity = Math.min(quantity, size.quantity);

      const totalPrice = price * validatedQuantity + shippingFee;

      try {
        const newCartItem = await db.cartItem.update({
          where: {
            id: cartProduct.id,
          },
          data: {
            name: `${product.name} · ${variant.variantName}`,
            image: variant.images[0].url,
            price,
            quantity: validatedQuantity,
            shippingFee,
            totalPrice,
          },
        });
        return newCartItem;
      } catch (error) {
        console.error("Failed to update cart item", error);
        return cartProduct;
      }
    })
  );

  //Apply coupon if any
  const cartCoupon = await db.cart.findUnique({
    where: {
      id: cartProducts[0].cartId,
    },
    select: {
      coupon: {
        include: {
          store: true,
        },
      },
    },
  });

  //Revalidate the cart's total price and shipping fee
  const subTotal = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFees = validatedCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0
  );
  let total = subTotal + shippingFees;

  if (cartCoupon?.coupon) {
    const { coupon } = cartCoupon;

    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (currentDate > startDate && currentDate < endDate) {
      //Check if the coupon applies to any store in the cart
      const applicableStoreItems = validatedCartItems.filter(
        (item) => item.storeId === coupon.storeId
      );

      if (applicableStoreItems.length > 0) {
        //Calculate the subtotal for  the coupon's store (including shipping fees)
        const storeSubTotal = applicableStoreItems.reduce(
          (acc, item) => acc + item.price * item.quantity + item.shippingFee,
          0
        );

        //Apply the coupon to the store's items
        const discountAmount = (storeSubTotal * coupon.discount) / 100;
        total -= discountAmount;
      }
    }
  }
  const cart = await db.cart.update({
    where: {
      id: cartProducts[0].cartId,
    },
    data: {
      subTotal,
      shippingFees,
      total,
    },
    include: {
      cartItems: true,
      coupon: true,
    },
  });

  if (!cart) throw new Error("Something went wrong");

  return cart;
};
