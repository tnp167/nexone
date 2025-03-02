import ProductPageContainer from "@/components/store/product-page/Container";
import { getProductPageData } from "@/queries/product";
import { Separator } from "@radix-ui/react-separator";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
  searchParams: Promise<{ size?: string }>;
}

const ProductVariantPage = async ({ params, searchParams }: PageProps) => {
  const { productSlug, variantSlug } = await params;
  const { size: sizeId } = await searchParams;

  const productData = await getProductPageData(productSlug, variantSlug);
  if (!productData) return notFound();

  const { sizes } = productData;

  //If the size is provided, check if it is valid
  if (sizeId) {
    const isValidSize = sizes.some((s) => s.id === sizeId);
    if (!isValidSize) return redirect(`/product/${productSlug}/${variantSlug}`);
  }
  //If no sizeId is provided and theere's only one size, automatically redirect to the product variant page
  else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}/?size=${sizes[0].id}`
    );
  }

  const relatedProducts = { products: [] };
  const { specs, questions, shippingDetails } = productData;
  console.log(shippingDetails);
  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflwo overflwo-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related products */}
            </>
          )}
          <Separator className="mt-6" />
          <>
            <Separator className="mt-6" />
            {/* Product description */}
          </>
          {specs.product.length > 0 ||
            (specs.variant.length > 0 && (
              <>
                <Separator className="mt-6" />
                {/* Product Questions */}
              </>
            ))}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
            </>
          )}
          <Separator className="my-6" />
          {/* Store Card */}
          {/* Store products */}
        </ProductPageContainer>
      </div>
    </div>
  );
};

export default ProductVariantPage;
