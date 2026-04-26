"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Users, Activity, Trophy, Calendar, Sparkles, TrendingUp, TrendingDown, Bell, BellRing, ChevronRight, FileText, Download, ShieldAlert, Award, X, Key, UserPlus } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

function SchoolDashboardContent() {
  const searchParams = useSearchParams();
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [toastType, setToastType] = useState<"success"|"info">("success");
  
  const [isStudentsEmpty, setIsStudentsEmpty] = useState(false); // toggle for empty state
  const [isExamsEmpty, setIsExamsEmpty] = useState(false); // toggle for empty state

  useEffect(() => {
    if (searchParams?.get("first_login") === "true") {
      setShowFirstLoginModal(true);
    }
  }, [searchParams]);

  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match.");
      return;
    }
    setShowFirstLoginModal(false);
    triggerToast("Password successfully changed. Welcome aboard!", "success");
  };

  const triggerToast = (msg: string, type: "success"|"info" = "success") => {
    setToastType(type);
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleRemindStudents = (examName: string) => {
    triggerToast(`Reminder sent to inactive students for ${examName}.`, "info");
  };

  // Mock Data
  const participationRate: number = 68;
  const participationColor = participationRate > 75 ? "bg-green-500" : participationRate > 50 ? "bg-amber-500" : "bg-red-500";
  const participationText = participationRate > 75 ? "text-green-700" : participationRate > 50 ? "text-amber-700" : "text-red-700";
  
  const [stats, setStats] = useState([
    { title: "Total Enrolled", value: "1,250", icon: Users, href: "/dashboard/school-admin/students" },
    { title: "Active (7 Days)", value: "850", icon: Activity, href: "/dashboard/school-admin/reports" },
    { title: "Upcoming Exams", value: "3", icon: Calendar, href: "/dashboard/school-admin/exams" },
    { title: "School Rank", value: "#14", icon: Trophy, trend: "up", trendValue: "2 positions", href: "/dashboard/school-admin/reports" },
  ]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: examCount } = await supabase.from('exams').select('*', { count: 'exact', head: true });
      
      if (isMounted) {
        setStats([
          { title: "Total Enrolled", value: (studentCount || 0).toString(), icon: Users, href: "/dashboard/school-admin/students" },
          { title: "Active (7 Days)", value: "850", icon: Activity, href: "/dashboard/school-admin/reports" },
          { title: "Upcoming Exams", value: (examCount || 0).toString(), icon: Calendar, href: "/dashboard/school-admin/exams" },
          { title: "School Rank", value: "#14", icon: Trophy, trend: "up", trendValue: "2 positions", href: "/dashboard/school-admin/reports" },
        ]);
      }
    };

    fetchStats();

    const studentsSub = supabase.channel('school-students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => { fetchStats(); })
      .subscribe();

    const examsSub = supabase.channel('school-exams-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => { fetchStats(); })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(studentsSub);
      supabase.removeChannel(examsSub);
    };
  }, []);

  const upcomingExams = [
    { name: "Term 1 Mathematics Olympiad", subject: "Mathematics", date: "Nov 15, 2023", time: "10:00 AM", registered: 450, total: 500 },
    { name: "Regional Physics Qualifier", subject: "Physics", date: "Nov 22, 2023", time: "02:00 PM", registered: 120, total: 300 },
  ];

  const inactiveStudentsCount = 42;

  const announcements = [
    { title: "Winter Schedule Update", date: "Today", tag: "System" },
    { title: "New Study Materials Published", date: "Yesterday", tag: "Content" }
  ];

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 ${toastType === 'success' ? 'bg-[#1D6A4A] text-white' : 'bg-blue-600 text-white'}`}>
          {toastType === 'success' ? <Trophy className="w-5 h-5 text-green-300" /> : <BellRing className="w-5 h-5 text-blue-200" />}
          {showToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your students' performance, participation, and upcoming events.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Debug toggles for empty states */}
          <button onClick={() => setIsStudentsEmpty(!isStudentsEmpty)} className="text-xs text-gray-400 underline hidden sm:block">Toggle Empty Enroll</button>
          <button onClick={() => setIsExamsEmpty(!isExamsEmpty)} className="text-xs text-gray-400 underline hidden sm:block">Toggle Empty Exams</button>
          
          <Link href="/dashboard/school-admin/students" className="flex items-center gap-2 px-5 py-2.5 bg-[#1D6A4A] text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors shadow-md shadow-green-700/20">
            <UserPlus className="w-4 h-4" /> Enroll Student
          </Link>
        </div>
      </div>

      {isStudentsEmpty ? (
        // FULL EMPTY STATE
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-green-50 text-[#1D6A4A] rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your Portal!</h2>
          <p className="text-gray-500 max-w-md mb-8">Enroll your students to get started. Once enrolled, you can track their participation, schedule exams, and view performance analytics.</p>
          <Link href="/dashboard/school-admin/students" className="bg-[#1D6A4A] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 shadow-md transition-colors flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Start Enrolling Students
          </Link>
        </div>
      ) : (
        <>
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Link href={stat.href} key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#1D6A4A]/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-[#1D6A4A] group-hover:bg-[#1D6A4A] group-hover:text-white transition-colors">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.trendValue}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{stat.title}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Health Bar & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Participation Health</h2>
                  <p className="text-sm text-gray-500 mt-1">Platform engagement over the last 7 days</p>
                </div>
                <div className={`text-2xl font-black ${participationText}`}>{participationRate}%</div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
                <div className={`${participationColor} h-full rounded-full transition-all duration-1000`} style={{ width: `${participationRate}%` }}></div>
              </div>
              
              <p className={`text-sm font-medium ${participationText}`}>
                {participationRate === 100 ? "Great! All your students are actively using the platform." : `${participationRate}% of your students have accessed content this week.`}
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900">Inactive Students Alert</h3>
                  <p className="text-sm text-red-700 mt-1"><strong>{inactiveStudentsCount} students</strong> haven't logged in recently (7+ days).</p>
                </div>
              </div>
              <Link href="/dashboard/school-admin/students?filter=inactive" className="w-full bg-white border border-red-200 text-red-700 font-bold py-2.5 rounded-xl text-center text-sm hover:bg-red-50 transition-colors">
                View Student List
              </Link>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Exams Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Upcoming Scheduled Exams</h2>
                </div>
                <div className="p-0">
                  {isExamsEmpty ? (
                    <div className="p-8 text-center">
                      <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-900 font-bold">No exams scheduled yet.</p>
                      <p className="text-sm text-gray-500 mt-1">The platform trainer will schedule exams for your students.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {upcomingExams.map((exam, i) => (
                        <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center shrink-0 border border-blue-100">
                              <span className="text-[10px] font-bold uppercase">{exam.date.split(' ')[0]}</span>
                              <span className="text-lg font-black leading-none">{exam.date.split(' ')[1].replace(',', '')}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{exam.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{exam.subject} • {exam.time}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-[#1D6A4A] h-full" style={{ width: `${(exam.registered/exam.total)*100}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">{exam.registered} / {exam.total} Registered</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemindStudents(exam.name)}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm"
                          >
                            <Bell className="w-4 h-4" /> Remind Students
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Results Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Latest Exam Results</h2>
                  <Link href="/dashboard/school-admin/reports" className="text-sm font-bold text-[#1D6A4A] hover:underline flex items-center">
                    View Full Results <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h3 className="font-bold text-gray-900">Regional Mathematics Qualifier</h3>
                      <p className="text-xs text-gray-500">Completed: Oct 28, 2023</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">School Avg</p>
                      <p className="text-2xl font-black text-[#1D6A4A]">84.2%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Global Rank</p>
                      <p className="text-2xl font-black text-gray-900">#4</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pass Rate</p>
                      <p className="text-2xl font-black text-gray-900">92%</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">Top Performing Student</p>
                      <p className="font-bold text-amber-900">Sarah Jenkins (Grade 10)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-amber-700">98%</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard/school-admin/students" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent rounded-xl transition-colors text-center group">
                    <UserPlus className="w-6 h-6 text-gray-400 group-hover:text-[#1D6A4A] mb-2 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#1D6A4A]">Enroll Students</span>
                  </Link>
                  <Link href="/dashboard/school-admin/reports" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent rounded-xl transition-colors text-center group">
                    <FileText className="w-6 h-6 text-gray-400 group-hover:text-[#1D6A4A] mb-2 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#1D6A4A]">View Results</span>
                  </Link>
                  <Link href="/dashboard/school-admin/reports" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent rounded-xl transition-colors text-center group">
                    <Download className="w-6 h-6 text-gray-400 group-hover:text-[#1D6A4A] mb-2 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#1D6A4A]">Analytics PDF</span>
                  </Link>
                  <Link href="/dashboard/school-admin/certificates" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent rounded-xl transition-colors text-center group">
                    <Award className="w-6 h-6 text-gray-400 group-hover:text-[#1D6A4A] mb-2 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#1D6A4A]">Certificates</span>
                  </Link>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-[#1D6A4A]" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Platform Notices</h2>
                </div>
                <div className="space-y-4">
                  {announcements.map((ann, i) => (
                    <div key={i} className="border-l-2 border-[#1D6A4A] pl-3 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-[#1D6A4A] bg-green-50 px-1.5 py-0.5 rounded">{ann.tag}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{ann.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{ann.title}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}

      {/* First Login Password Change Modal */}
      {showFirstLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#1D6A4A] p-6 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">Set Your New Password</h2>
              <p className="text-sm text-green-100 mt-1">Please secure your account before continuing.</p>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current (Temp) Password</label>
                <input 
                  type="password" required
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" required minLength={8}
                  value={passwordForm.new}
                  onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" required minLength={8}
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] outline-none text-sm"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#1D6A4A] hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors mt-6"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default function SchoolDashboard() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <SchoolDashboardContent />
    </Suspense>
  );
}