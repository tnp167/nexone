import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import Header from "@/components/store/layout/header/Header";
import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import { getHomeDataDynamic, gerHomeFeatureCategories } from "@/queries/home";

export default async function Home() {
  const { products } = await getProducts();
  const data = await getHomeDataDynamic([
    { property: "offer", value: "today-deals", type: "full" },
  ]);
  const categories = await gerHomeFeatureCategories();
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="p-6">
        <ProductList products={products} title="Products" arrow />
      </div>
    </div>
  );
}
