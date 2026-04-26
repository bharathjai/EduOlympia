const fs = require('fs');
const path = require('path');

const writePage = (filePath, content) => {
  const fullPath = path.join(__dirname, 'src', 'app', 'dashboard', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Written:', fullPath);
};

const pages = [
  {
    path: 'super-admin/trainers/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Filter, Plus, MoreVertical, BookOpen, ToggleRight, ToggleLeft } from "lucide-react";
import { useState } from "react";

export default function TrainerManagement() {
  const [trainers, setTrainers] = useState([
    { id: "TR-001", name: "Dr. Robert Clark", subject: "Mathematics", email: "robert@eduolympia.com", status: true },
    { id: "TR-002", name: "Sarah Williams", subject: "Physics", email: "sarah@eduolympia.com", status: true },
    { id: "TR-003", name: "Michael Chang", subject: "Chemistry", email: "michael@eduolympia.com", status: false },
    { id: "TR-004", name: "Emily Davis", subject: "Biology", email: "emily@eduolympia.com", status: true },
  ]);

  const toggleStatus = (id: string) => {
    setTrainers(trainers.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform trainers, subject assignments, and access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700">
            <Plus className="w-4 h-4" /> Add Trainer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search trainers..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">Trainer</th>
                <th className="px-6 py-0">Subject</th>
                <th className="px-6 py-0">Email</th>
                <th className="px-6 py-0">Access Status</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trainers.map((trainer, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-xs">{trainer.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trainer.name}</p>
                        <p className="text-xs text-gray-500">{trainer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" /> {trainer.subject}
                    </div>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-500">{trainer.email}</td>
                  <td className="px-6 py-0">
                    <button onClick={() => toggleStatus(trainer.id)} className={\`flex items-center gap-2 text-sm font-medium \${trainer.status ? 'text-green-600' : 'text-gray-400'}\`}>
                      {trainer.status ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      {trainer.status ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-0 text-right">
                    <button className="text-gray-400 hover:text-[#B45309] transition-colors">
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
}`
  },
  {
    path: 'super-admin/billing/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { CreditCard, Search, Download, ExternalLink, Activity } from "lucide-react";

export default function BillingManagement() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage school subscriptions, invoices, and payment tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Monthly Recurring Revenue", value: "$42,500", label: "MRR", trend: "+12%" },
          { title: "Active Subscriptions", value: "128", label: "Schools", trend: "+4" },
          { title: "Pending Invoices", value: "14", label: "Action Required", trend: "-2" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-50 text-[#B45309]">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.title} • {stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">Invoice ID</th>
                <th className="px-6 py-0">School Name</th>
                <th className="px-6 py-0">Amount</th>
                <th className="px-6 py-0">Status</th>
                <th className="px-6 py-0">Date</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "INV-2023-001", school: "Greenwood High", amount: "$1,200", status: "Paid", date: "Oct 01, 2023" },
                { id: "INV-2023-002", school: "Oakridge International", amount: "$2,400", status: "Pending", date: "Oct 05, 2023" },
                { id: "INV-2023-003", school: "Silver Oaks Academy", amount: "$800", status: "Overdue", date: "Sep 15, 2023" },
              ].map((inv, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-medium text-gray-900">{inv.id}</td>
                  <td className="px-6 py-0 text-sm text-[#B45309] font-medium">{inv.school}</td>
                  <td className="px-6 py-0 text-sm font-bold text-gray-700">{inv.amount}</td>
                  <td className="px-6 py-0">
                    <span className={\`px-2.5 py-1 text-xs font-medium rounded-full \${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}\`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-500">{inv.date}</td>
                  <td className="px-6 py-0 text-right flex items-center justify-end gap-2 h-[48px]">
                    <button className="p-1 text-gray-400 hover:text-[#B45309] transition-colors"><Download className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-400 hover:text-[#B45309] transition-colors"><ExternalLink className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  }
];

pages.forEach(p => writePage(p.path, p.content));
console.log('Batch 2 detailed pages generated.');
