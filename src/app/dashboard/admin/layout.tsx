import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/dashboard/Header/Header/Header";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
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
      <div className="w-full ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
