import { Header } from "@/components/main/common/header";
import { getCurrentUser } from "@/lib/auth";
import React from "react";
import { Navbar } from "@/components/main/common/navbar"

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-main dark:bg-background">
      
      <Navbar />

      <main className="min-h-screen">{children}</main>
    </div>
  );
};

export default HomeLayout;
