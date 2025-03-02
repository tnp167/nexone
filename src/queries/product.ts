"use server";

import { db } from "@/lib/db";
import {
  ProductPageType,
  ProductShippingDetailsType,
  ProductWithVariantType,
  variantImageType,
  VariantSimplified,
} from "@/lib/types";
import { generateUniqueSlug } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import slugify from "slugify";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { ShippingFeeMethod, Store } from "@prisma/client";
// Function: upsertProduct
// Description: Upserts a product and its variant into the database, ensuring proper association with the store.
// Access Level: Seller Only
// Parameters:
//   - product: ProductWithVariant object containing details of the product and its variant.
//   - storeUrl: The URL of the store to which the product belongs.
// Returns: Newly created or updated product with variant details.
export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    if (user.privateMetadata.role !== "SELLER")
      throw new Error("Unauthorized access: Seller role required");

    if (!product) throw new Error("Please provide product data.");

    //Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: product.productId },
    });

    //Find store by url
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });

    if (!store) throw new Error("Store not found");

    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "product"
    );

    const variantSlug = await generateUniqueSlug(
      slugify(product.variantName, {
        replacement: "-",
        lower: true,
        trim: true,
      }),
      "product"
    );

    //Common product data
    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      questions: {
        create: product.questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
      specs: {
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    //Common variant data
    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: variantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      keywords: product.keywords.join(","),
      specs: {
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      images: {
        create: product.images.map((image) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
        })),
      },
      variantImage: product.variantImage,
      colors: {
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      sizes: {
        create: product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          discount: size.discount,
        })),
      },
    };

    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: { connect: { id: existingProduct.id } },
      };
      return await db.productVariant.create({ data: variantData });
    } else {
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };
      return await db.product.create({ data: productData });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upsert product");
  }
};

// Function: getProductMainInfo
// Description: Retrieves the main information of a specific product from the database.
// Access Level: Public
// Parameters:
//   - productId: The ID of the product to be retrieved.
// Returns: An object containing the main information of the product or null if the product is not found.

export const getProductMainInfo = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) return null;

  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    storeId: product.storeId,
  };
};

// Function: getAllStoreProducts
// Description: Retrieves all products from a specific store based on the store URL.
// Access Level: Public
// Parameters:
//   - storeUrl: The URL of the store whose products are to be retrieved.
// Returns: Array of products from the specified store, including category, subcategory, and variant details.
export const getAllStoreProducts = async (storeUrl: string) => {
  const store = await db.store.findUnique({ where: { url: storeUrl } });
  if (!store) return null;

  //Retrieve all products from the store
  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return products;
};

// Function: deleteProduct
// Description: Deletes a product from the database.
// Permission Level: Seller only
// Parameters:
//   - productId: The ID of the product to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteProduct = async (productId: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  if (user.privateMetadata.role !== "SELLER")
    throw new Error("Unauthorized access: Seller role required");

  if (!productId) throw new Error("Please provide product data.");

  const response = await db.product.delete({
    where: {
      id: productId,
    },
  });
  return response;
};

// Function: getProducts
// Description: Retrieves products based on various filters and returns only variants that match the filters. Supports pagination.
// Access Level: Public
// Parameters:
//   - filters: An object containing filter options (category, subCategory, offerTag, size, onSale, onDiscount, brand, color).
//   - sortBy: Sort the filtered results (Most popular, New Arivals, Top Rated...).
//   - page: The current page number for pagination (default = 1).
//   - pageSize: The number of products per page (default = 10).
// Returns: An object containing paginated products, filtered variants, and pagination metadata (totalPages, currentPage, pageSize, totalCount)
export const getProducts = async (
  filters: any = {},
  sortBy: string = "",
  page: number = 1,
  pageSize: number = 10
) => {
  //Default values
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  const whereClause = {
    AND: [],
  };

  //Get all filtered, sorted products
  const products = await db.product.findMany({
    where: whereClause,
    skip: skip,
    take: limit,
    include: {
      variants: {
        include: {
          sizes: true,
          images: true,
          colors: true,
        },
      },
    },
  });

  const productWithFilteredVariants = products.map((product) => {
    const filteredVariants = product.variants;

    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantName: variant.variantName,
      variantSlug: variant.slug,
      images: variant.images,
      sizes: variant.sizes,
    }));

    //Get variant images for the product
    const variantImages: variantImageType[] = filteredVariants.map(
      (variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage ? variant.variantImage : "",
      })
    );

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages,
    };
  });

  const totalCount = products.length;

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: productWithFilteredVariants,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

