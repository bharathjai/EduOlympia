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
    path: 'super-admin/exam-approval/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Calendar, CheckCircle, Eye, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function ExamApproval() {
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Approval & Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">Review trainer-submitted exam papers, approve, schedule, and monitor live exams.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search exam papers..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Status: Pending
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">Exam Title</th>
                <th className="px-6 py-0">Subject</th>
                <th className="px-6 py-0">Author</th>
                <th className="px-6 py-0">Status</th>
                <th className="px-6 py-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { title: "Grade 10 Final Olympiad", subject: "Math", author: "Dr. Clark", status: "Pending" },
                { title: "Regional Science Qualifier", subject: "Physics", author: "Sarah W.", status: "Approved" },
                { title: "State Level Chemistry", subject: "Chemistry", author: "Mike C.", status: "Pending" },
              ].map((exam, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-medium text-gray-900">{exam.title}</td>
                  <td className="px-6 py-0 text-sm text-gray-600">{exam.subject}</td>
                  <td className="px-6 py-0 text-sm text-gray-500">{exam.author}</td>
                  <td className="px-6 py-0">
                    <span className={\`px-2.5 py-1 text-xs font-medium rounded-full \${exam.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-0 text-right flex items-center justify-end gap-2 h-[48px]">
                    <button className="text-gray-400 hover:text-[#B45309] transition-colors p-1" title="Preview Questions"><Eye className="w-4 h-4" /></button>
                    {exam.status === 'Pending' && (
                      <button onClick={() => setShowModal(true)} className="text-gray-400 hover:text-[#B45309] transition-colors p-1" title="Approve & Schedule"><Calendar className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Approve & Schedule Exam</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
                <div className="flex gap-2">
                  <input type="time" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                  <span className="self-center">to</span>
                  <input type="time" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}`
  },
  {
    path: 'super-admin/results/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Search, Award, Download, CheckCircle } from "lucide-react";

export default function ResultsLeaderboard() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results & Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1">Publish exam results and manage cross-school leaderboards.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700">
          <CheckCircle className="w-4 h-4" /> Publish Global Results
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search student or school..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
          <select className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none">
            <option>Math Olympiad 2023</option>
            <option>Science Qualifier</option>
          </select>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider h-[48px]">
                <th className="px-6 py-0">Global Rank</th>
                <th className="px-6 py-0">Student Name</th>
                <th className="px-6 py-0">School</th>
                <th className="px-6 py-0">Score</th>
                <th className="px-6 py-0 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { rank: 1, name: "Alex Johnson", school: "Greenwood High", score: "99.5%" },
                { rank: 2, name: "Maria Garcia", school: "Oakridge Int.", score: "98.2%" },
                { rank: 3, name: "James Smith", school: "Delhi Public", score: "97.8%" },
                { rank: 4, name: "Linda Lee", school: "Greenwood High", score: "97.1%" },
                { rank: 5, name: "Robert Fox", school: "Silver Oaks", score: "96.5%" },
              ].map((row, i) => (
                <tr key={i} className="h-[48px] even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-0 text-sm font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      {row.rank <= 3 && <Trophy className={\`w-4 h-4 \${row.rank === 1 ? 'text-yellow-500' : row.rank === 2 ? 'text-gray-400' : 'text-amber-600'}\`} />}
                      #{row.rank}
                    </div>
                  </td>
                  <td className="px-6 py-0 text-sm font-medium text-[#B45309]">{row.name}</td>
                  <td className="px-6 py-0 text-sm text-gray-600">{row.school}</td>
                  <td className="px-6 py-0 text-sm font-bold text-green-600">{row.score}</td>
                  <td className="px-6 py-0 text-right">
                    <button className="text-gray-400 hover:text-[#B45309] transition-colors inline-flex items-center gap-1 text-xs font-medium">
                      <Download className="w-3 h-3" /> Gen
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
    path: 'super-admin/awards/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Award, Plus, Download, Star, Users } from "lucide-react";

export default function AwardFunctionManager() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Award Function Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage award events, assign medals/ranks, and download ceremony materials.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700">
          <Plus className="w-4 h-4" /> Create Award Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: "National Olympiad Awards 2023", date: "Dec 15, 2023", status: "Upcoming", medals: 150 },
          { title: "Regional Science Fair Honors", date: "Nov 02, 2023", status: "Completed", medals: 45 },
          { title: "Top Schools Recognition Q3", date: "Oct 20, 2023", status: "Completed", medals: 10 },
        ].map((event, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#B45309]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">Scheduled: {event.date}</p>
                </div>
              </div>
              <span className={\`text-xs font-bold px-2.5 py-1 rounded-full \${event.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}\`}>
                {event.status}
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Star className="w-4 h-4 text-yellow-500" /> {event.medals} Medals Assigned
              </div>
            </div>
            <div className="flex border-t border-gray-100 mt-2 pt-4 gap-3">
              <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                Manage Awardees
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-[#B45309] py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors flex justify-center items-center gap-2">
                <Download className="w-4 h-4" /> Ceremony Deck
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'super-admin/analytics/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Sparkles, TrendingUp, BarChart2, PieChart } from "lucide-react";

export default function PlatformAnalytics() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered platform-wide insights across all schools, content, and exam performance.</p>
        </div>
      </div>

      <div className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-6 flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-xl text-purple-600 shrink-0 shadow-sm border border-purple-200/50">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-purple-900 mb-2">Deep AI Insights</h3>
          <ul className="space-y-2 text-sm text-purple-800 list-disc list-inside">
            <li><strong>Trend Alert:</strong> Mathematics participation has surged by 24% across Tier 2 cities this quarter.</li>
            <li><strong>Content Gap:</strong> Trainers are uploading fewer advanced physics materials compared to current student demand.</li>
            <li><strong>Performance:</strong> Average platform score improved by 3.2% after the recent UI overhaul for practice tests.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-[#B45309]" /> Student Growth</h3>
          <div className="h-64 flex items-end gap-2">
            {[30, 40, 45, 50, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-amber-100 hover:bg-[#B45309] rounded-t-sm transition-colors" style={{ height: \`\${h}%\` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-[#B45309]" /> Subject Popularity</h3>
          <div className="h-64 flex items-center justify-center">
             <div className="w-48 h-48 rounded-full border-[16px] border-amber-600 border-r-amber-400 border-t-amber-200 border-l-amber-100 shadow-inner flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">Math</span>
                <span className="text-sm text-gray-500">45%</span>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  },
  {
    path: 'super-admin/settings/page.tsx',
    content: `"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Book, Bell, Palette, Globe } from "lucide-react";

export default function PlatformSettings() {
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure subjects, exam rules, branding, notification templates, and global platform settings.</p>
        </div>
        <button className="px-6 py-2 bg-[#B45309] text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-2">
          {[
            { id: 'general', label: 'General Configuration', icon: Globe },
            { id: 'subjects', label: 'Subjects & Curriculum', icon: Book },
            { id: 'branding', label: 'White-labeling', icon: Palette },
            { id: 'notifications', label: 'Email Templates', icon: Bell },
            { id: 'system', label: 'System Preferences', icon: Settings },
          ].map(tab => (
            <button key={tab.id} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors \${tab.id === 'general' ? 'bg-amber-50 text-[#B45309]' : 'text-gray-600 hover:bg-gray-50'}\`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">General Configuration</h2>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input type="text" defaultValue="EduOlympia Global" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input type="email" defaultValue="support@eduolympia.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600" />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#B45309] rounded border-gray-300 focus:ring-[#B45309]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Temporarily block access for all schools and students.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}`
  }
];

pages.forEach(p => writePage(p.path, p.content));
console.log('Batch 3 detailed pages generated.');
