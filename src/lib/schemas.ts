import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string({
      required_error: "Category name is required",
      invalid_type_error: "Category name must be a string",
    })
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50, { message: "Category name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Category name must contain only letters, numbers and spaces",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose only one category image"),
  url: z
    .string({
      required_error: "Category url is required",
      invalid_type_error: "Category url must be a string",
    })
    .min(2, { message: "Category url must be at least 2 characters" })
    .max(50, { message: "Category url must be less than 50 characters" })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false),
});

export const SubCategoryFormSchema = z.object({
  name: z
    .string({
      required_error: "SubCategory name is required",
      invalid_type_error: "SubCategory name must be a string",
    })
    .min(2, { message: "SubCategory name must be at least 2 characters" })
    .max(50, { message: "SubCategory name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "SubCategory name must contain only letters, numbers and spaces",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose only one category image"),
  url: z
    .string({
      required_error: "SubCategory url is required",
      invalid_type_error: "SubCategory url must be a string",
    })
    .min(2, { message: "SubCategory url must be at least 2 characters" })
    .max(50, { message: "SubCategory url must be less than 50 characters" })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the SubCategory url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false),
  categoryId: z.string().uuid(),
});