// Function: getShippingDetails
// Description: Retrieves and calculates shipping details based on user country and product.
// Access Level: Public
// Parameters:
//   - shippingFeeMethod: The shipping fee method of the product.
//   - userCountry: The parsed user country object from cookies.
//   - store :  store details.
// Returns: Calculated shipping details.
export const getShippingDetails = async (
  shippingFeeMethod: ShippingFeeMethod,
  userCountry: { name: string; code: string; city: string; region: string },
  store: Store
) => {
  const country = await db.country.findUnique({
    where: {
      name: userCountry.name,
      code: userCountry.code,
    },
  });

  if (country) {
    const shippingRate = await db.shippingRate.findFirst({
      where: {
        countryId: country.id,
        storeId: store.id,
      },
    });

    const returnPolicy = shippingRate?.returnPolicy || store.returnPolicy;
    const shippingService =
      shippingRate?.shippingService || store.defaultShippingService;
    const shippingFeePerItem =
      shippingRate?.shippingFeePerItem || store.defaultShippingFeesPerItem;
    const shippingFeeForAdditionalItem =
      shippingRate?.shippingFeeForAdditionalItem ||
      store.defaultShippingFeesForAdditionalItem;
    const shippingFeePerKg =
      shippingRate?.shippingFeePerKg || store.defaultShippingFeePerKg;
    const shippingFeeFixed =
      shippingRate?.shippingFeeFixed || store.defaultShippingFeeFixed;
    const deliveryTimeMin =
      shippingRate?.deliveryTimeMin || store.defaultDeliveryTimeMin;
    const deliveryTimeMax =
      shippingRate?.deliveryTimeMax || store.defaultDeliveryTimeMax;

    const shippingDetails = {
      shippingFeeMethod,
      shippingService: shippingService,
      shippingFee: 0,
      extraShippingFee: 0,
      deliveryTimeMin,
      deliveryTimeMax,
      returnPolicy,
      countryCode: country.code,
      countryName: country.name,
      city: userCountry.city,
      region: userCountry.region,
    };

    switch (shippingFeeMethod) {
      case "ITEM":
        shippingDetails.shippingFee = shippingFeePerItem;
        shippingDetails.extraShippingFee = shippingFeeForAdditionalItem;
        break;
      case "WEIGHT":
        shippingDetails.shippingFee = shippingFeePerKg;
        break;
      case "FIXED":
        shippingDetails.shippingFee = shippingFeeFixed;
        break;
      default:
        break;
    }
    return shippingDetails;
  }

  return false;
};

// Function: getProductPageData
// Description: Retrieves details of a specific product variant from the database.
// Access Level: Public
// Parameters:
//   - productId: The slug of the product to which the variant belongs.
//   - variantId: The slug of the variant to be retrieved.
// Returns: Details of the requested product variant.
export const getProductPageData = async (
  productSlug: string,
  variantSlug: string
) => {
  const product = await retrieveProductDetails(productSlug, variantSlug);
  if (!product || !product.store) return;

  // Retrieve user country
  const userCountry = await getUserCountry();

  //Calculate and retrieve the shipping details
  const productShippingDetails = await getShippingDetails(
    product.shippingFeeMethod || "ITEM",
    userCountry,
    product.store
  );

  return formatProductResponse(product, productShippingDetails);
};

export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string
) => {
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      store: true,
      specs: true,
      questions: true,
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  const variantImages = await db.productVariant.findMany({
    where: {
      productId: product?.id,
    },
    select: {
      variantImage: true,
      slug: true,
    },
  });
  return {
    ...product,
    variantImages: variantImages.map((variant) => ({
      url: `/product/${productSlug}/${variant.slug}`,
      image: variant.variantImage,
      slug: variant.slug,
    })),
  };
};

const getUserCountry = async () => {
  const userCountryCookie = await getCookie("userCountry", { cookies });
  const defaultCountry = { name: "United Kingdom", code: "GB" };

  if (!userCountryCookie) return defaultCountry;

  try {
    const parsedCountry = JSON.parse(userCountryCookie.toString());

    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      return parsedCountry;
    }
    return defaultCountry;
  } catch (error) {
    console.error("Failed to parse user country cookie", error);
  }
  return defaultCountry;
};

const formatProductResponse = (
  product: ProductPageType,
  shippingDetails: ProductShippingDetailsType
) => {
  if (!product) return;
  const variant = product?.variants[0];

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    variantImages: product.variantImages,
    images: variant.images,
    category: product.category,
    subCategory: product.subCategory,
    offerTag: {
      name: product.offerTag?.name,
    },
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    colors: variant.colors,
    sizes: variant.sizes,
    product_specs: product.specs,
    variant_specs: variant.specs,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    store: {
      id: product?.store?.id,
      url: product?.store?.url,
      name: product?.store?.name,
      logo: product?.store?.logo,
      followersCount: 10,
      isUserFollowing: true,
    },
    questions: product.questions,
    rating: product.rating,
    numReviews: 122,
    reviewStatistics: {
      ratingStatistics: [],
      reviewsWithImagesCount: 5,
    },
    shippingDetails,
    relatedProducts: [],
  };
};
