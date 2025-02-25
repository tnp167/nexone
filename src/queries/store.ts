"use server";

import { db } from "@/lib/db";
import { StoreDefaultShippingDetailsType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";

//Upsert store details for seller
//Parameter: Partial type for store
//Return: Updated or newly created store
export const upsertStore = async (store: Partital<Store>) => {
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
