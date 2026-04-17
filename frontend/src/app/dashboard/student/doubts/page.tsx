"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DoubtsPage() {
  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-4xl">🤖</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Doubt Assistant</h1>
        <p className="text-gray-500 max-w-md">Ask questions and get instant, detailed explanations from our AI tutor.</p>
      </div>
    </DashboardLayout>
  );
}
