"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function TrainerAnalyticsPage() {
  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-4 text-4xl">📊</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500 max-w-md">View detailed analytics on batch performance, question difficulty, and overall student progress.</p>
      </div>
    </DashboardLayout>
  );
}
