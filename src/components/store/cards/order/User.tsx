import { UserShippingAddressType } from "@/lib/types";
import Image from "next/image";
import React from "react";

const OrderUserDrtailsCard = ({
  details,
}: {
  details: UserShippingAddressType;
}) => {
  const {
    user,
    firstName,
    lastName,
    phone,
    address1,
    address2,
    city,
    state,
    zip_code,
    country,
  } = details;
  return (
    <div>
      <section className="p-2 shadow-sm w-full">
        <div className="w-fit mx-auto">
          <Image
            src={user.picture}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full size-28 object-cover"
          />
        </div>
        <div className="text-main-primary mt-2 space-y-2">
          <h2 className="text-center font-bold text-2xl tracking-wide capitalize">
            {firstName} {lastName}
          </h2>
          <h6 className="border-dashed text-center py-2 border-t border-neutral-400">
            {user.email}
          </h6>
          <h6 className="text-center">{phone}</h6>
          <h6 className="border-dashed text-center py-2 border-t border-neutral-400 text-sm">
            {address1}, {address2} ,{city}, {state}, {zip_code}, {country.name}
          </h6>
        </div>
      </section>
    </div>
  );
};

export default OrderUserDrtailsCard;
