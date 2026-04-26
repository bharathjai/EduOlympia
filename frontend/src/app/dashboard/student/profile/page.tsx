"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Lock, LogOut, BookOpen, CheckCircle2, 
  BarChart2, Calendar, FileBadge, ChevronLeft, ChevronRight, X
} from "lucide-react";

// --- MOCK DATA ---
const mockProfile = {
  name: "Arjun Sharma",
  initials: "AS",
  school: "Delhi Public School",
  classGrade: "Class 8",
  studentId: "STU-2026-9842",
  subjects: ["Mathematics", "Science", "Logical Reasoning"],
  stats: {
    totalPractice: 24,
    totalExams: 3,
    avgScore: 76
  },
  examHistory: [
    { id: 1, name: "Mid-Term Mathematics Olympiad", date: "24 Apr 2026", score: 85, rank: 1, hasCertificate: true },
    { id: 2, name: "Science Mock Test 1", date: "10 Mar 2026", score: 72, rank: 12, hasCertificate: false },
    { id: 3, name: "Logical Reasoning Qualifier", date: "15 Jan 2026", score: 91, rank: 3, hasCertificate: true },
  ],
  // YYYY-M-D mapping for attendance
  attendance: {
    "2026-3-5": "attended",
    "2026-3-12": "attended",
    "2026-3-19": "missed",
    "2026-3-26": "attended",
    "2026-4-2": "attended",
    "2026-4-9": "attended",
    "2026-4-16": "missed",
    "2026-4-23": "attended",
  }
};

type Tab = 'overview' | 'exams' | 'attendance';

export default function MyProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 (Month is 0-indexed)

  const handleLogout = () => {
    // In real app, clear tokens here
    router.push('/login');
  };

  const handleDownloadCert = (examName: string) => {
    alert(`Downloading certificate for ${examName}...`);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password changed successfully!");
    setShowPasswordModal(false);
  };

  // --- Calendar Helpers ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} className="p-4 border border-transparent"></div>);
    
    const days = Array.from({ length: daysInMonth }).map((_, i) => {
      const dayNum = i + 1;
      const dateKey = `${year}-${month + 1}-${dayNum}`;
      const status = (mockProfile.attendance as Record<string, string>)[dateKey];
      
      let bgClass = "bg-white border-gray-100 hover:border-gray-200 text-gray-700";
      let dot = null;
      
      if (status === 'attended') {
        bgClass = "bg-emerald-50 border-emerald-200 text-emerald-900 font-bold";
        dot = <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mt-1"></div>;
      } else if (status === 'missed') {
        bgClass = "bg-gray-100 border-gray-300 text-gray-500 opacity-60";
        dot = <div className="w-2 h-2 rounded-full bg-gray-400 mx-auto mt-1"></div>;
      }

      return (
        <div key={dayNum} className={`aspect-square p-2 border rounded-xl flex flex-col items-center justify-center transition-colors ${bgClass}`}>
          <span className="text-sm">{dayNum}</span>
          {dot}
        </div>
      );
    });

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <h4 className="text-lg font-bold text-gray-900">{monthNames[month]} {year}</h4>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><ChevronRight className="w-5 h-5"/></button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {dayNames.map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks}
          {days}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Attended</div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600"><div className="w-3 h-3 rounded-full bg-gray-400"></div> Missed</div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600"><div className="w-3 h-3 rounded-full border border-gray-200"></div> No Class</div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout role="student" userName={mockProfile.name} userDescription={`${mockProfile.classGrade} • ${mockProfile.school}`}>
      <div className="max-w-6xl mx-auto pb-24 font-sans animate-in fade-in duration-500">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Profile Card */}
          <div className="lg:w-1/3 shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center sticky top-24">
               
               <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-4xl font-black mb-6 shadow-inner border-4 border-white ring-1 ring-gray-100">
                 {mockProfile.initials}
               </div>
               
               <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{mockProfile.name}</h2>
               <p className="text-gray-500 font-medium mb-6">{mockProfile.school} • {mockProfile.classGrade}</p>
               
               <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8 text-left">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student ID</p>
                 <p className="font-mono font-bold text-gray-900">{mockProfile.studentId}</p>
               </div>

               <div className="w-full text-left mb-8">
                 <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                   <BookOpen className="w-4 h-4 text-blue-600" /> Enrolled Subjects
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {mockProfile.subjects.map((sub, idx) => (
                     <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-100">
                       {sub}
                     </span>
                   ))}
                 </div>
               </div>

               <div className="w-full flex flex-col gap-3 mt-auto">
                 <button 
                   onClick={() => setShowPasswordModal(true)}
                   className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                 >
                   <Lock className="w-4 h-4" /> Change Password
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                 >
                   <LogOut className="w-4 h-4" /> Log Out
                 </button>
               </div>

            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-2/3 flex flex-col">
            
            {/* Tabs */}
            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 min-w-[120px] py-3 px-4 font-bold text-sm rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('exams')}
                className={`flex-1 min-w-[120px] py-3 px-4 font-bold text-sm rounded-xl transition-colors ${activeTab === 'exams' ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                Exam History
              </button>
              <button 
                onClick={() => setActiveTab('attendance')}
                className={`flex-1 min-w-[120px] py-3 px-4 font-bold text-sm rounded-xl transition-colors ${activeTab === 'attendance' ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                Attendance
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Practice Tests</p>
                  <p className="text-4xl font-black text-gray-900">{mockProfile.stats.totalPractice}</p>
                </div>
                
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                    <FileBadge className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Exams Taken</p>
                  <p className="text-4xl font-black text-gray-900">{mockProfile.stats.totalExams}</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Score</p>
                  <p className="text-4xl font-black text-gray-900">{mockProfile.stats.avgScore}%</p>
                </div>
              </div>
            )}

            {/* EXAM HISTORY TAB */}
            {activeTab === 'exams' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Exam Name</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Score</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                        <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockProfile.examHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                            You have not taken any exams yet.
                          </td>
                        </tr>
                      ) : (
                        mockProfile.examHistory.map((exam) => (
                          <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-5 font-bold text-gray-900">{exam.name}</td>
                            <td className="p-5 text-sm font-medium text-gray-500">{exam.date}</td>
                            <td className="p-5 font-black text-gray-900">{exam.score}%</td>
                            <td className="p-5 font-bold text-blue-600">#{exam.rank}</td>
                            <td className="p-5">
                              {exam.hasCertificate ? (
                                <button 
                                  onClick={() => handleDownloadCert(exam.name)}
                                  className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <FileBadge className="w-4 h-4" /> Download
                                </button>
                              ) : (
                                <span className="text-sm font-medium text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Live Class Attendance</h3>
                    <p className="text-sm text-gray-500">Track your attendance history for all enrolled subjects.</p>
                  </div>
                </div>
                
                {renderCalendar()}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 relative">
             <button 
               onClick={() => setShowPasswordModal(false)}
               className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
             
             <div className="p-8">
               <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-blue-50 text-blue-600">
                 <Lock className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2">Change Password</h3>
               <p className="text-gray-500 mb-8 font-medium">Ensure your account stays secure by using a strong password.</p>
               
               <form onSubmit={handleChangePassword} className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Password</label>
                   <input type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">New Password</label>
                   <input type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium" />
                 </div>
                 <div className="mb-8">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Confirm New Password</label>
                   <input type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium" />
                 </div>

                 <button 
                   type="submit"
                   className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md"
                 >
                   Update Password
                 </button>
               </form>
             </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
