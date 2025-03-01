import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: { variants: true },
  });

  if (!product || product.variants.length === 0) {
    return redirect("/");
  }

  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
};

export default ProductPage;
