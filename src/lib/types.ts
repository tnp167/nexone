import {
  getAllStoreProducts,
  getProductPageData,
  getProducts,
  getShippingDetails,
  retrieveProductDetails,
  getRatingStatistics,
} from "@/queries/product";
import {
  getAllStores,
  getStoreDefaultShippingDetails,
  getStoreOrders,
} from "@/queries/store";
import { getAllSubCategories } from "@/queries/subCategory";
import {
  Cart,
  CartItem,
  Color,
  FreeShipping,
  FreeShippingCountry,
  Prisma,
  ProductVariantImage,
  Review,
  ReviewImage,
  ShippingAddress,
  ShippingFeeMethod,
  ShippingRate,
  Size,
  User,
  Country as CountryPrisma,
  Coupon,
  Store,
  OrderGroup,
  OrderItem,
  Category,
  SubCategory,
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
  images: { id?: string; url: string }[];
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight: number;
  colors: { id?: string; color: string }[];
  sizes: {
    id?: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: { id?: string; name: string; value: string }[];
  variant_specs: { id?: string; name: string; value: string }[];
  keywords: string[];
  questions: { id?: string; question: string; answer: string }[];
  freeShippingCountriesIds: { id?: string; label: string; value: string }[];
  shippingFeeMethod: ShippingFeeMethod;
  freeShippingForAllCountries: boolean;
  createdAt: Date;
  updatedAt: Date;
  offerTagId: string;
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
import { getOrder } from "@/queries/order";
import {
  getUserOrders,
  getUserPayments,
  getUserReviews,
  getUserWishlist,
} from "@/queries/profile";
import { getHomeFeatureCategories } from "@/queries/home";

export type SelectMenuOption = (typeof countries)[number];

export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export type ProductWishlistType = Prisma.PromiseReturnType<
  typeof getUserWishlist
>["wishlist"][0];

export type VariantSimplified = {
  variantId: string;
  variantName: string;
  variantSlug: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
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

export type OrderFullType = Prisma.PromiseReturnType<typeof getOrder>;
export type StoreOrderType = Prisma.PromiseReturnType<typeof getStoreOrders>[0];

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
export type ReviewDetailsType = {
  id: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  quantity: string;
  variant: string;
  color: string;
};

export type VariantInfoType = {
  variantName: string;
  variantUrl: string;
  variantSlug: string;
  variantImage: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Partial<Color>[];
};

export type CartWithCartItemsType = Cart & {
  cartItems: CartItem[];
  coupon: (Coupon & { store: Store }) | null;
};

export type UserShippingAddressType = ShippingAddress & {
  country: CountryPrisma;
};

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  OutforDelivery = "OutforDelivery",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Failed = "Failed",
  Refunded = "Refunded",
  Returned = "Returned",
  PartiallyShipped = "PartiallyShipped",
  OnHold = "OnHold",
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Declined = "Declined",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Chargeback = "Chargeback",
}

export type OrderGroupWithItemsType = OrderGroup & {
  items: OrderItem[];
  store: Store;
  _count: {
    items: number;
  };
  coupon: Coupon | null;
};

export enum ProductStatus {
  Pending = "Pending",
  Processing = "Processing",
  ReadyForShipment = "ReadyForShipment",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Returned = "Returned",
  Refunded = "Refunded",
  FailedDelivery = "FailedDelivery",
  OnHold = "OnHold",
  Backordered = "Backordered",
  PartiallyShipped = "PartiallyShipped",
  ExchangeRequested = "ExchangeRequested",
  AwaitingPickup = "AwaitingPickup",
}

export interface SearchResult {
  name: string;
  link: string;
  image: string;
}

export type OrderTableFilter =
  | ""
  | "unpaid"
  | "toShip"
  | "shipped"
  | "delivered";

export type OrderTableDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type UserOrderType = Prisma.PromiseReturnType<
  typeof getUserOrders
>["orders"][0];

export type UserPaymentType = Prisma.PromiseReturnType<
  typeof getUserPayments
>["payments"][0];

export type UserReviewType = Prisma.PromiseReturnType<
  typeof getUserReviews
>["reviews"][0];

export type PaymentTableFilter = "" | "paypal" | "credit-card";

export type PaymentTableDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type ReviewFilter = "5" | "4" | "3" | "2" | "1" | "";

export type ReviewDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type FiltersQueryType = {
  search: string;
  category: string;
  subCategory: string;
  offer: string;
  size: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
  color: string;
};

export type CategoryWithSubsType = Category & {
  subCategories: SubCategory[];
};

export type ProductSize = {
  size: string;
  price: number;
  discount: number;
  quantity: number;
};

export type ProductWithVariants = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  numReviews: number;
  variants: {
    id: string;
    variantName: string;
    variantImage: string;
    slug: string;
    sizes: Size[];
    images: ProductVariantImage[];
  }[];
};

export type SimpleProduct = {
  name: string;
  slug: string;
  variantName: string;
  variantSlug: string;
  price: number;
  image: string;
};

export type ProductSimpleVariantType = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  variantImage: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type FeaturedCategoryType = Prisma.PromiseReturnType<
  typeof getHomeFeatureCategories
>[0];

export type StoreType = {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  defaultShippingService: string;
  defaultDeliveryTimeMax?: number;
  defaultDeliveryTimeMin?: number;
  defaultShippingFeesPerItem?: number;
  defaultShippingFeesForAdditionalItem?: number;
  defaultShippingFeePerKg?: number;
  defaultShippingFeeFixed?: number;
  returnPolicy?: string;
};

export type AdminStoreType = Prisma.PromiseReturnType<typeof getAllStores>[0];

export enum StoreStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DISABLED = "DISABLED",
}
