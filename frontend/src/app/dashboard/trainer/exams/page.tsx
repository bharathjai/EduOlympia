"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function TrainerExamsPage() {
  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 text-4xl">⏱️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Management</h1>
        <p className="text-gray-500 max-w-md">Schedule formal mock Olympiads, set timers, and manage proctoring rules.</p>
      </div>
    </DashboardLayout>
  );
}
