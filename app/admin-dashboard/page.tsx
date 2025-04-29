// src/pages/AdminDashboardPage.tsx
import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm mt-1">Welcome, Admin! Here's an overview of your system performance.</p>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminDashboardPage;
