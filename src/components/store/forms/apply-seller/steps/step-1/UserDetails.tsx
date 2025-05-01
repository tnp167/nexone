import { UserButton, useUser } from "@clerk/nextjs";
import React, { useRef } from "react";
import Image from "next/image";
import DefaultUserImg from "@/public/assets/images/default-user.jpg";
import Input from "@/components/store/ui/input";
const UserDetails = () => {
  const { user } = useUser();
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = () => {
    const userButton = buttonContainerRef.current?.querySelector("button");
    if (userButton) {
      userButton.click();
    }
  };
  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="relative">
        <Image
          src={user?.imageUrl || DefaultUserImg}
          alt="User"
          width={100}
          height={100}
          className="rounded-full cursor-pointer"
          onClick={handleImageClick}
        />
        {/* Hidden UserButton */}
        <div
          className="absolute  inset-0 z-0 opacity-0 pointer-events-none"
          ref={buttonContainerRef}
        >
          <UserButton />
        </div>
      </div>
      {/* First Name Input */}
      <Input
        name="firstName"
        placeholder="First Name"
        value={user?.firstName || ""}
        onChange={() => {}}
        type="text"
        readOnly
      />
      <Input
        name="lastName"
        placeholder="Last Name"
        value={user?.lastName || ""}
        onChange={() => {}}
        type="text"
        readOnly
      />
    </div>
  );
};
export default UserDetails;
