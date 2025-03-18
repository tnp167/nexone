import { useCartStore } from "@/cart-store/useCartStore";
import { CartProductType, Country } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addToWishlist } from "@/queries/user";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Trash,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, SetStateAction, useEffect, useRef, useState } from "react";
import { Dispatch } from "react";
import toast from "react-hot-toast";

interface Props {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
  setTotalShipping: Dispatch<SetStateAction<number>>;
  userCountry: Country;
}

const CartProduct: FC<Props> = ({
  product,
  selectedItems,
  setSelectedItems,
  setTotalShipping,
  userCountry,
}) => {
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    sizeId,
    image,
    price,
    quantity,
    stock,
    size,
    weight,
    shippingMethod,
    shippingService,
    shippingFee,
    extraShippingFee,
  } = product;

  //Store previous valuest to avoid unnecessary re-renders
  const previousShippingFeeRef = useRef(shippingFee);
  const previousUserCountryRef = useRef(userCountry);

  const totalPrice = price * quantity;

  const unique_id = `${productId}-${variantId}-${sizeId}`;
  const [shippingInfo, setShippingInfo] = useState({
    initialFee: 0,
    extraFee: 0,
    totalFee: 0,
    method: shippingMethod,
    weight: weight,
    shippingService: shippingService,
  });

  const calculateShipping = () => {
    let initialFee = 0;
    let extraFee = 0;
    let totalFee = 0;

    if (shippingMethod === "ITEM") {
      initialFee = shippingFee;
      extraFee = quantity > 1 ? extraShippingFee * (quantity - 1) : 0;
      totalFee = initialFee + extraFee;
    } else if (shippingMethod === "WEIGHT") {
      totalFee = shippingFee * weight * quantity;
    } else if (shippingMethod === "FIXED") {
      totalFee = shippingFee;
    }

    // Subtract the previous shipping total for this product before updating
    if (stock > 0) {
      setTotalShipping(
        (prevTotal) => prevTotal - shippingInfo.totalFee + totalFee
      );
    }

    setShippingInfo({
      initialFee,
      extraFee,
      totalFee,
      method: shippingMethod,
      weight,
      shippingService,
    });
  };

  //Recalculate shipping when quantity, shippingFee, or userCountry changes
  useEffect(() => {
    if (shippingFee !== previousShippingFeeRef.current) {
      calculateShipping();
      previousShippingFeeRef.current = shippingFee;
    }
    if (userCountry !== previousUserCountryRef.current) {
      calculateShipping();
      previousUserCountryRef.current = userCountry;
    }

    //Add a chcek to recalculate shipping on component load
    if (!shippingInfo.totalFee) {
      calculateShipping();
    }
  }, [quantity, shippingFee, userCountry, shippingInfo.totalFee, stock]);

  const selected = selectedItems.find(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`
  );

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
      );
      return exists
        ? prev.filter((item) => item !== product) // remove product if it already exists
        : [...prev, product]; // add product if it doesn't exist
    });
  };

  const { updateProductQuantity, removeFromCart } = useCartStore(
    (state) => state
  );

  const updateProductQuantityHandler = (type: "add" | "remove") => {
    if (type === "add" && quantity < stock) {
      updateProductQuantity(product, quantity + 1);
    } else if (type === "remove" && quantity > 1) {
      updateProductQuantity(product, quantity - 1);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await addToWishlist(productId, variantId, sizeId);
      if (response) toast.success("Added to wishlist");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div
      className={cn("bg-white px-6 border-t border-t-[#EBEBEB] select-none", {
        "bg-red-100": stock === 0,
      })}
    >
      <div className="py-4">
        {/* Image */}
        <div className="relative flex self-start">
          <div className="flex items-center">
            {stock > 0 && (
              <label
                htmlFor={unique_id}
                className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-2 cursor-pointer align-middle"
              >
                <span className="leading-8 inline-flex p-0.5 cursor-pointer ">
                  <span
                    className={cn(
                      "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-background",
                      {
                        "border-orange-background": selected,
                      }
                    )}
                  >
                    {selected && (
                      <span className="bg-orange-background  w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 text-white mt-0.5" />
                      </span>
                    )}
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={unique_id}
                  hidden
                  onChange={() => handleSelectProduct()}
                />
              </label>
            )}
            <Link
              href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
            >
              <div className="m-0 mr-4 ml-2 size-28 bg-gray-200 relative rounded-lg">
                <Image
                  src={image}
                  alt={name}
                  height={200}
                  width={200}
                  className="size-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap text-black"
              >
                {name} · {variantName}
              </Link>
              <div className="absolute top-0 right-0">
                <span
                  className="mr-2.5 cursor-pointer inline-block"
                  onClick={() => handleAddToWishlist()}
                >
                  <Heart className="w-4 hover:stroke-orange-seconadry" />
                </span>
                <span
                  className="cursor-pointer inline-block"
                  onClick={() => removeFromCart(product)}
                >
                  <Trash className="w-4 hover:stroke-orange-seconadry" />
                </span>
              </div>
            </div>
            {/* Style - size */}
            <div className="my-1">
              <button className="text-main-primary relative h-[24px] bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer  outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Delivery */}
            <div className="flex items-center justify-between mt-2 relative">
              {stock > 0 ? (
                <div>
                  <span className="inline-block break-all">
                    ${price.toFixed(2)} x {quantity} = £{totalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="inline-block break-all text-sm text-red-500">
                    Out of stock
                  </span>
                </div>
              )}
              {/* Quantity changer */}
              <div className="text-xs">
                <div className="text-gray-900 items-center text-sm leading-6 list-none inline-flex">
                  <div
                    className="size-6 text-xs grid place-items-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    onClick={() => updateProductQuantityHandler("remove")}
                  >
                    <Minus className="w-3 stroke-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={quantity}
                    min={1}
                    max={stock}
                    className="m-1 h-6 w-[32px]  bg-transparent border-none leading-6 tracking-normal text-center outline-none text-gray-900 font-bold"
                  />
                  <div
                    className="size-6 text-xs grid place-items-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    onClick={() => updateProductQuantityHandler("add")}
                  >
                    <Plus className="w-3 stroke-[#555]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping Info */}
            {stock > 0 && (
              <div className="mt-1 text-xs text-[#999] cursor-pointer">
                <div className="flex items-center txet-[#01A971]">
                  <span>
                    <Truck className="w-4 inline-block text-[#01A971]" />
                    {shippingInfo.totalFee > 0 ? (
                      <span className="text-[#01A917] ml-1">
                        {shippingMethod === "ITEM" ? (
                          <>
                            £{shippingInfo.initialFee} (first item) +
                            {quantity > 1
                              ? `+ £${extraShippingFee} x £${
                                  quantity - 1
                                } item(s) (additional items)`
                              : " x 1"}
                            = £{shippingInfo.totalFee.toFixed(2)}
                          </>
                        ) : shippingMethod === "WEIGHT" ? (
                          <>
                            £{shippingFee} x {shippingInfo.weight}kg x&nbsp;
                            {quantity} {quantity > 1 ? "items" : "item"} = £
                            {shippingInfo.totalFee.toFixed(2)}
                          </>
                        ) : (
                          <>Fixed Fee: £{shippingInfo.totalFee.toFixed(2)}</>
                        )}
                      </span>
                    ) : (
                      <span className="text-[#01A917] ml-1">Free Delivery</span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
