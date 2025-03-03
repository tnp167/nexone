import ProductPageContainer from "@/components/store/product-page/Container";
import ProductDescription from "@/components/store/product-page/ProductDescription";
import ProductSpecs from "@/components/store/product-page/ProductSpecs";
import RelatedProducts from "@/components/store/product-page/RelatedProduct";
import { getProductPageData, getProducts } from "@/queries/product";
import { Separator } from "@/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import ProductQuestions from "@/components/store/product-page/ProductQuestions";
import StoreCard from "@/components/store/cards/StoreCard";

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

  const { specs, questions, shippingDetails, category } = productData;

  const relatedProducts = await getProducts(
    { categories: category!.url },
    "",
    1,
    12
  );
  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflwo overflwo-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator className="mb-6" />
              {/* Related products */}
              <RelatedProducts products={relatedProducts.products} />
            </>
          )}
          <>
            <Separator className="mt-6" />
            {/* Product description */}
            <ProductDescription
              text={[productData?.description, productData?.variantDescription]}
            />
          </>
          {(specs?.product.length > 0 || specs?.variant.length > 0) && (
            <>
              <Separator className="my-6" />
              {/* Specs table */}
              <ProductSpecs specs={specs} />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="my-6" />
              {/* Product Questions */}
              <ProductQuestions questions={productData.questions} />
            </>
          )}
          <Separator className="my-6" />
          {/* Store Card */}
          <StoreCard store={productData.store} />
          {/* Store products */}
        </ProductPageContainer>
      </div>
    </div>
  );
};

export default ProductVariantPage;
