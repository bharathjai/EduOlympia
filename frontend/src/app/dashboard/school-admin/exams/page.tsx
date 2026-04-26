"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Bell, Trophy, CheckCircle2, ChevronLeft, Download, FileDown, AlertCircle, Clock, Eye, BarChart, Medal, Users, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExamsResultsView() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "completed">("upcoming");
  const [showToast, setShowToast] = useState("");
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  // Live simulation state
  const [liveData, setLiveData] = useState({
    activeStudents: 142,
    completedSubmissions: 38,
    timeLeft: "45:00"
  });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  // Mock Data
  const upcomingExams = [
    { id: "e1", name: "Term 1 Mathematics Olympiad", subject: "Mathematics", date: "Nov 15, 2023", time: "10:00 AM", duration: "120 mins", registered: 450, total: 500 },
    { id: "e2", name: "Regional Physics Qualifier", subject: "Physics", date: "Nov 22, 2023", time: "02:00 PM", duration: "90 mins", registered: 120, total: 300 },
  ];

  const liveExams = [
    { id: "l1", name: "Grade 10 Mock Exam - Biology", subject: "Biology", date: "Today", time: "Started 09:00 AM", duration: "60 mins" },
  ];

  const completedExams = [
    { id: "c1", name: "Chemistry Mid-term Assessment", date: "Oct 10, 2023", status: "Published", avgScore: "84%", schoolRank: 3, totalSchools: 24, topStudent: "Aisha Ramachandran" },
    { id: "c2", name: "English Literature Qualifier", date: "Oct 05, 2023", status: "Pending" },
    { id: "c3", name: "History Placement Test", date: "Sep 28, 2023", status: "Published", absentMode: true } // Mock state where all were absent
  ];

  const examDetailsMock = [
    { id: "STU-001", name: "Aisha Ramachandran", class: "Grade 10", score: "96%", rankSchool: 1, rankOverall: 12, cert: true },
    { id: "STU-002", name: "Michael Brown", class: "Grade 10", score: "88%", rankSchool: 2, rankOverall: 45, cert: true },
    { id: "STU-004", name: "Sarah Williams", class: "Grade 10", score: "72%", rankSchool: 3, rankOverall: 102, cert: false },
  ];

  const topicAccuracyMock = [
    { topic: "Organic Chemistry", score: 88 },
    { topic: "Atomic Structure", score: 94 },
    { topic: "Thermodynamics", score: 62 },
    { topic: "Equilibrium", score: 78 }
  ];

  // Refresh live data simulator
  useEffect(() => {
    if (activeTab === "live" && liveExams.length > 0) {
      const interval = setInterval(() => {
        setLiveData(prev => ({
          activeStudents: Math.max(0, prev.activeStudents + Math.floor(Math.random() * 3) - 1),
          completedSubmissions: prev.completedSubmissions + Math.floor(Math.random() * 2),
          timeLeft: prev.timeLeft // Keeping static for simple mock
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      {/* Detail View Wrapper (If expanded) */}
      {expandedExamId ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => setExpandedExamId(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-[#1D6A4A] font-medium text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Exams
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold shadow-sm transition-colors">
              <FileDown className="w-4 h-4" /> Export Results (CSV)
            </button>
          </div>

          {/* Special State: All Absent */}
          {completedExams.find(e => e.id === expandedExamId)?.absentMode ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border-4 border-red-100">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">None of your students attempted this exam.</h2>
              <p className="text-gray-500 max-w-md mx-auto">Please ensure your students are utilizing the platform. Try using the "Remind All" feature for upcoming scheduled exams.</p>
            </div>
          ) : (
            <>
              {/* School Rank Banner */}
              <div className="bg-gradient-to-r from-[#1D6A4A] to-green-800 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center text-yellow-300">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Your school ranked 3rd out of 24 schools in this exam.</h2>
                      <p className="text-green-100 font-medium flex items-center gap-1.5 mt-1">
                        <ArrowUpRight className="w-4 h-4 text-green-300" /> +2 positions compared to previous regional exam
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-center shrink-0">
                    <p className="text-xs text-green-100 uppercase tracking-wider font-bold mb-0.5">School Avg Score</p>
                    <p className="text-3xl font-black">84%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Topic Breakdown */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><BarChart className="w-5 h-5 text-[#1D6A4A]"/> Topic Accuracy</h3>
                  <div className="space-y-5">
                    {topicAccuracyMock.map((t, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-700">{t.topic}</span>
                          <span className={t.score >= 80 ? 'text-[#1D6A4A]' : t.score < 70 ? 'text-red-600' : 'text-amber-600'}>{t.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${t.score >= 80 ? 'bg-[#1D6A4A]' : t.score < 70 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${t.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 leading-relaxed">
                    <strong className="text-gray-900 block mb-1">Insight:</strong> Students are struggling with Thermodynamics. Consider assigning targeted practice papers before the final.
                  </div>
                </div>

                {/* Per-student Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Student Results</h3>
                    <span className="text-xs font-bold text-[#1D6A4A] bg-green-50 px-2 py-1 rounded border border-green-100">{examDetailsMock.length} Submissions</span>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white border-b border-gray-100">
                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="px-6 py-3">Student</th>
                          <th className="px-6 py-3 text-center">Score</th>
                          <th className="px-6 py-3 text-center">Rank (School)</th>
                          <th className="px-6 py-3 text-center">Rank (Overall)</th>
                          <th className="px-6 py-3 text-right">Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {examDetailsMock.map((s, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.class} • {s.id}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-lg font-black text-[#1D6A4A]">{s.score}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {s.rankSchool === 1 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full font-bold text-xs"><Medal className="w-3 h-3"/></span>
                              ) : (
                                <span className="font-bold text-gray-600">#{s.rankSchool}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-600">#{s.rankOverall}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {s.cert ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200"><CheckCircle2 className="w-3 h-3"/> Earned</span> : <span className="text-xs text-gray-400">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Main Dashboard State */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exams & Results</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor live exams, review results, and remind students.</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-2">
            {[
              { id: "upcoming", label: "Upcoming Scheduled" },
              { id: "live", label: "Live Active", badge: liveExams.length > 0 },
              { id: "completed", label: "Completed & Results" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-3 text-sm font-bold whitespace-nowrap transition-all rounded-t-xl ${
                  activeTab === tab.id 
                    ? "bg-white text-[#1D6A4A] border-t border-x border-gray-200 -mb-px shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-t border-x border-transparent"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.badge && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-300">
            {/* TAB: Upcoming */}
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
                  <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-gray-200">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shrink-0">
                        <span className="text-xs font-bold text-gray-400 uppercase">{exam.date.split(' ')[0]}</span>
                        <span className="text-xl font-black text-gray-900">{exam.date.split(' ')[1].replace(',', '')}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{exam.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">{exam.subject}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-4 mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {exam.time}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {exam.duration}</span>
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-48 bg-gray-100 rounded-full h-2">
                            <div className="bg-[#1D6A4A] h-2 rounded-full" style={{ width: `${(exam.registered/exam.total)*100}%` }}></div>
                          </div>
                          <p className="text-xs font-bold text-gray-600">{exam.registered} / {exam.total} Students Enrolled</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast(`Reminder notification sent to all ${exam.registered} students.`)}
                      className="w-full md:w-auto px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold shadow-sm transition-colors flex justify-center items-center gap-2"
                    >
                      <Bell className="w-4 h-4" /> Remind All
                    </button>
                  </div>
                )) : (
                  <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900">No exams scheduled yet.</h3>
                    <p className="text-gray-500 text-sm mt-1">The platform team will schedule exams. Check back later.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Live */}
            {activeTab === "live" && (
              <div className="space-y-4">
                {liveExams.length > 0 ? liveExams.map((exam) => (
                  <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Now
                          </div>
                          <span className="text-xs text-gray-500 font-bold">{exam.subject}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl">{exam.name}</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">{exam.time} • Duration: {exam.duration}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 lg:gap-8">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Active Students</p>
                          <p className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                            <Users className="w-6 h-6 text-blue-500"/> {liveData.activeStudents}
                          </p>
                        </div>
                        <div className="w-px bg-gray-100 hidden lg:block"></div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Completed</p>
                          <p className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500"/> {liveData.completedSubmissions}
                          </p>
                        </div>
                        <div className="w-px bg-gray-100 hidden lg:block"></div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time Left</p>
                          <p className="text-3xl font-black text-red-600 font-mono flex items-center justify-center gap-2">
                            <Clock className="w-6 h-6 text-red-500"/> {liveData.timeLeft}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900">No exams are currently in progress.</h3>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Completed */}
            {activeTab === "completed" && (
              <div className="space-y-4">
                {completedExams.map((exam) => (
                  <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-200 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{exam.name}</h3>
                        {exam.status === 'Pending' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Results Pending</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">Published</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-3">Completed: {exam.date}</p>
                      
                      {exam.status === 'Pending' ? (
                        <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Results are being reviewed by the platform team. You will be notified by email when published.</p>
                      ) : exam.absentMode ? (
                        <p className="text-xs text-red-600 font-bold bg-red-50 inline-block px-2 py-1 rounded border border-red-100">0 students attempted this exam.</p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">School Avg</span>
                            <p className="text-lg font-black text-[#1D6A4A]">{exam.avgScore}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">School Rank</span>
                            <p className="text-lg font-black text-gray-900">#{exam.schoolRank} / {exam.totalSchools}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Top Student</span>
                            <p className="text-sm font-bold text-gray-700 mt-1">{exam.topStudent}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {exam.status === 'Published' && (
                      <button 
                        onClick={() => setExpandedExamId(exam.id)}
                        className="w-full md:w-auto shrink-0 px-5 py-3 bg-[#1D6A4A] text-white rounded-xl hover:bg-green-800 text-sm font-bold shadow-md shadow-green-700/20 transition-colors flex justify-center items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View Results
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </DashboardLayout>
  );
}
