import AddressContainer from "@/components/store/profile/addresses/Container";
import { db } from "@/lib/db";
import { getUserShippingAddresses } from "@/queries/user";
import React from "react";

const ProfileAddressesPage = async () => {
  const addresses = await getUserShippingAddresses();
  const countries = await db.country.findMany();
  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  );
};

export default ProfileAddressesPage;
