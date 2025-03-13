import { saveUserCart } from "@/queries/user";
import { Button } from "../ui/button";
import { CartProductType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import PulseLoader from "react-spinners/PulseLoader";

interface Props {
  cartItems: CartProductType[];
  shippingFees: number;
}

const CartSummary: FC<Props> = ({ cartItems, shippingFees }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const subTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const total = subTotal + shippingFees;

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const response = await saveUserCart(cartItems);
      if (response) router.push("/checkout");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div className="relative py-4 px-6 bg-white">
      <h1 className="text-gray-900 text-2xl font-bold mb-3">Summary</h1>
      <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Subtotal
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-xl inline-block break-all">
              £{subTotal.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Shipping Fees
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-xl inline-block break-all">
              +£{shippingFees.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-bold flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-xl inline-block break-all">
              £{total.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="my-3">
        <Button onClick={handleSaveCart}>
          {loading ? (
            <PulseLoader color="#fff" size={5} />
          ) : (
            <span>Checkout &nbsp;({cartItems.length})</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
