"use server";

import { db } from "@/lib/db";
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
