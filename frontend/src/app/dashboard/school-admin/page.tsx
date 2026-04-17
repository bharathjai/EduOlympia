"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen } from "lucide-react";

export default function SchoolAdminDashboard() {
  return (
    <DashboardLayout 
      role="school_admin" 
      userName="Principal Gupta" 
      userDescription="School Admin - Delhi Public School"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">2,847</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Student Management</h2>
         <p className="text-sm text-gray-500">Upload CSV and manage students from here.</p>
      </div>
    </DashboardLayout>
  );
}
