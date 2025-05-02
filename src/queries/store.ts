"use server";

import { db } from "@/lib/db";
import {
  CountryWithShippingRatesType,
  StoreDefaultShippingDetailsType,
  StoreType,
} from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { ShippingRate, StoreStatus } from "@prisma/client";
import { Store } from "@prisma/client";

//Upsert store details for seller
//Parameter: Partial type for store
//Return: Updated or newly created store
export const upsertStore = async (store: Partial<Store>) => {
  try {
    if (!store) throw new Error("Store details are required");

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized. Seller only can create store");

    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                name: store.name,
              },
              {
                url: store.url,
              },
              {
                phone: store.phone,
              },
              {
                email: store.email,
              },
            ],
          },
          {
            NOT: {
              id: store.id,
            },
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    const storeDetails = await db.store.upsert({
      where: {
        id: store.id,
      },
      update: store,
      create: {
        ...store,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upsert store");
  }
};

// Function: getStoreDefaultShippingDetails
// Description: Fetches the default shipping details for a store based on the store URL.
// Parameters:
//   - storeUrl: The URL of the store to fetch default shipping details for.
// Returns: An object containing default shipping details, including shipping service, fees, delivery times, and return policy.
export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
      select: {
        defaultShippingService: true,
        defaultShippingFeesPerItem: true,
        defaultShippingFeesForAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultShippingFeeFixed: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        returnPolicy: true,
      },
    });

    if (!store) throw new Error("Store not found");

    return store;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch store default shipping details");
  }
};

// Function: updateStoreDefaultShippingDetails
// Description: Updates the default shipping details for a store based on the store URL.
// Parameters:
//   - storeUrl: The URL of the store to update.
//   - details: An object containing the new shipping details (shipping service, fees, delivery times, and return policy).
// Returns: The updated store object with the new default shipping details.
export const updateStoreDefaultShippingDetails = async (
  storeUrl: string,
  details: StoreDefaultShippingDetailsType
) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized. Seller only can update store details");

    if (!storeUrl) throw new Error("Store URL is required");

    if (!details) throw new Error("No shipping details provided");

    //Make sure the user is the owner of the store
    const checkOwnership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!checkOwnership)
      throw new Error("Unauthorized. Permission or ownership denied");

    //Find and update the store based on storeUrl
    const updatedStore = await db.store.update({
      where: {
        url: storeUrl,
        userId: user.id,
      },
      data: details,
    });

    return updatedStore;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update store default shipping details");
  }
};

//Function: getStoreShippingRates
// Description: Retrieves all countries and their shipping rates for a specific store.
//              If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
// Permission Level: Public
//Returns: Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
export const getStoreShippingRates = async (storeUrl: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized. Seller only can update store details");

    if (!storeUrl) throw new Error("Store URL is required");

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!store) {
      throw new Error("Unauthorized. Permission or ownership denied");
    }

    //Retrieve all countries
    const countries = await db.country.findMany({
      orderBy: {
        name: "asc",
      },
    });

    //Retrieve all shipping rates for the store
    const shippingRates = await db.shippingRate.findMany({
      where: {
        storeId: store.id,
      },
    });

    //Create a map of shipping rates by country ID
    const rateMap = new Map();
    shippingRates.forEach((rate) => {
      rateMap.set(rate.countryId, rate);
    });

    //Map countries to their shipping rates
    const result = countries.map((country) => ({
      countryId: country.id,
      countryName: country.name,
      shippingRate: rateMap.get(country.id) || null,
    }));

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get store shipping rates");
  }
};

//Function: upsertStoreShippingRate
//Description: Upserts a shipping rate for a store
//Permission Level: Seller
//Parameters:
//  - storeUrl: The URL of the store to update
//  - shippingRate: The shipping rate to update
//Returns: The updated shipping rate
export const upsertStoreShippingRate = async (
  storeUrl: string,
  shippingRate: ShippingRate
) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized. Seller only can update store details");

    if (!shippingRate) throw new Error("No shipping rate provided");

    if (!shippingRate.countryId) throw new Error("Country ID is required");

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!store) {
      throw new Error("Unauthorized. Permission or ownership denied");
    }

    //Upsert shipping rate
    const shippingRateDetails = await db.shippingRate.upsert({
      where: {
        id: shippingRate.id,
      },
      update: { ...shippingRate, storeId: store.id },
      create: { ...shippingRate, storeId: store.id },
    });

    return shippingRateDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upsert store shipping rate");
  }
};

/**
 * @name getStoreOrders
 * @description - Retrieves all orders for a specific store.
 *              - Returns order that include items, order details.
 * @access User
 * @param storeUrl - The url of the store whose order groups are being retrieved.
 * @returns {Array} - Array of order groups, including items.
 */

export const getStoreOrders = async (storeUrl: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized. Seller only can view store orders");

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!store) throw new Error("Unauthorized. Permission or ownership denied");

    //Veriy ownership
    if (user.id !== store.userId) {
      throw new Error("Unauthorized. Permission or ownership denied");
    }

    //Retrieve orders
    const orders = await db.orderGroup.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        items: true,
        coupon: true,
        order: {
          select: {
            paymentStatus: true,
            shippingAddress: {
              include: {
                country: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            paymentDetails: true,
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get store orders");
  }
};

export const applySeller = async (store: StoreType) => {
  try {
    if (!store) throw new Error("Store details are required");

    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                name: store.name,
              },
              {
                url: store.url,
              },
              {
                phone: store.phone,
              },
              {
                email: store.email,
              },
            ],
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    const storeDetails = await db.store.create({
      data: {
        ...store,
        defaultShippingService:
          store.defaultShippingService || "International Delivery",
        returnPolicy:
          store.returnPolicy || "Returns within 30 days of purchase.",
        status: StoreStatus.PENDING,
        averageRating: 0,
        featured: false,
        userId: user.id,
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create store");
  }
};

// Function: getAllStores
// Description: Retrieves all stores from the database.
// Permission Level: Admin only
// Parameters: None
// Returns: An array of store details.
export const getAllStores = async () => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized. Admin only can get all stores");

    const stores = await db.store.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return stores;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get all stores");
  }
};

export const updateStoreStatus = async (
  storeId: string,
  status: StoreStatus
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  //Verify seller permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Admin permission required");

  //Verify store ownership
  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
  });
  if (!store) throw new Error("Store not found");

  //Retrieve the order to be updated
  const updatedStore = await db.store.update({
    where: {
      id: storeId,
    },
    data: {
      status,
    },
  });

  //Update the user role
  if (store.status === "PENDING" && updatedStore.status === "ACTIVE") {
    await db.user.update({
      where: {
        id: updatedStore.userId,
      },
      data: {
        role: "SELLER",
      },
    });
  }

  return updatedStore.status;
};

// Function: deleteStore
// Description: Deletes a store from the database.
// Permission Level: Admin only
// Parameters:
//   - storeId: The ID of the store to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteStore = async (storeId: string) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Admin permission required");

    if (!storeId) throw new Error("Store ID is required");

    const response = await db.store.delete({
      where: {
        id: storeId,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete store");
  }
};
