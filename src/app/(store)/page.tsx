import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
export default async function Home() {
  const { products } = await getProducts();
  return (
    <>
      <div className="p-6">
        {/* <div className="w-100 flex gap-x-4 justify-end">
          <UserButton />
          <ThemeToggle />
        </div>
        <h1>Hello World</h1> */}
        <ProductList products={products} title="Products" arrow="" />
      </div>
    </>
  );
}
