import { getAllStoreProducts } from "@/queries/product";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import { getAllSubCategories } from "@/queries/subCategory";
import { Prisma, ShippingRate } from "@prisma/client";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//SubCategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];

//Product + Variant
export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  variantImage: string;
  images: { url: string }[];
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];
  keywords: string[];
  questions: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
};

//Store product
export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];

//Store Default Shipping Details
export type StoreDefaultShippingDetailsType = Prisma.PromiseReturnType<
  typeof getStoreDefaultShippingDetails
>[0];

export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};
