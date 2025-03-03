import { CartProductType } from "@/lib/types";
import { Size } from "@prisma/client";
import { Minus, Plus } from "lucide-react";
import { FC, useEffect } from "react";

interface QuantitySelectorProps {
  productId: string;
  variantId: string;
  sizeId: string | null;
  sizes: Size[];
  quantity: number;
  stock: number;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  productId,
  variantId,
  sizeId,
  sizes,
  quantity,
  stock,
  handleChange,
}) => {
  //If no sizeId, return null
  if (!sizeId) return null;

  useEffect(() => {
    handleChange("quantity", 1);
  }, [sizeId]);

  const handleIncrease = () => {
    if (quantity < stock) {
      handleChange("quantity", quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  };

  return (
    <div className="w-full py-2 px-3 bg-white-border border-gray-200 rounded-lg">
      <div className="w-full flex justify-between items-center gap-x-5">
        <div className="grow">
          <span className="block text-xs text-gray-500">Select Quantity</span>
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline0 text-gray-800"
            min={1}
            value={quantity}
            readOnly
          />
        </div>
        <div className="flex justify-end items-center gap-x-1.5">
          <button
            onClick={handleDecrease}
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border bg-white shadow-sm focus:outline-none focus:bg-gray-50 border-gray-200"
            disabled={quantity === 1}
          >
            <Minus className="w-3" />
          </button>
          <button
            onClick={handleIncrease}
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border bg-white shadow-sm focus:outline-none focus:bg-gray-50 border-gray-200"
            disabled={quantity === stock}
          >
            <Plus className="w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
