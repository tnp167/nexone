import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import Header from "@/components/store/layout/Header/Header";
import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import { getHomeDataDynamic, getHomeFeatureCategories } from "@/queries/home";
import Footer from "@/components/store/layout/Footer/Footer";
import Sideline from "@/components/store/home/sideline/Sideline";
import HomeMainSwiper from "@/components/store/home/main/HomeSwiper";
import HomeUserCard from "@/components/store/home/main/user/User";
import MainSwiper from "@/components/store/shared/Swiper";
import ProductSimpleCard from "@/components/store/cards/product/SimpleCard";
import { SimpleProduct } from "@/lib/types";
import Featured from "@/components/store/home/main/Featured";
import AnimatedDeals from "@/components/store/home/AnimatedDeals";
import Image from "next/image";
import SuperDealsImg from "@/public/assets/images/ads/super-deals.avif";
import FeaturedCategories from "@/components/store/home/FeaturedCategories";
import ProductCard from "@/components/store/cards/product/ProductCard";
export default async function Home() {
  const { products } = await getProducts({}, "", 1, 100);
  const {
    product_best_deals,
    product_super_deals,
    product_user_card,
    product_featured,
  } = await getHomeDataDynamic([
    { property: "offer", value: "best-deals", type: "simple" },
    { property: "offer", value: "super-deals", type: "full" },
    { property: "offer", value: "user-card", type: "simple" },
    { property: "offer", value: "featured", type: "simple" },
  ]);
  const featuredCategories = await getHomeFeatureCategories();
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
                <Featured
                  products={product_featured.filter(
                    (product): product is SimpleProduct =>
                      "variantSlug" in product
                  )}
                />
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
            {/* Animated Deals */}
            <div className="mt-2 lg:block hidden">
              <AnimatedDeals
                products={product_best_deals.filter(
                  (product): product is SimpleProduct =>
                    "variantSlug" in product
                )}
              />
            </div>
            <div className="mt-10 space-y-10">
              <div className="bg-white rounded-md">
                <MainSwiper products={product_super_deals} type="curved">
                  <div className="mb-4 pl-4 flex items-center justify-between">
                    <Image
                      src={SuperDealsImg}
                      alt="Super Deals"
                      width={200}
                      height={50}
                    />
                  </div>
                </MainSwiper>
              </div>
              <FeaturedCategories categories={featuredCategories} />
              <div>
                {/* Header */}
                <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                  <span>More products</span>
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                </div>
                <div className="mt-7 bg-white justify-center flex flex-wrap min-[1530px]:grid min-[1530px]:grid-cols-7 p-4 pb-16 rounded-md">
                  {products.map((product, idx) => (
                    <ProductCard key={idx} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
