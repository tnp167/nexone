import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import Header from "@/components/store/layout/header/Header";
import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import { getHomeDataDynamic, getHomeFeatureCategories } from "@/queries/home";
import Footer from "@/components/store/layout/footer/Footer";
import Sideline from "@/components/store/home/sideline/Sideline";
import HomeMainSwiper from "@/components/store/home/main/HomeSwiper";
import HomeUserCard from "@/components/store/home/main/user/User";
import MainSwiper from "@/components/store/shared/Swiper";
import ProductSimpleCard from "@/components/store/cards/product/SimpleCard";
import { SimpleProduct } from "@/lib/types";

export default async function Home() {
  const { products } = await getProducts();
  const { product_today_deals, product_user_card } = await getHomeDataDynamic([
    { property: "offer", value: "today-deals", type: "simple" },
    { property: "offer", value: "user-card", type: "simple" },
  ]);
  const categories = await getHomeFeatureCategories();
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="min-h-screen relative w-full">
        <Sideline />
        <div className="relative w-[calc(100%-40px)] h-full bg-[#E3E3E3]">
          <div className="max-w-[1600px] mx-auto min-h-screen p-4">
            {/* Main Content */}
            <div className="w-full grid gap-2 min-[1170px]:grid-cols-[1fr_350px] min-[1465px]:grid-cols-[200px_1fr_350px]">
              {/* Left */}
              <div
                className="h-[600px] cursor-pointer hidden min-[1465px]:block bg-cover bg-no-repeat rounded-md"
                style={{
                  backgroundImage:
                    "url(/assets/images/ads/winter-sports-clothing.jpg)",
                }}
              />
              {/* Middle */}
              <div className="space-y-2 h-fit">
                {/* Main Swiper */}
                <HomeMainSwiper />
                {/* Featured card */}
                <div className="h-[200px]"></div>
              </div>
              {/* Right */}
              <div className="h-full">
                <HomeUserCard
                  products={product_user_card.filter(
                    (product): product is SimpleProduct =>
                      "variantSlug" in product
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
