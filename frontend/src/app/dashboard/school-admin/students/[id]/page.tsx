"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, KeyRound, Ban, CheckCircle2, ChevronLeft, ChevronRight, FileDown, AlertTriangle, BookOpen, PenTool, TrendingUp, Download, Info } from "lucide-react";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentProfileView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showToast, setShowToast] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [attendanceMonth, setAttendanceMonth] = useState(new Date(2023, 10, 1)); // Nov 2023 mock

  // Mock Student Data
  const student = {
    id: resolvedParams.id,
    name: resolvedParams.id === 'STU-003' ? "Michael Brown" : "Aisha Ramachandran",
    initials: resolvedParams.id === 'STU-003' ? "MB" : "AR",
    grade: "Grade 10",
    status: resolvedParams.id === 'STU-003' ? "Inactive" : "Active",
    lastLogin: resolvedParams.id === 'STU-003' ? "Never logged in" : "Today, 09:42 AM",
    school: "Springfield High",
    enrolledDate: "Aug 15, 2023",
    metrics: {
      practiceTaken: 12,
      examsTaken: 4,
      avgScore: "84%"
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleDeactivate = () => {
    setShowDeactivateModal(false);
    triggerToast("Student account deactivated successfully.");
    setTimeout(() => router.push('/dashboard/school-admin/students'), 1500);
  };

  // Mock Data arrays
  const examHistory = [
    { name: "Term 1 Mathematics Olympiad", date: "Nov 15, 2023", score: "92%", rankSchool: 2, rankGlobal: 14, status: "Completed", hasCert: true },
    { name: "Regional Physics Qualifier", date: "Oct 22, 2023", score: "88%", rankSchool: 5, rankGlobal: 42, status: "Completed", hasCert: true },
    { name: "Chemistry Mid-term Assessment", date: "Sep 10, 2023", score: "-", rankSchool: "-", rankGlobal: "-", status: "Absent", hasCert: false },
    { name: "Biology Practice Challenge", date: "Aug 05, 2023", score: "0%", rankSchool: "-", rankGlobal: "-", status: "Disqualified", hasCert: false },
  ];

  const practiceHistory = [
    { name: "Math: Algebra & Functions", date: "Nov 12, 2023", score: "95%", topics: "Algebra, Linear Equations", time: "45 mins" },
    { name: "Physics: Kinematics", date: "Oct 18, 2023", score: "82%", topics: "Motion, Velocity", time: "30 mins" },
    { name: "Chemistry: Atomic Structure", date: "Sep 05, 2023", score: "88%", topics: "Atoms, Periodic Table", time: "40 mins" },
  ];

  // Generate a mock 35-day calendar (5 weeks) for Attendance heatmap
  const getAttendanceColor = (day: number) => {
    if (day % 7 === 0 || day % 7 === 6) return "bg-gray-50 border border-gray-100"; // weekends
    if (day === 12 || day === 18) return "bg-red-50 text-red-600 border border-red-200 font-bold"; // Missed
    if (day > 25) return "bg-white border border-gray-200 text-gray-400"; // Future/No class
    return "bg-green-50 text-green-700 border border-green-200 font-bold"; // Attended
  };

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      {/* Navigation & Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/school-admin/students" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1D6A4A] font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>
        <div className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Link href="/dashboard/school-admin/students" className="hover:text-gray-900">Students</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">{student.name}</span>
        </div>
      </div>

      {/* Inactive Banner */}
      {student.lastLogin === "Never logged in" && (
        <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            This student has not accessed the platform. Consider resending their login credentials to ensure they can begin participating.
          </p>
        </div>
      )}

      {/* Profile Card (Read-Only State) */}
      <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 rounded-full flex items-center justify-center text-2xl font-black shadow-inner border border-gray-300">
            {student.initials}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {student.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{student.id}</span>
              <span>•</span>
              <span>{student.grade}</span>
              <span>•</span>
              <span>{student.school}</span>
            </p>
            <p className="text-xs text-gray-400 font-medium">Enrolled: {student.enrolledDate} <span className="mx-2">|</span> Last Login: {student.lastLogin}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => triggerToast(`Password reset link sent to admin for ${student.name}.`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold transition-colors shadow-sm"
          >
            <KeyRound className="w-4 h-4" /> Reset Password
          </button>
          <button 
            onClick={() => setShowDeactivateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 text-sm font-bold transition-colors shadow-sm"
          >
            <Ban className="w-4 h-4" /> Deactivate
          </button>
        </div>
      </div>

      {/* Tabs (Read-Only wrapper) */}
      <div className="bg-gray-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "exams", label: "Exam History" },
            { id: "practice", label: "Practice History" },
            { id: "attendance", label: "Attendance" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? "border-[#1D6A4A] text-[#1D6A4A] bg-green-50/50" 
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          </div>
          <div className="px-4 hidden sm:block">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
              <Info className="w-3 h-3"/> Read-Only View
            </span>
          </div>
        </div>

        <div className="p-6">
          
          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Practice Tests</p>
                    <p className="text-2xl font-black text-gray-900">{student.metrics.practiceTaken}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-white text-purple-600 rounded-lg shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Exams Taken</p>
                    <p className="text-2xl font-black text-gray-900">{student.metrics.examsTaken}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-[#1D6A4A] text-white rounded-lg shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Average Score</p>
                    <p className="text-2xl font-black text-[#1D6A4A]">{student.metrics.avgScore}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Subject-wise Average Score</h3>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", score: 92 },
                    { subject: "Physics", score: 88 },
                    { subject: "Chemistry", score: 76 },
                    { subject: "Biology", score: 80 }
                  ].map((sub) => (
                    <div key={sub.subject} className="flex items-center gap-4">
                      <span className="w-24 text-sm font-semibold text-gray-700">{sub.subject}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#1D6A4A] h-full rounded-full" style={{ width: `${sub.score}%` }}></div>
                      </div>
                      <span className="w-10 text-right text-sm font-bold text-gray-900">{sub.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Exam History */}
          {activeTab === "exams" && (
            <div className="animate-in fade-in duration-300">
              {examHistory.length > 0 ? (
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Exam Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-center">Rank (School)</th>
                        <th className="px-6 py-4 text-center">Rank (Global)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {examHistory.map((exam, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900">{exam.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{exam.date}</td>
                          <td className="px-6 py-4 text-center font-black text-[#1D6A4A]">{exam.score}</td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">{exam.rankSchool}</td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">{exam.rankGlobal}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider 
                              ${exam.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' : 
                                exam.status === 'Absent' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 
                                'bg-red-50 text-red-700 border border-red-200'}`}>
                              {exam.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {exam.hasCert ? (
                              <button className="p-2 text-[#1D6A4A] hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Download Certificate">
                                <Download className="w-5 h-5" />
                              </button>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                  <p className="text-gray-500 font-medium">This student has not taken any exams yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Practice History */}
          {activeTab === "practice" && (
            <div className="animate-in fade-in duration-300">
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Practice Paper Name</th>
                      <th className="px-6 py-4">Date Taken</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4">Topics Covered</th>
                      <th className="px-6 py-4 text-right">Time Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {practiceHistory.map((prac, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{prac.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{prac.date}</td>
                        <td className="px-6 py-4 text-center font-black text-[#1D6A4A]">{prac.score}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{prac.topics}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-500">{prac.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Attendance */}
          {activeTab === "attendance" && (
            <div className="animate-in fade-in duration-300">
              <div className="max-w-3xl mx-auto border border-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><ChevronLeft className="w-5 h-5"/></button>
                    <h3 className="font-bold text-gray-900 text-lg">{attendanceMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><ChevronRight className="w-5 h-5"/></button>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                    <span className="text-sm font-bold text-green-800">Attendance Rate: 92%</span>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{day}</div>
                  ))}
                  
                  {/* Padding days */}
                  <div className="aspect-square"></div>
                  <div className="aspect-square"></div>

                  {/* 30 days of Nov */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${getAttendanceColor(i+1)}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-8 flex items-center gap-6 justify-center text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div> Attended Live Class</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div> Missed Class</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-gray-200 rounded"></div> No Schedule</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Deactivate Student?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to deactivate <span className="font-bold text-gray-900">{student.name}</span>? They will no longer be able to log in to the platform.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeactivate}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 transition-colors flex justify-center items-center gap-2"
                >
                  <Ban className="w-4 h-4"/> Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
