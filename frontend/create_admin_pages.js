const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'dashboard');

const superAdminPages = [
  { name: 'Dashboard', path: 'super-admin/page.tsx', title: 'Platform Overview', icon: 'Building2' },
  { name: 'Schools', path: 'super-admin/schools/page.tsx', title: 'School Management', icon: 'Building2' },
  { name: 'Trainers', path: 'super-admin/trainers/page.tsx', title: 'Trainer Management', icon: 'Users' },
  { name: 'Content Approval', path: 'super-admin/content-approval/page.tsx', title: 'Content Approval', icon: 'CheckCircle' },
  { name: 'Exam Approval', path: 'super-admin/exam-approval/page.tsx', title: 'Exam Approval', icon: 'Calendar' },
  { name: 'Results', path: 'super-admin/results/page.tsx', title: 'Results & Leaderboard', icon: 'BarChart' },
  { name: 'Awards', path: 'super-admin/awards/page.tsx', title: 'Awards & Recognitions', icon: 'Award' },
  { name: 'Analytics', path: 'super-admin/analytics/page.tsx', title: 'Platform Analytics', icon: 'BarChart' },
  { name: 'Billing', path: 'super-admin/billing/page.tsx', title: 'Billing & Subscriptions', icon: 'CreditCard' },
  { name: 'Settings', path: 'super-admin/settings/page.tsx', title: 'Platform Settings', icon: 'Settings' },
];

const schoolAdminPages = [
  { name: 'Dashboard', path: 'school-admin/page.tsx', title: 'School Overview', icon: 'LayoutDashboard' },
  { name: 'Students', path: 'school-admin/students/page.tsx', title: 'Student Management', icon: 'GraduationCap' },
  { name: 'Exams', path: 'school-admin/exams/page.tsx', title: 'Exams & Results', icon: 'Calendar' },
  { name: 'Reports', path: 'school-admin/reports/page.tsx', title: 'Performance Reports', icon: 'BarChart' },
  { name: 'Certificates', path: 'school-admin/certificates/page.tsx', title: 'Certificates', icon: 'Award' },
  { name: 'Settings', path: 'school-admin/settings/page.tsx', title: 'School Settings', icon: 'Settings' },
];

function createPageContent(role, title, icon) {
  const isSuperAdmin = role === 'super_admin';
  const roleName = isSuperAdmin ? 'Super Admin' : 'School Admin';
  const userName = isSuperAdmin ? 'System Admin' : 'School Principal';
  const accentColorHex = isSuperAdmin ? '#B45309' : '#1D6A4A';
  const accentHoverHex = isSuperAdmin ? '#92400E' : '#14532D'; // darker shades

  return `"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { ${icon}, Search, Filter, Plus, MoreVertical, Sparkles } from "lucide-react";

export default function ${title.replace(/[^a-zA-Z]/g, '')}() {
  return (
    <DashboardLayout 
      role="${role}" 
      userName="${userName}" 
      userDescription="${roleName}"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">${title}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and overview your ${title.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: '${accentColorHex}' }}>
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0 shadow-sm border border-purple-200/50">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-purple-900 mb-1">AI Insight</h3>
          <p className="text-sm text-purple-700">Everything is running smoothly. User engagement has increased by 14% this week. Consider reviewing the latest reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${'${role}' === 'super_admin' ? 'bg-amber-100 text-[#B45309]' : 'bg-green-100 text-[#1D6A4A]'}\`}>
              <${icon} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Metric {i}</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Records</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-opacity-50"
              style={{ 
                '--tw-ring-color': '${role}' === 'super_admin' ? '#B45309' : '#1D6A4A',
                '--tw-border-color': '${role}' === 'super_admin' ? '#B45309' : '#1D6A4A',
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">ID</th>
                <th className="px-6 py-0">Name</th>
                <th className="px-6 py-0">Status</th>
                <th className="px-6 py-0">Date</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                <tr key={row} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-medium text-gray-900">#00{row}</td>
                  <td className="px-6 py-0 text-sm text-gray-600">Sample Record {row}</td>
                  <td className="px-6 py-0">
                    <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-500">Oct 24, 2023</td>
                  <td className="px-6 py-0 text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
`;
}

function createPages(pages, role) {
  pages.forEach(page => {
    const fullPath = path.join(baseDir, page.path);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, createPageContent(role, page.title, page.icon));
    console.log(`Created ${fullPath}`);
  });
}

createPages(superAdminPages, 'super_admin');
createPages(schoolAdminPages, 'school_admin');

