import CartContainer from "@/components/store/cart/Container";
import Header from "@/components/store/layout/Header/Header";
import { Country } from "@/lib/types";
import { cookies } from "next/headers";

const CartPage = async () => {
  //Get cookies from the store
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
      <CartContainer userCountry={userCountry} />
    </>
  );
};

export default CartPage;
