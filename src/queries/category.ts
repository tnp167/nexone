"use server";

import { Category } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

//Upsert Category for Admin
export const upsertCategory = async (category: Category) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized: Admin role required");

    if (!category) throw new Error("Please provide category data.");

    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "Category name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "Category URL already exists";
      }
      throw new Error(errorMessage);
    }

    //Upsert Category
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });
    return categoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Retrieve all categories
export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

// Retrieves a specific category from database
export const getCategory = async (categoryId: string) => {
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// Delete Category for Admin
export const deleteCategory = async (categoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unauthorized: Admin role required");

  if (!categoryId) throw new Error("Category ID is required");

  const result = await db.category.delete({
    where: {
      id: categoryId,
    },
  });

  return result;
};
