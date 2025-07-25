"use client";

import { Country } from "@prisma/client";

import { UserShippingAddressType } from "@/lib/types";
import { ShippingAddress } from "@prisma/client";
import { FC, SetStateAction, useState } from "react";
import { Dispatch } from "react";
import { Plus } from "lucide-react";
import Modal from "../Modal";
import AddressDetails from "./AddressDetails";
import AddressList from "./AddressList";

interface Props {
  countries: Country[];
  addresses: UserShippingAddressType[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const UserShippingAddresses: FC<Props> = ({
  countries,
  addresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && (
          <AddressList
            addresses={addresses}
            countries={countries}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
        <div
          className="mt-4 ml-8 text-orange-background cursor-pointer"
          onClick={() => setShow(true)}
        >
          <Plus className="inline-block mr-1 w-3" />
          <span className="text-sm">Add new address</span>
        </div>
        {/* Modal */}
        <Modal title="Add new address" show={show} setShow={setShow}>
          <AddressDetails
            countries={countries}
            setShow={setShow}
            data={selectedAddress}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
