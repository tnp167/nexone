import { NextResponse } from "next/server";
import client from "@/lib/elastic-search";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Delete all indices
    await client.indices.delete({
      index: "_all",
    });

    // Create a new index
    const products = await db.product.findMany({
      include: {
        variants: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });

    //Prepare the body for bulk indexing in Elasticsearch
    const body = products.flatMap((product) =>
      product.variants.flatMap((variant) => [
        {
          index: {
            _index: "products",
            _id: variant.id,
          },
        },
        {
          name: `${product.name} · ${variant.variantName} `,
          link: `/product/${product.slug}/${variant.slug}`,
          image: variant.images[0].url,
        },
      ])
    );

    //Execute the bulk request to Elasticsearch
    const bulkResponse = await client.bulk({
      refresh: true,
      body,
    });

    //Check for any errors in the bulk respone
    if (bulkResponse.errors) {
      return NextResponse.json(
        {
          message: "Products indexed successfully",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Products indexed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
