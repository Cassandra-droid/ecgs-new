import { Logo } from "@/components/common/logo";
import React, { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-2 dark:from-gray-950 dark:to-blue-950">
      <div className="w-full">
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
