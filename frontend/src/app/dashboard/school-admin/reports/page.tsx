"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Search, Filter, Sparkles, Download, FileText, Calendar, Users, Target, BookOpen, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function PerformanceReports() {
  const [activeTab, setActiveTab] = useState("participation");
  const [examFilter, setExamFilter] = useState("all");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showToast, setShowToast] = useState("");

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      triggerToast("Report downloaded successfully as PDF.");
    }, 3500);
  };

  const handleExportCSV = () => {
    triggerToast("Raw data exported as CSV.");
  };

  // Mock data components
  const inactiveStudents = [
    { name: "John Doe", grade: "Grade 10", lastLogin: "12 days ago", practice: 0 },
    { name: "Jane Smith", grade: "Grade 9", lastLogin: "8 days ago", practice: 0 },
  ];

  const topicHeatmap = [
    { topic: "Algebra", q1: 95, q2: 88, q3: 92, q4: 78, avg: 88.25 },
    { topic: "Geometry", q1: 70, q2: 65, q3: 60, q4: 85, avg: 70 },
    { topic: "Trigonometry", q1: 45, q2: 50, q3: 40, q4: 55, avg: 47.5 },
  ];

  const getHeatmapColor = (val: number) => {
    if (val >= 80) return "bg-green-100 text-green-800";
    if (val >= 60) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const ReportHeader = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>
      <div className="flex items-center gap-3">
        <select 
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] bg-white shadow-sm"
        >
          <option value="all">All Data (Last 30 Days)</option>
          <option value="midterm">Term 1 Mathematics Olympiad</option>
          <option value="empty">Regional Qualifier (No Data Mock)</option>
        </select>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold shadow-sm transition-colors">
          <Download className="w-4 h-4" /> CSV
        </button>
        <button 
          onClick={handleExportPDF} 
          disabled={isExportingPDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#1D6A4A] text-white rounded-xl hover:bg-green-800 text-sm font-bold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {isExportingPDF ? "Generating..." : "Export PDF"}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Deep-dive into student performance, platform engagement, and outcomes.</p>
      </div>

      {/* Sub-nav */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {[
          { id: "participation", label: "Student Participation", icon: Users },
          { id: "performance", label: "Exam Performance", icon: BarChart },
          { id: "topic", label: "Topic Analysis", icon: Target },
          { id: "attendance", label: "Attendance Summary", icon: Calendar },
          { id: "overall", label: "Overall School Report", icon: BookOpen }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-[#1D6A4A] text-white shadow-md shadow-green-700/20" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
        
        {examFilter === "empty" ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-center animate-in fade-in duration-300">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No data available</h2>
            <p className="text-gray-500 max-w-sm">There is no data available for the selected period. Try selecting a different exam or date range.</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            
            {/* TAB: Student Participation */}
            {activeTab === "participation" && (
              <div>
                <ReportHeader title="Student Participation" desc="Tracking daily active users and identifying disengaged students." />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 border border-gray-100 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Daily Active Students (Last 30 Days)</h3>
                    <div className="h-48 flex items-end justify-between gap-1">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const height = Math.max(10, Math.random() * 100);
                        return (
                          <div key={i} className="w-full bg-green-100 rounded-t-sm hover:bg-[#1D6A4A] transition-colors relative group" style={{ height: `${height}%` }}>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              {Math.floor(height * 2.5)} students
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>

                  <div className="border border-red-100 bg-red-50/30 rounded-xl p-6">
                    <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Disengaged Alerts</h3>
                    <p className="text-sm text-red-700 mb-4">Students with 0 logins or 0 practice tests this week.</p>
                    <div className="space-y-3">
                      {inactiveStudents.map((s, i) => (
                        <div key={i} className="bg-white border border-red-100 p-3 rounded-lg shadow-sm">
                          <p className="font-bold text-gray-900 text-sm">{s.name} <span className="text-xs text-gray-500 font-normal ml-1">({s.grade})</span></p>
                          <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider">Last Login: {s.lastLogin}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Exam Performance */}
            {activeTab === "performance" && (
              <div>
                <ReportHeader title="Exam Performance" desc="Distribution and insights from the selected exam cycle." />
                
                <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Performance Context</h3>
                    <p className="text-sm text-gray-600">Comparing your school's performance against the global platform average.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Platform Avg</p>
                      <p className="text-2xl font-black text-gray-400">69%</p>
                    </div>
                    <div className="text-center bg-white shadow-sm border border-gray-100 px-6 py-2 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-[#1D6A4A] tracking-wider">Your School</p>
                      <p className="text-3xl font-black text-[#1D6A4A]">74%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Score Distribution</h3>
                    <div className="h-40 flex items-end justify-between gap-2">
                      {['0-20', '21-40', '41-60', '61-80', '81-100'].map((range, i) => {
                        const heights = [5, 10, 25, 45, 15];
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#1D6A4A] rounded-t-sm" style={{ height: `${heights[i]}%` }}></div>
                            <span className="text-[10px] font-bold text-gray-500">{range}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 mb-6">Pass / Fail Breakdown</h3>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-full border-[12px] border-green-500 relative flex items-center justify-center shadow-inner">
                        <div className="absolute top-0 right-0 w-16 h-16 border-[12px] border-red-500 rounded-tr-full -mt-[12px] -mr-[12px]"></div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-gray-900">82%</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passed</p>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-bold text-green-800">Passed</span>
                          <span className="text-sm font-bold text-green-900">324 students</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <span className="text-sm font-bold text-red-800">Failed</span>
                          <span className="text-sm font-bold text-red-900">68 students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Topic Analysis */}
            {activeTab === "topic" && (
              <div>
                <ReportHeader title="Topic Analysis" desc="Understand granular strengths and weaknesses across all curriculum topics." />
                
                <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 font-medium">
                    This heatmap shows the percentage of students who correctly answered questions on specific topics. Share this with teachers or parents for targeted study guidance.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-bold text-gray-600">Topic</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-center">Class A</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-center">Class B</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-center">Class C</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-center">Class D</th>
                        <th className="px-4 py-3 font-bold text-gray-900 text-center bg-gray-100">Overall Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topicHeatmap.map((t, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-bold text-gray-900">{t.topic}</td>
                          <td className={`px-4 py-3 text-center font-bold ${getHeatmapColor(t.q1)}`}>{t.q1}%</td>
                          <td className={`px-4 py-3 text-center font-bold ${getHeatmapColor(t.q2)}`}>{t.q2}%</td>
                          <td className={`px-4 py-3 text-center font-bold ${getHeatmapColor(t.q3)}`}>{t.q3}%</td>
                          <td className={`px-4 py-3 text-center font-bold ${getHeatmapColor(t.q4)}`}>{t.q4}%</td>
                          <td className={`px-4 py-3 text-center font-black bg-gray-50 ${getHeatmapColor(t.avg)}`}>{t.avg.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Attendance Summary */}
            {activeTab === "attendance" && (
              <div>
                <ReportHeader title="Attendance Summary" desc="School-wide live class attendance heatmap." />
                
                <div className="max-w-4xl mx-auto border border-gray-100 rounded-2xl p-8 bg-white shadow-sm">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">November 2023</h3>
                      <p className="text-sm text-gray-500">Live Class Turnout</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">School-wide Avg</p>
                      <p className="text-3xl font-black text-[#1D6A4A]">87%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
                    ))}
                    
                    {/* Padding */}
                    <div className="aspect-square rounded-xl bg-gray-50/50"></div>
                    <div className="aspect-square rounded-xl bg-gray-50/50"></div>

                    {/* Heatmap cells */}
                    {Array.from({ length: 30 }).map((_, i) => {
                      const rand = Math.random();
                      let color = "bg-green-500";
                      let tooltip = "High Turnout (90%+)";
                      if (rand < 0.2) { color = "bg-red-500"; tooltip = "Low Turnout (<60%)"; }
                      else if (rand < 0.4) { color = "bg-amber-400"; tooltip = "Avg Turnout (60-89%)"; }
                      
                      if (i % 7 === 4 || i % 7 === 5) { color = "bg-gray-100"; tooltip = "No Class"; } // Fake weekends/empty
                      
                      return (
                        <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-help ${color}`} title={tooltip}>
                          {i + 1}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Overall School Report */}
            {activeTab === "overall" && (
              <div>
                <ReportHeader title="Overall School Report" desc="Condensed summary for stakeholders." />
                
                <div className="border-2 border-gray-800 rounded-xl p-8 bg-white" id="pdf-export-target">
                  <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Springfield High</h1>
                    <h2 className="text-xl font-bold text-[#1D6A4A] mt-2">EduOlympia Term Report</h2>
                    <p className="text-gray-500 font-medium mt-1">Generated: November 24, 2023 | Exam Cycle: Midterms</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">School Avg</p>
                      <p className="text-4xl font-black text-gray-900">74%</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Global Rank</p>
                      <p className="text-4xl font-black text-[#1D6A4A]">#3</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Participation</p>
                      <p className="text-4xl font-black text-gray-900">92%</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">1. Executive Summary</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Springfield High continues to excel in the regional cohorts, performing <strong>5% higher</strong> than the platform average. Student participation remains remarkably high, though targeted interventions are needed for 42 inactive students. Topic analysis reveals strong competency in Algebra but significant struggles with Trigonometry.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Top Performers</h4>
                        <ul className="text-sm space-y-2 font-medium text-gray-700">
                          <li>1. Aisha Ramachandran (96%)</li>
                          <li>2. Michael Brown (88%)</li>
                          <li>3. Chloe Davis (85%)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Action Items</h4>
                        <ul className="text-sm space-y-2 font-medium text-gray-700 list-disc pl-4">
                          <li>Review Trigonometry curriculum</li>
                          <li>Reach out to 42 inactive accounts</li>
                          <li>Distribute certificates for top 3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400 font-medium">This document was automatically generated by the EduOlympia Analytics Engine.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </DashboardLayout>
  );
}
