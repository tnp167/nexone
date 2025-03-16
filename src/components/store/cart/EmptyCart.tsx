import { Button } from "../ui/button";
import CartImage from "@/public/assets/images/cart.avif";
import Image from "next/image";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="bg-[#F5F5F5] w-full mx-auto px-4 text-center">
      <div className="h-full flex flex-col justify-center items-center min-h-[calc(100vh-65px)]">
        <Image
          src={CartImage}
          alt="cart"
          width={100}
          height={100}
          className="size-64 font-bold my-3"
        />
        <span className="py-4 font-bold my-3">Your cart is empty</span>
        <Link href="/browse">
          <Button variant="pink" className="w-56">
            Explore items
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
