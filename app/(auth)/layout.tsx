import { Logo } from "@/components/common/logo";
import React, { Suspense } from "react";
import { Navbar } from "@/components/main/common/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-blue-950">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto my-4 w-full max-w-md rounded-xl border-2 bg-white p-4 shadow-xl dark:bg-gray-950">
          <div className="mt-4">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
