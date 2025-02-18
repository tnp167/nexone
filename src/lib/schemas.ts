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

export const StoreFormSchema = z.object({
  name: z
    .string({
      required_error: "Store name is required",
      invalid_type_error: "Store name must be a string",
    })
    .min(2, { message: "Store name must be at least 2 characters" })
    .max(50, { message: "Store name must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Category name must contain only letters, numbers and spaces",
    }),
  description: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be a string",
    })
    .min(10, { message: "Store description must be at least 10 characters" })
    .max(500, {
      message: "Store description must be less than 200 characters",
    }),
  email: z
    .string({
      required_error: "Store email is required",
      invalid_type_error: "Store email must be a string",
    })
    .email({ message: "Store email must be a valid email address" }),
  phone: z
    .string({
      required_error: "Store phone is required",
      invalid_type_error: "Store phone must be a string",
    })
    .min(10, { message: "Store phone must be at least 10 characters" }),
  logo: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose only one logo image"),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose only one cover image"),
  url: z
    .string({
      required_error: "Store url is required",
      invalid_type_error: "Store url must be a string",
    })
    .min(2, { message: "Store url must be at least 2 characters" })
    .max(50, { message: "Store url must be less than 50 characters" })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});
