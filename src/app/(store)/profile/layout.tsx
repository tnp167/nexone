import Header from "@/components/store/layout/header/Header";
import ProfileSidebar from "@/components/store/layout/profile-sidebar/Sidebar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-container mx-auto flex gap-4 p-4">
        <div className="w-[300px]">
          <ProfileSidebar />
        </div>
        <div className="w-full mt-12">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
