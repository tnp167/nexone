import { Select } from "@/components/ui/select";
import { StoreStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StoreStatusTag from "@/components/shared/store-status";
import { updateStoreStatus } from "@/queries/store";

interface Props {
  storeId: string;
  status: StoreStatus;
}

const StoreStatusSelect: FC<Props> = ({ storeId, status }) => {
  const [newStatus, setNewStatus] = useState<StoreStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  //Options
  const options = Object.values(StoreStatus).filter(
    (status) => status !== newStatus
  );

  const handleClick = async (selectedStatus: StoreStatus) => {
    try {
      const response = await updateStoreStatus(storeId, selectedStatus);
      if (response) {
        setNewStatus(response as StoreStatus);
        setIsOpen(false);
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
        <StoreStatusTag status={newStatus} />
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
              <StoreStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreStatusSelect;
