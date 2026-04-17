"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Users } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout 
      role="super_admin" 
      userName="System Admin" 
      userDescription="Super Admin"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Schools</p>
            <p className="text-2xl font-bold text-gray-900">42</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Schools</h2>
         <p className="text-sm text-gray-500">School management interface will be displayed here.</p>
      </div>
    </DashboardLayout>
  );
}
