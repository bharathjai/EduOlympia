"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Users, FileText, Activity, Sparkles, TrendingUp, HelpCircle, CheckCircle, Clock, AlertCircle, ChevronRight, Calendar as CalendarIcon, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: "Schools Active", value: "...", icon: Building2, trend: "+12%", href: "/dashboard/super-admin/schools" },
    { title: "Students Enrolled", value: "...", icon: Users, trend: "+18%", href: "/dashboard/super-admin/trainers" }, // using trainers route for demo if students route is not SA
    { title: "Exams Conducted", value: "...", icon: FileText, trend: "+5%", href: "/dashboard/super-admin/exam-approval" },
    { title: "Content Published", value: "...", icon: Upload, trend: "+8%", href: "/dashboard/super-admin/content-approval" },
    { title: "Trainer Doubts", value: "...", icon: HelpCircle, trend: "-2%", href: "/dashboard/super-admin/trainers" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch Schools Count
      const { count: schoolCount } = await supabase.from('schools').select('*', { count: 'exact', head: true });
      
      // Fetch Students Count
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      
      // Fetch Exams Count
      const { count: examCount } = await supabase.from('exams').select('*', { count: 'exact', head: true });
      
      // Fetch Content Count (mocking table if not exists)
      const { count: contentCount, error: contentError } = await supabase.from('content_items').select('*', { count: 'exact', head: true });
      const safeContentCount = contentError ? 342 : contentCount;
      
      setStats([
        { title: "Schools Active", value: (schoolCount || 142).toString(), icon: Building2, trend: "+12%", href: "/dashboard/super-admin/schools" },
        { title: "Students Enrolled", value: (studentCount || 24500).toString(), icon: Users, trend: "+18%", href: "/dashboard/super-admin/trainers" },
        { title: "Exams Conducted", value: (examCount || 856).toString(), icon: FileText, trend: "+5%", href: "/dashboard/super-admin/exam-approval" },
        { title: "Content Published", value: (safeContentCount || 342).toString(), icon: Upload, trend: "+8%", href: "/dashboard/super-admin/content-approval" },
        { title: "Open Doubts", value: "24", icon: HelpCircle, trend: "-2%", href: "/dashboard/super-admin/trainers" },
      ]);
    };

    fetchStats();

    const schoolsSub = supabase.channel('super-admin-schools')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schools' }, () => { fetchStats(); })
      .subscribe();

    const studentsSub = supabase.channel('super-admin-students')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => { fetchStats(); })
      .subscribe();

    const examsSub = supabase.channel('super-admin-exams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => { fetchStats(); })
      .subscribe();

    return () => {
      supabase.removeChannel(schoolsSub);
      supabase.removeChannel(studentsSub);
      supabase.removeChannel(examsSub);
    };
  }, []);
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of EduOlympia operations.</p>
        </div>
      </div>

      <div 
        onClick={() => router.push('/dashboard/super-admin/analytics')}
        className="mb-8 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-purple-100 transition-colors group"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0 shadow-sm border border-purple-200/50">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-purple-900 mb-1">AI Insight Generated</h3>
            <p className="text-sm text-purple-700">3 schools have below 50% student participation. View details.</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => router.push(stat.href)}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer hover:border-[#B45309] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-[#B45309] group-hover:bg-[#B45309] group-hover:text-white transition-colors">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{stat.trend}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Pending Actions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">12 content items awaiting approval</p>
                  <p className="text-xs text-gray-500">Uploaded by 4 different trainers</p>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/super-admin/content-approval')} className="px-3 py-1.5 text-xs font-semibold bg-[#B45309] text-white rounded-lg hover:bg-amber-700 transition-colors">Review</button>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">5 exam papers awaiting review</p>
                  <p className="text-xs text-gray-500">National Olympiad Tier</p>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/super-admin/exam-approval')} className="px-3 py-1.5 text-xs font-semibold bg-[#B45309] text-white rounded-lg hover:bg-amber-700 transition-colors">Schedule</button>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Building2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">3 schools with overdue subscription</p>
                  <p className="text-xs text-gray-500">Grace period ends in 2 days</p>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/super-admin/billing')} className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Contact</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Exams (Mini Calendar)</h2>
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-900">November 2023</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasExam = [12, 15, 22].includes(day);
                return (
                  <div 
                    key={i} 
                    onClick={() => hasExam && router.push('/dashboard/super-admin/exam-approval')}
                    className={`p-1.5 rounded-lg cursor-pointer ${hasExam ? 'bg-amber-100 text-amber-900 font-bold hover:bg-amber-200' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {day}
                    {hasExam && <div className="w-1 h-1 rounded-full bg-amber-600 mx-auto mt-0.5"></div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Subscription Revenue (6 Months)</h2>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+14% MRR</span>
          </div>
          <div className="h-64 flex items-end gap-4">
            {[45, 60, 50, 75, 65, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-amber-200 rounded-t-md relative group hover:bg-[#B45309] transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  ₹{h * 10}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
            <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity Feed</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {[
              { text: "School XYZ enrolled 45 students", time: "5 mins ago", icon: Users, href: "/dashboard/super-admin/schools" },
              { text: "Trainer uploaded Chapter 4 notes", time: "1 hour ago", icon: FileText, href: "/dashboard/super-admin/content-approval" },
              { text: "Exam results published for Batch A", time: "3 hours ago", icon: CheckCircle, href: "/dashboard/super-admin/results" },
              { text: "Greenwood High renewed subscription", time: "1 day ago", icon: TrendingUp, href: "/dashboard/super-admin/billing" },
            ].map((activity, i) => (
              <div key={i} onClick={() => router.push(activity.href)} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 text-sm">{activity.text}</div>
                  </div>
                  <div className="text-xs text-slate-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}