"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  FilePenLine,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { getCategory } from "@/queries/category";
import { deleteProduct } from "@/queries/product";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@prisma/client";
import { StoreProductType } from "@/lib/types";
import Link from "next/link";

export const columns: ColumnDef<StoreProductType>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-3">
          <h1 className="font-bold truncate pb-3 border-b">
            {row.original.name}
          </h1>
          <div className="relative flex flex-wrap gap-2">
            {row.original.variants.map((variant) => (
              <div key={variant.id} className="flex flex-col gap-y-2 group">
                <div className="relative cursor-pointer p-2">
                  <Image
                    src={variant.images[0].url}
                    alt={`${variant.variantName} image`}
                    width={1000}
                    height={1000}
                    className="max-w-64 h-72 rounded-md object-cover shadow-sm"
                  />
                  <Link
                    href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/${variant.id}`}
                  >
                    <div className="w-[304px] h-full absolute inset-0 z-0 rounded-sm bg-black/50 transition-all duration-300 hidden group-hover:block">
                      <FilePenLine className="absolute w-6 h-6 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </Link>
                  {/* Colors */}
                  <div className="flex mt-2 gap-2 p-1">
                    <div className="w-7 flex flex-col gap-2  rounded-md">
                      {variant.colors.map((color) => (
                        <>
                          <span
                            key={color.name}
                            className="w-5 h-5 rounded-full shadow-2xl"
                            style={{ backgroundColor: color.name }}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                  {/*  Name of variant */}
                  <div>
                    <h1 className="max-w-40 capitalize text-sm">
                      {variant.variantName}
                    </h1>
                    <div className="flex flex-wrap gap-2 max-w-72 mt-1">
                      {variant.sizes.map((size) => (
                        <span
                          key={size.size}
                          className="w-fit p-1 rounded-md text-xs font-medium bg-white/10"
                        >
                          {size.size} - ({size.quantity}) - {size.price}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return row.original.name.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <span>{row.original.category.name}</span>;
    },
  },
  {
    accessorKey: "subCategory",
    header: "Sub Category",
    cell: ({ row }) => {
      return <span>{row.original.subCategory.name}</span>;
    },
  },
  {
    accessorKey: "offerTag",
    header: "Offer Tag",
    cell: ({ row }) => {
      const offerTag = row.original.offerTag;
      return <span>{offerTag ? offerTag.name : "-"}</span>;
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return <span>{row.original.brand}</span>;
    },
  },
  {
    accessorKey: "new-variant",
    header: "Add Variant",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/new`}
        >
          <CopyPlus className="hover:text-blue-500 " />
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions productId={rowData.id} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  productId: string;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ productId }) => {
  // Hooks
  const { setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!productId) return null;

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
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete product
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
            product and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteProduct(productId);
              toast({
                title: "Deleted product",
                description: "The product has been deleted.",
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
