"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";
import CustomModal from "@/components/dashboard/shared/CustomModal";
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
  Edit,
  Expand,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { deleteCategory, getCategory } from "@/queries/category";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@prisma/client";
import { AdminStoreType, StoreStatus } from "@/lib/types";
import StoreStatusSelect from "@/components/dashboard/forms/StoreStatusSelect";
import { deleteStore } from "@/queries/store";
import StoreSummary from "@/components/dashboard/shared/StoreSummary";
export const columns: ColumnDef<AdminStoreType>[] = [
  {
    accessorKey: "cover",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
          <Image
            src={row.original.cover}
            alt=""
            width={1000}
            height={1000}
            className="w-96 h-40 rounded-md object-cover shadow-2xl"
          />
          <Image
            src={row.original.logo}
            alt=""
            width={200}
            height={200}
            className="size-24 rounded-full object-cover shadow-2xl absolute top-1/2 -translate-y-1/2 left-4"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="text-sm line-clamp-3">{row.original.description}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StoreStatusSelect
          status={row.original.status as StoreStatus}
          storeId={row.original.id}
        />
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return <span>/{row.original.url}</span>;
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
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
                  <StoreSummary store={row.original} />
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
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions storeId={rowData.id} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  storeId: string;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ storeId }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!storeId) return null;

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
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete store
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
            This action cannot be undone. This will permanently delete the store
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteStore(storeId);
              toast({
                title: "Deleted store",
                description: "The store has been deleted.",
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
