import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
const AdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();
  if (user?.privateMetadata?.role !== "ADMIN") redirect("/");
  return (
    <div className="w-full h-full">
      <Sidebar isAdmin={true} />
      <div className="ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
