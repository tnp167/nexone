"use server";

import { db } from "@/lib/db";
import {
  ProductSize,
  ProductType,
  ProductWithVariants,
  SimpleProduct,
  ProductSimpleVariantType,
  VariantImageType,
} from "@/lib/types";

type FormatType = "simple" | "full";

type Param = {
  property: "category" | "subCategory" | "offer";
  value: string;
  type: FormatType;
};

type PropertyMapping = {
  [key: string]: string;
};

export const getHomeDataDynamic = async (
  params: Param[]
): Promise<Record<string, SimpleProduct[] | ProductType[]>> => {
  if (!Array.isArray(params) || params.length === 0) {
    throw new Error("Invalid input");
  }

  const propertyMapping: PropertyMapping = {
    category: "category.url",
    subCategory: "subCategory.url",
    offer: "offerTag.url",
  };

  const mapProperty = (property: string): string => {
    if (!propertyMapping[property]) {
      throw new Error(`Invalid property: ${property}`);
    }
    return propertyMapping[property];
  };

  const getCheapestSize = (
    sizes: ProductSize[]
  ): { discountedPrice: number } => {
    const sizesWithDiscount = sizes.map((size) => ({
      ...size,
      discountedPrice: size.price * (1 - size.discount / 100),
    }));

    const sortedByDiscountedPrice = sizesWithDiscount.sort(
      (a, b) => a.discountedPrice - b.discountedPrice
    );

    return sortedByDiscountedPrice[0];
  };

  const formatProductData = (
    products: ProductWithVariants[],
    type: FormatType
  ): SimpleProduct[] | ProductType[] => {
    if (type === "simple") {
      return products.map((product) => {
        const variant = product.variants[0];
        const cheapestSize = getCheapestSize(variant.sizes);
        const image = variant.images[0];

        return {
          name: product.name,
          slug: product.slug,
          variantName: variant.variantName,
          variantSlug: variant.slug,
          price: cheapestSize.discountedPrice,
          image: image.url,
        } as SimpleProduct;
      });
    } else if (type === "full") {
      return products.map((product) => {
        //Transform the variants into the VariantSimplified structure
        const variants: ProductSimpleVariantType[] = product.variants.map(
          (variant) => ({
            variantId: variant.id,
            variantSlug: variant.slug,
            variantName: variant.variantName,
            variantImage: variant.variantImage,
            images: variant.images,
            sizes: variant.sizes,
          })
        );

        //Extract variant images for the product
        const variantImages: VariantImageType[] = variants.map((variant) => ({
          url: `/product/${product.slug}/${variant.variantSlug}`,
          image: variant.variantImage
            ? variant.variantImage
            : variant.images[0].url,
        }));

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          rating: product.sales,
          sales: product.sales,
          numReviews: product.numReviews,
          variants,
          variantImages,
        } as ProductType;
      });
    } else {
      throw new Error("Invalid type");
    }
  };

  const results = await Promise.all(
    params.map(async ({ property, value, type }) => {
      const dbField = mapProperty(property);

      //Construct the where clause based on dbField
      const whereClause =
        dbField === "offerTag.url"
          ? { offerTag: { url: value } }
          : dbField === "category.url"
          ? { category: { url: value } }
          : dbField === "subCategory.url"
          ? { subCategory: { url: value } }
          : {};
      const products = await db.product.findMany({
        where: whereClause,
        select: {
          id: true,
          slug: true,
          name: true,
          rating: true,
          sales: true,
          numReviews: true,
          variants: {
            select: {
              id: true,
              variantName: true,
              variantImage: true,
              slug: true,
              sizes: true,
              images: true,
            },
          },
        },
      });
      //Format the data based on the input
      const formattedData = formatProductData(products, type);

      //Determine the output key based on the property and value
      const outputKey = `product_${value.replace(/-/g, "_")}`;

      return { [outputKey]: formattedData };
    })
  );

  return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};
