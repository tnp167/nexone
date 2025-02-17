import Header from "@/components/dashboard/Header/Header/Header";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const SellerStoreLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const store = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });
  return (
    <div className="flex w-full h-full">
      <Sidebar stores={store} isAdmin={false} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default SellerStoreLayout;
