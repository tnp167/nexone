import StoreDefaultShippingDetails from "@/components/dashboard/forms/StoreDefaultShippingDetails";
import DataTable from "@/components/ui/data-table";
import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store";
import { redirect } from "next/navigation";
import React from "react";
import { columns } from "./columns";

const SellerStoreShippingPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const shippingDetails = await getStoreDefaultShippingDetails(storeUrl);
  const shippingRates = await getStoreShippingRates(storeUrl);
  if (!shippingDetails || !shippingRates) return redirect("/");
  return (
    <div>
      <StoreDefaultShippingDetails data={shippingDetails} storeUrl={storeUrl} />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        columns={columns}
        searchPlaceholder="Search by country name"
      />
    </div>
  );
};

export default SellerStoreShippingPage;
