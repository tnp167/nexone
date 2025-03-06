import {
  getAllStoreProducts,
  getProductPageData,
  getProducts,
  getShippingDetails,
  retrieveProductDetails,
  getRatingStatistics,
} from "@/queries/product";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import { getAllSubCategories } from "@/queries/subCategory";
import {
  FreeShipping,
  FreeShippingCountry,
  Prisma,
  ProductVariantImage,
  Review,
  ReviewImage,
  ShippingRate,
  Size,
  User,
} from "@prisma/client";

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
  weight: number;
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

export interface Country {
  name: string;
  code: string;
  city: string;
  region: string;
}

import countries from "@/data/countries.json";

export type SelectMenuOption = (typeof countries)[number];

export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export type VariantSimplified = {
  variantId: string;
  variantName: string;
  variantSlug: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type variantImageType = {
  url: string;
  image: string;
};

export type ProductPageType = Prisma.PromiseReturnType<
  typeof retrieveProductDetails
>;

export type ProductPageDataType = Prisma.PromiseReturnType<
  typeof getProductPageData
>;

export type ProductShippingDetailsType = Prisma.PromiseReturnType<
  typeof getShippingDetails
>;

export type RatingStatisticsType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>;

export type StatisticsCardType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>["ratingStatistics"];

export type FreeShippingWithCountriesType = FreeShipping & {
  eligibleCountries: FreeShippingCountry[];
};

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: User;
};

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
};

export type SortOrder = "asc" | "desc";

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type SortType = "latest" | "oldest" | "highest";

export type ReviewsOrderType = {
  orderBy: SortType;
};
