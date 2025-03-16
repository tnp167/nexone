import CheckoutContainer from "@/components/store/checkout-page/Container";
import Header from "@/components/store/layout/header/Header";
import { db } from "@/lib/db";
import { getUserShippingAddresses } from "@/queries/user";
import { currentUser } from "@clerk/nextjs/server";
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
    },
  });

  if (!cart) redirect("/cart");

  //Get user shipping addresses
  const addresses = await getUserShippingAddresses();

  //Get list of countries
  const countries = await db.country.findMany({
    orderBy: { name: "desc" },
  });
  return (
    <>
      <Header />
      <div className="bg-[#F4F4F4] min-h-[calc(100vh-65px)]">
        <div className="max-w-container mx-auto py-4 px-2">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
          />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
