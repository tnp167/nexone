import StoreDefaultShippingDetails from "@/components/dashboard/Forms/StoreDefaultShippingDetails";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import React from "react";

const SellerStoreShippingPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const shippingDetails = await getStoreDefaultShippingDetails(storeUrl);
  return (
    <div>
      <StoreDefaultShippingDetails data={shippingDetails} />
    </div>
  );
};

export default SellerStoreShippingPage;
