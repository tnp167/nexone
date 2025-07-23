import Header from "@/components/store/layout/Header/Header";
import ProductFilters from "@/components/store/browse-page/Filters";
import ProductSort from "@/components/store/browse-page/Sort";
import ProductList from "@/components/store/shared/ProductList";
import { getProducts } from "@/queries/product";
import { FiltersQueryType } from "@/lib/types";
import { parseFiltersFromSearchParams } from "@/lib/utils";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters: FiltersQueryType = parseFiltersFromSearchParams(
    await searchParams
  );

  const productsData = await getProducts(
    {
      search: filters.search,
      category: filters.category,
      subCategory: filters.subCategory,
      offer: filters.offer,
      size: filters.size ? [filters.size] : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      color: filters.color ? [encodeURIComponent(filters.color)] : undefined,
    },
    filters.sort
  );

  const { products } = productsData;

  return (
    <>
      <Header />
      <div className="max-w-[95%] mx-auto">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={filters} />
          <div className="p-4 space-y-5">
            <ProductSort />
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </>
  );
}
