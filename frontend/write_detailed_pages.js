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
    path: 'super-admin/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Users, FileText, Activity, Sparkles, TrendingUp } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of EduOlympia operations.</p>
        </div>
      </div>

      <div className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0 shadow-sm border border-purple-200/50">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-purple-900 mb-1">AI System Insight</h3>
          <p className="text-sm text-purple-700">Platform activity is up 18% this week. 12 new schools onboarded. 45 exams are pending approval for the upcoming week.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Schools", value: "142", icon: Building2, trend: "+12%" },
          { title: "Active Students", value: "24.5k", icon: Users, trend: "+18%" },
          { title: "Exams Conducted", value: "856", icon: FileText, trend: "+5%" },
          { title: "Platform Revenue", value: "$45.2k", icon: TrendingUp, trend: "+22%" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100 text-[#B45309]">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue & Growth</h2>
          <div className="h-64 flex items-end gap-2">
            {[40, 55, 35, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-amber-100 rounded-t-md relative group hover:bg-[#B45309] transition-colors" style={{ height: \`\${h}%\` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  $\${h}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { text: "Greenwood High registered", time: "2 hours ago", icon: Building2 },
              { text: "Math Olympiad content uploaded", time: "4 hours ago", icon: FileText },
              { text: "Physics Exam results published", time: "5 hours ago", icon: Activity },
              { text: "New trainer account approved", time: "1 day ago", icon: Users },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'super-admin/schools/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Plus, MoreVertical, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";

export default function SchoolsManagement() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered schools and onboard new ones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700">
            <Plus className="w-4 h-4" /> Add School
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search schools by name, code, or city..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">School ID</th>
                <th className="px-6 py-0">School Name</th>
                <th className="px-6 py-0">Students</th>
                <th className="px-6 py-0">Status</th>
                <th className="px-6 py-0">Onboarded</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "SCH-101", name: "Greenwood High", students: 1250, status: "Active", date: "Oct 24, 2023" },
                { id: "SCH-102", name: "Oakridge International", students: 840, status: "Active", date: "Oct 22, 2023" },
                { id: "SCH-103", name: "Silver Oaks Academy", students: 450, status: "Inactive", date: "Oct 15, 2023" },
                { id: "SCH-104", name: "Delhi Public School", students: 2100, status: "Active", date: "Sep 30, 2023" },
              ].map((school, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-medium text-gray-900">{school.id}</td>
                  <td className="px-6 py-0 text-sm font-medium text-[#B45309] hover:underline cursor-pointer">
                    <Link href={\`/dashboard/super-admin/schools/\${school.id}\`}>{school.name}</Link>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-600">{school.students}</td>
                  <td className="px-6 py-0">
                    <span className={\`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-max \${school.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                      {school.status === 'Active' ? <ShieldCheck className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-0 text-sm text-gray-500">{school.date}</td>
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
    path: 'super-admin/schools/[id]/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Users, FileText, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SchoolDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="mb-6">
        <Link href="/dashboard/super-admin/schools" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#B45309] transition-colors w-max mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Schools
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-amber-100 text-[#B45309] flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Greenwood High School</h1>
              <p className="text-sm text-gray-500 mt-1">ID: {params.id as string} | Joined Oct 24, 2023</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Edit Profile</button>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Suspend</button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "students", label: "Students", icon: Users },
          { id: "exams", label: "Exams", icon: FileText },
          { id: "billing", label: "Billing", icon: CreditCard },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={\`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap \${activeTab === tab.id ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}\`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Displaying <strong className="text-gray-900 capitalize">{activeTab}</strong> data for this school.</p>
          <p className="text-sm text-gray-400">Detailed tables and charts go here based on the selected tab.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'super-admin/content-approval/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, CheckCircle, XCircle, FileText, Eye, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function ContentApproval() {
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  const contents = [
    { id: 1, title: "Algebra Basics Notes", subject: "Math", author: "Dr. Clark", status: "Pending", type: "PDF" },
    { id: 2, title: "Quantum Physics Intro", subject: "Physics", author: "Sarah W.", status: "Pending", type: "Video" },
    { id: 3, title: "Organic Chem Basics", subject: "Chemistry", author: "Mike C.", status: "Pending", type: "PDF" },
  ];

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Approval</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve trainer uploads before publishing.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Pending Reviews</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {contents.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedContent(item.id)}
                className={\`p-4 cursor-pointer transition-colors \${selectedContent === item.id ? 'bg-amber-50 border-l-4 border-[#B45309]' : 'hover:bg-gray-50 border-l-4 border-transparent'}\`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{item.type}</span>
                </div>
                <p className="text-xs text-gray-500">By {item.author} • {item.subject}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[2] bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          {selectedContent ? (
            <>
              <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{contents.find(c => c.id === selectedContent)?.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">Submitted on Oct 25, 2023</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center flex-col gap-3 min-h-[400px]">
                <FileText className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 font-medium">Document Preview Area</p>
                <button className="flex items-center gap-2 text-sm text-[#B45309] hover:underline">
                  <Eye className="w-4 h-4" /> Open Full Screen
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select an item from the list to preview.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'school-admin/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen, Trophy, Calendar, Sparkles } from "lucide-react";

export default function SchoolDashboard() {
  return (
    <DashboardLayout role="school_admin" userName="School Principal" userDescription="School Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of student performance and upcoming events.</p>
        </div>
      </div>

      <div className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0 shadow-sm border border-purple-200/50">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-purple-900 mb-1">AI Performance Insight</h3>
          <p className="text-sm text-purple-700">78% of your students are excelling in Mathematics. However, Grade 9 Physics scores have dropped by 5%. Consider assigning more practice tests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Enrolled", value: "1,250", icon: Users },
          { title: "Active Exams", value: "4", icon: BookOpen },
          { title: "Avg. Score", value: "82%", icon: Trophy },
          { title: "Upcoming Tests", value: "12", icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-[#1D6A4A]">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Student Participation</h2>
          <div className="space-y-4">
            {[
              { grade: "Grade 10", percent: 92 },
              { grade: "Grade 9", percent: 85 },
              { grade: "Grade 8", percent: 78 },
              { grade: "Grade 11", percent: 95 },
            ].map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{g.grade}</span>
                  <span className="text-gray-500">{g.percent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#1D6A4A] h-2 rounded-full" style={{ width: \`\${g.percent}%\` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Exams</h2>
          <div className="space-y-4">
            {[
              { name: "National Math Olympiad", date: "Nov 15, 2023", enrolled: 450 },
              { name: "Regional Science Bee", date: "Nov 22, 2023", enrolled: 320 },
              { name: "Computer Literacy Test", date: "Dec 05, 2023", enrolled: 150 },
            ].map((exam, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{exam.name}</h3>
                  <p className="text-xs text-gray-500">{exam.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1D6A4A]">{exam.enrolled}</p>
                  <p className="text-[10px] text-gray-400 uppercase">Registered</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'school-admin/students/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Plus, Upload, MoreVertical } from "lucide-react";

export default function StudentManagement() {
  return (
    <DashboardLayout role="school_admin" userName="School Principal" userDescription="School Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage enrollments, batches, and individual student profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#1D6A4A] hover:bg-green-800">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students by name or roll number..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none">
              <option>All Grades</option>
              <option>Grade 10</option>
              <option>Grade 9</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">Roll No</th>
                <th className="px-6 py-0">Student Name</th>
                <th className="px-6 py-0">Grade/Batch</th>
                <th className="px-6 py-0">Avg Score</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "STU-001", name: "Alex Johnson", grade: "Grade 10 - A", score: "88%" },
                { id: "STU-002", name: "Maria Garcia", grade: "Grade 10 - B", score: "92%" },
                { id: "STU-003", name: "James Smith", grade: "Grade 9 - A", score: "75%" },
                { id: "STU-004", name: "Linda Lee", grade: "Grade 11 - Sci", score: "95%" },
              ].map((student, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-medium text-gray-900">{student.id}</td>
                  <td className="px-6 py-0 text-sm font-medium text-[#1D6A4A] cursor-pointer hover:underline">{student.name}</td>
                  <td className="px-6 py-0 text-sm text-gray-600">{student.grade}</td>
                  <td className="px-6 py-0 text-sm font-bold text-gray-700">{student.score}</td>
                  <td className="px-6 py-0 text-right">
                    <button className="text-gray-400 hover:text-[#1D6A4A] transition-colors">
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
  }
];

pages.forEach(p => writePage(p.path, p.content));
console.log('All detailed pages generated.');
