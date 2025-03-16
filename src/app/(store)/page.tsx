import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import Header from "@/components/store/layout/header/Header";
import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";

export default async function Home() {
  const { products } = await getProducts();
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
