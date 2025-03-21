import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";

const SellerCouponsPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  return (
    <div></div>

    //     <DataTable
    //     actionButtonText={
    //       <>
    //         <Plus size={15} />
    //         Create Product
    //       </>
    //     }
    //     modalChildren={
    //       <ProductDetails
    //         categories={categories}
    //         storeUrl={storeUrl}
    //         offerTags={offerTags}
    //         countries={countries}
    //       />
    //     }
    //     newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
    //     filterValue="image"
    //     data={products || []}
    //     columns={columns}
    //     searchPlaceholder="Seach product name"
    //   />
  );
};

export default SellerCouponsPage;
