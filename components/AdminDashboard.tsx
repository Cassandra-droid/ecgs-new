"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [engagementData, setEngagementData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, engagementRes] = await Promise.all([
        axios.get('http://localhost:8000/api/dashboard_summary/'),
        axios.get('http://localhost:8000/api/user_engagement_summary/'),
      ]);
      setDashboardData(dashboardRes.data);
      setEngagementData(engagementRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.open('http://localhost:8000/api/export_prediction_report/', '_blank');
  };

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Predictions */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Total Predictions</h2>
        <p className="text-3xl text-blue-600">{dashboardData?.total_predictions ?? 0}</p>
      </div>

      {/* Average Confidence */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Average Confidence</h2>
        <p className="text-3xl text-green-600">
          {dashboardData?.average_confidence ? dashboardData.average_confidence.toFixed(2) : 'N/A'}
        </p>
      </div>

      {/* Daily Active Users */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Daily Active Users</h2>
        <p className="text-3xl text-purple-600">{engagementData?.daily_active_users ?? 0}</p>
      </div>

      {/* Weekly Active Users */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Weekly Active Users</h2>
        <p className="text-3xl text-yellow-600">{engagementData?.weekly_active_users ?? 0}</p>
      </div>

      {/* User Events */}
      <div className="bg-white shadow rounded-2xl p-6 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">User Event Counts</h2>
        <ul className="list-disc list-inside">
          {dashboardData?.user_event_counts?.map((event: any, index: number) => (
            <li key={index} className="text-gray-700">
              {event.event_type}: {event.count}
            </li>
          ))}
        </ul>
      </div>

      {/* Download Report Button */}
      <div className="bg-white shadow rounded-2xl p-6 flex items-center justify-center">
        <button
          onClick={handleDownloadReport}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Download Prediction Report
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

