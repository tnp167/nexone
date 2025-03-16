import { CartProductType } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
//Interface for the cart state
interface State {
  cart: CartProductType[];
  totalItems: number;
  totalPrice: number;
}

//Interface of the actions that can be performed on the cart
interface Actions {
  addToCart: (Item: CartProductType) => void;
  removeFromCart: (Item: CartProductType) => void;
  removeMultipleFromCart: (products: CartProductType[]) => void;
  updateProductQuantity: (product: CartProductType, quantity: number) => void;
  emptyCart: () => void;
}

//Initialize the cart store
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

//Create the cart store
export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart: (product: CartProductType) => {
        if (!product) return;
        const { cart } = get();
        const cartItem = cart.find(
          (item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
        );
        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          );
          set((state) => ({
            cart: updatedCart,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        } else {
          const updatedCart = [...cart, { ...product }];
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        }
      },
      updateProductQuantity: (product: CartProductType, quantity: number) => {
        const { cart } = get();

        //If quantity is 0 or les, remove the item
        if (quantity <= 0) {
          get().removeFromCart(product);
          return;
        }
        const updatedCart = cart.map((item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
            ? { ...item, quantity: quantity }
            : item
        );

        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));
      },
      removeFromCart: (product: CartProductType) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (item) =>
            item.productId !== product.productId ||
            item.variantId !== product.variantId ||
            item.sizeId !== product.sizeId
        );
        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));
      },
      removeMultipleFromCart: (products: CartProductType[]) => {
        products.forEach((product) => {
          get().removeFromCart(product);
        });
      },
      emptyCart: () => {
        set(() => ({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        }));
      },
    }),
    {
      name: "cart",
    }
  )
);
