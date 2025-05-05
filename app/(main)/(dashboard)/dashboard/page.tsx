import DashboardPage from "@/components/dashboard/dashboard-page";
import { getCurrentUser } from "@/lib/auth-bypass";
import React from "react";

const Dashboard = async () => {
  const user = await getCurrentUser();
  return (
    <div>
      <DashboardPage user={user} />
    </div>
  );
};

export default Dashboard;
