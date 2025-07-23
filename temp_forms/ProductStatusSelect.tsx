import { Select } from "@/components/ui/select";
import { ProductStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductStatusTag from "@/components/shared/product-status";
import { updateOrderItemStatus } from "@/queries/order";

interface Props {
  storeId: string;
  orderItemId: string;
  status: ProductStatus;
}

const ProductStatusSelect: FC<Props> = ({ storeId, orderItemId, status }) => {
  const [newStatus, setNewStatus] = useState<ProductStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  //Options
  const options = Object.values(ProductStatus).filter(
    (status) => status !== newStatus
  );

  const handleClick = async (selectedStatus: ProductStatus) => {
    try {
      const response = await updateOrderItemStatus(
        storeId,
        orderItemId,
        selectedStatus
      );
      if (response) {
        setNewStatus(response as ProductStatus);
        router.refresh();
      }
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  return (
    <div className="relative">
      {/* Current status */}
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <ProductStatusTag status={newStatus} />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-md shadow-md mt-3 w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <ProductStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductStatusSelect;
