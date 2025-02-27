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

// Function: getSubCategory
// Description: Retrieves a specific SubCategory from the database.
// Access Level: Public
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be retrieved.
// Returns: Details of the requested SubCategory.
export const getSubcategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }

  try {
    const queryOptions = {
      take: limit || undefined,
      orderBy: random
        ? {
            createdAt: SortOrder.desc,
          }
        : undefined,
    };

    //If random is true, return random sub categories
    if (random) {
      const subCategories = await db.$queryRaw<SubCategory[]>`
        SELECT * FROM SubCategory ORDER BY RAND() LIMIT ${limit || 10}
      `;
      return subCategories;
    }
    //If random is false, return sub categories in descending order of creation date
    else {
      const subCategories = await db.subCategory.findMany(queryOptions);
      return subCategories;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
