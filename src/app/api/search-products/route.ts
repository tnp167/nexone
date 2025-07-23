import client from "@/lib/elastic-search";
import { NextResponse } from "next/server";

//Define product type
interface Product {
  name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search");

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      {
        error: "Invalid search query",
      },
      {
        status: 400,
      }
    );
  }

  try {
    // const response = await client.search<{ _source: Product }>({
    //   index: "products",
    //   body: {
    //     query: {
    //       match_phrase_prefix: {
    //         name: query,
    //       },
    //     },
    //   },
    // });
    // const results = response.hits.hits.map((hit: any) => hit._source);
    // return NextResponse.json(results);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
