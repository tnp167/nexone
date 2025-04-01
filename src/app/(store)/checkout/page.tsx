import CheckoutContainer from "@/components/store/checkout-page/Container";
import Header from "@/components/store/layout/header/Header";
import { db } from "@/lib/db";
import { Country } from "@/lib/types";
import { getUserShippingAddresses } from "@/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CheckoutPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/cart");

  const cart = await db.cart.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: true,
      coupon: {
        include: {
          store: true,
        },
      },
    },
  });

  if (!cart) redirect("/cart");

  //Get user shipping addresses
  const addresses = await getUserShippingAddresses();

  //Get list of countries
  const countries = await db.country.findMany({
    orderBy: { name: "desc" },
  });

  const cookiesStore = await cookies();
  const userCountryCookie = cookiesStore.get("userCountry");

  let userCountry: Country | null = {
    name: "United Kingdom",
    city: "",
    code: "GB",
    region: "",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }
  return (
    <>
      <Header />
      <div className="bg-[#F4F4F4] min-h-[calc(100vh-65px)]">
        <div className="max-w-container mx-auto py-4 px-2">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
            userCountry={userCountry}
          />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
