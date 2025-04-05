"use client";

import { UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import UserShippingAddresses from "../../shared/shipping-addresses/ShippingAddresses";

interface Props {
  addresses: UserShippingAddressType[];
  countries: Country[];
}

const AddressContainer: FC<Props> = ({ addresses, countries }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
  return (
    <div className="w-full">
      <UserShippingAddresses
        countries={countries}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </div>
  );
};

export default AddressContainer;
