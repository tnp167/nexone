"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/providers/modal-provider";

import {
  BadgeCheck,
  BadgeMinus,
  CopyPlus,
  Edit,
  Expand,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Coupon } from "@prisma/client";
import { PaymentStatus, OrderStatus } from "@/lib/types";
import { getTimeUntil } from "@/lib/utils";
import CustomModal from "@/components/dashboard/shared/CustomModal";
import CouponDetails from "@/components/dashboard/forms/CouponDetails";
import { deleteCoupon, getCoupon } from "@/queries/coupon";
import { StoreOrderType } from "@/lib/types";
import PaymentStatusTag from "@/components/shared/payment-status";
import OrderStatusTag from "@/components/shared/order-status";
import OrderStatusSelect from "@/components/dashboard/forms/OrderStatusSelect";
import StoreOrderSummary from "@/components/dashboard/shared/StoreOrderSummary";

export const columns: ColumnDef<StoreOrderType>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      return <span>#{row.original.id}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const images = row.original.items.map((item) => item.image);
      return (
        <div className="flex flex-wrap gap-1">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt="product"
              width={50}
              height={50}
              className="size-7 object-cover rounded-full"
              style={{ transform: `translateX(-${idx * 15}px)` }}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      return (
        <div>
          <PaymentStatusTag
            status={row.original.order.paymentStatus as PaymentStatus}
            isTable={true}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <OrderStatusSelect
            storeId={row.original.storeId}
            groupId={row.original.id}
            status={row.original.status as OrderStatus}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return <span>£{row.original.total}</span>;
    },
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => {
      const { setOpen } = useModal();
      return (
        <div>
          <button
            className="font-sans flex justify-center gap-2 items-center mx-auto text-lg text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-primary hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            onClick={() => {
              setOpen(
                <CustomModal maxWidth="!max-w-3xl">
                  <StoreOrderSummary group={row.original} />
                </CustomModal>
              );
            }}
          >
            View
            <span className="size-7 rounded-full bg-white grid  place-items-center">
              <Expand className="w-5 stroke-black" />
            </span>
          </button>
        </div>
      );
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  coupon: Coupon;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ coupon }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const params = useParams<{ storeUrl: string }>();
  // Return null if rowData or rowData.id don't exist
  if (!coupon) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/* Store details component */}
                  <CouponDetails
                    data={{ ...coupon }}
                    storeUrl={params.storeUrl}
                  />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getCoupon(coupon?.id),
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete coupon
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            coupon.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteCoupon(coupon.id, params.storeUrl);
              toast({
                title: "Deleted coupon",
                description: "The coupon has been deleted.",
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
