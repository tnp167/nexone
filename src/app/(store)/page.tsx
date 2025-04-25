import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import Header from "@/components/store/layout/header/Header";
import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import { getHomeDataDynamic, getHomeFeatureCategories } from "@/queries/home";
import Footer from "@/components/store/layout/footer/Footer";
import Sideline from "@/components/store/home/sideline/Sideline";
export default async function Home() {
  const { products } = await getProducts();
  const data = await getHomeDataDynamic([
    { property: "offer", value: "today-deals", type: "full" },
  ]);
  const categories = await getHomeFeatureCategories();
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="min-h-screen relative w-full">
        <Sideline />
      </div>
      <Footer />
    </div>
  );
}
