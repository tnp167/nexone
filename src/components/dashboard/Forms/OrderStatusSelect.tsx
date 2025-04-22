import { Select } from "@/components/ui/select";
import { OrderStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import OrderStatusTag from "@/components/shared/order-status";
import { updateOrderGroupStatus } from "@/queries/order";

interface Props {
  storeId: string;
  groupId: string;
  status: OrderStatus;
}

const OrderStatusSelect: FC<Props> = ({ storeId, groupId, status }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  //Options
  const options = Object.values(OrderStatus).filter(
    (status) => status !== newStatus
  );

  const handleClick = async (selectedStatus: OrderStatus) => {
    try {
      const response = await updateOrderGroupStatus(
        storeId,
        groupId,
        selectedStatus
      );
      if (response) {
        setNewStatus(response as OrderStatus);
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
        <OrderStatusTag status={newStatus} />
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
              <OrderStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusSelect;
