import { Check } from "lucide-react";
import { FC } from "react";

interface Props {
  method: string;
  fee: number;
  extraFee: number;
  weight: number;
  quantity: number;
}

const ProductShippingFee: FC<Props> = ({
  extraFee,
  fee,
  method,
  quantity,
  weight,
}) => {
  switch (method) {
    case "ITEM":
      return (
        <div className="w-full">
          <span className="text-xs flex gap-x-1">
            <Check className="min-w-3 max-w-3 stroke-green-400" />
            <span className="mt-1">
              This store calculates the delivery fee based on the numebr of
              items in the order
            </span>
          </span>
          {fee !== extraFee && (
            <span className="text-xs flex gap-x-1">
              <Check className="min-w-3 max-w-3 stroke-green-400" />
              <span className="mt-1">
                If you purchase multiple items, you will recieve a discount on
                the delivery fee
              </span>
            </span>
          )}
          <table className="w-full mt-1.5">
            <thead className="w-full">
              {fee === extraFee || extraFee === 0 ? (
                <tr
                  className="grid gap-x-1 text-xs px-4"
                  style={{ gridTemplateColumns: `4fr 1fr` }}
                >
                  <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                    Fee per item
                  </td>
                  <td className="w-full min-w-10 bg-gray-50 px-2 -y-0.5 rounded-sm">
                    £{fee}
                  </td>
                </tr>
              ) : (
                <div className="space-y-1">
                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: `4fr 1fr` }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for first item
                    </td>
                    <td className="w-full min-w-10 bg-gray-50 px-2 -y-0.5 rounded-sm">
                      £{fee}
                    </td>
                  </tr>
                  <tr
                    className="grid gap-x-1 text-xs px-4"
                    style={{ gridTemplateColumns: `4fr 1fr` }}
                  >
                    <td className="w-full bg-gray-50 px-2 py-0.5 rounded-sm">
                      Fee for each additional item
                    </td>
                    <td className="w-fit min-w-10 bg-gray-50 px-2 -y-0.5 rounded-sm">
                      £{extraFee}
                    </td>
                  </tr>
                </div>
              )}
            </thead>
            <tbody>
              <tr
                className="grid gap-x-1 text-xs px-4"
                style={{ gridTemplateColumns: `4fr 1fr` }}
              >
                <td className="w-full bg-gray-50 px-2 py-0.5 ">Quantity</td>
                <td className="w-full bg-gray-50 px-2 py-0.5">x{quantity}</td>
              </tr>
              <tr className="flex gap-x-1 text-xs px-4 mt-1 text-center font-semibold">
                <td className="w-full bg-black text-white px-1 py-1">
                  {quantity === 1 || fee === extraFee ? (
                    <span>
                      £{fee} (fee) x {quantity} (items) = £{fee * quantity}
                    </span>
                  ) : (
                    <span>
                      £{fee} (first item) + {quantity - 1} (additional items) x
                      £{extraFee} = £{fee + extraFee * (quantity - 1)}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      break;
    case "WEIGHT":
      return <div>ShippingFee</div>;
    case "FIXED":
      return <div>ShippingFee</div>;
  }
  return <div>ShippingFee</div>;
};

export default ProductShippingFee;
