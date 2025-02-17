"use server";

import { SubCategory } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

//Upsert Sub Category for Admin
export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error("Unauthorized: Admin role required");

    if (!subCategory) throw new Error("Please provide sub category data.");
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "Sub Category name already exists";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "Sub Category URL already exists";
      }
      throw new Error(errorMessage);
    }

    //Upsert Sub Category
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Retrieve all sub categories
export const getAllSubCategories = async () => {
  const subCategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Retrieves a specific category from database
export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Sub Category ID is required");

  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Delete Sub Category for Admin
export const deleteSubCategory = async (subCategoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unauthorized: Admin role required");

  if (!subCategoryId) throw new Error("Sub Category ID is required");

  const result = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });

  return result;
};
