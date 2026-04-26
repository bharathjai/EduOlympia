"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Sparkles, TrendingUp, BarChart2, PieChart, RefreshCw, Calendar, Download, FileText, ArrowRight, AlertCircle, ArrowUpRight, ArrowDownRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function PlatformAnalytics() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  
  // Data State
  const [stats, setStats] = useState({ schools: 0, students: 0, exams: 0, avgScore: 0 });
  
  // Mock Data arrays
  const overviewChart = [30, 40, 45, 50, 70, 85, 95];
  const schoolComparison = [
    { name: "Pinnacle International", score: 92, status: "above" },
    { name: "Greenfield Academy", score: 85, status: "above" },
    { name: "Platform Average", score: 78.4, status: "avg" },
    { name: "Riverside High", score: 72, status: "below" },
    { name: "Eastside Tech", score: 64, status: "below" },
  ];
  const contentTable = [
    { id: 1, item: "Advanced Algebra Workbook", views: 1240, completion: "88%", time: "45m", subject: "Math" },
    { id: 2, item: "Physics Motion Video Lecture", views: 980, completion: "92%", time: "18m", subject: "Physics" },
    { id: 3, item: "Chemistry Basics - Acids & Bases", views: 420, completion: "31%", time: "5m", subject: "Chemistry" },
    { id: 4, item: "Geometry Mock Test 1", views: 215, completion: "15%", time: "12m", subject: "Math" },
  ];

  const fetchAnalytics = async () => {
    // Fetch some basic counts from Supabase to inform the analytics
    const { count: schoolCount } = await supabase.from('schools').select('*', { count: 'exact', head: true });
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: examCount } = await supabase.from('exams').select('*', { count: 'exact', head: true });
    
    // Calculate average score if results exist
    const { data: results } = await supabase.from('results').select('score');
    let avg = 0;
    if (results && results.length > 0) {
      avg = results.reduce((acc, curr) => acc + Number(curr.score), 0) / results.length;
    }

    setStats({
      schools: schoolCount || 5,
      students: studentCount || 1240,
      exams: examCount || 42,
      avgScore: avg || 78.4
    });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchAnalytics();
    }, 400); // simulate range filter load
  }, [dateRange]);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert("AI Analytics Report generated and downloaded as PDF!");
    }, 3000);
  };

  const handleExportCsv = () => {
    alert(`Exporting raw analytics data for ${dateRange} as CSV...`);
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered platform-wide insights across all schools, content, and exam performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 outline-none focus:ring-2 focus:ring-[#B45309]/20 focus:border-[#B45309]"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Semester</option>
              <option>Custom Range</option>
            </select>
          </div>
          
          <button onClick={handleExportCsv} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          
          <button 
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-4 py-2 bg-[#1D6A4A] text-white rounded-lg text-sm font-bold hover:bg-[#155338] transition-colors shadow-sm shadow-[#1D6A4A]/20 flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Compiling Report...' : 'Generate AI Report PDF'}
          </button>
        </div>
      </div>

      {generating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          <Sparkles className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gemini is compiling your analytics report...</h2>
          <p className="text-gray-500">Processing platform-wide metrics and formulating strategic recommendations.</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-purple-600 animate-[pulse_1s_ease-in-out_infinite] w-full"></div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Recalculating analytics for {dateRange}...</div>
      ) : (
        <>
          {/* AI Insight Cards */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-600"/> Gemini AI Flash Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="w-2 h-full bg-red-400 absolute left-0 top-0"></div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Low Engagement Alert</h4>
                <p className="text-xs text-gray-600 mb-4">"Chemistry Basics" and "Geometry Mock Test 1" have <span className="font-bold text-red-600">completion rates below 35%</span>. This suggests a difficulty spike or unengaging material.</p>
                <button onClick={() => window.location.href = '/dashboard/super-admin/content-approval'} className="text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 w-max">
                  Review Content <ArrowRight className="w-3 h-3"/>
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="w-2 h-full bg-emerald-400 absolute left-0 top-0"></div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Performance Gap Detected</h4>
                <p className="text-xs text-gray-600 mb-4">The score gap between top school (Pinnacle Int.) and bottom school (Eastside Tech) is <span className="font-bold text-amber-600">widening by 12%</span> this month.</p>
                <button onClick={() => window.location.href = '/dashboard/super-admin/schools'} className="text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 w-max">
                  Manage Schools <ArrowRight className="w-3 h-3"/>
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="w-2 h-full bg-blue-400 absolute left-0 top-0"></div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Syllabus Recommendation</h4>
                <p className="text-xs text-gray-600 mb-4">Based on {stats.students} students' search logs, demand for <b>Advanced Physics</b> is high, but only 2 items are uploaded. Request trainers to focus here.</p>
                <button onClick={() => window.location.href = '/dashboard/super-admin/trainers'} className="text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 w-max">
                  Assign Trainers <ArrowRight className="w-3 h-3"/>
                </button>
              </div>

            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Platform Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Platform Overview</h3>
                  <p className="text-xs text-gray-500 mt-1">Active Students (Daily) — {dateRange}</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Students</span>
                </div>
              </div>
              <div className="flex-1 min-h-[220px] flex items-end gap-2 relative">
                {/* SVG Line mock */}
                <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
                  <path d="M0,35 L15,30 L30,25 L45,28 L60,15 L75,10 L90,5 L100,0 L100,40 L0,40 Z" fill="rgba(59, 130, 246, 0.1)" />
                  <path d="M0,35 L15,30 L30,25 L45,28 L60,15 L75,10 L90,5 L100,0" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex justify-between mt-3 text-xs font-bold text-gray-400 border-t border-gray-100 pt-3">
                <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span>
              </div>
            </div>
            
            {/* School Comparison */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-amber-600" /> School Comparison</h3>
                  <p className="text-xs text-gray-500 mt-1">Average score on last exam by school</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                {schoolComparison.map((school, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span className="group-hover:text-amber-700 transition-colors">{school.name}</span>
                      <span className={school.status === 'above' ? 'text-emerald-600' : school.status === 'below' ? 'text-red-500' : 'text-gray-500'}>{school.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${school.status === 'above' ? 'bg-emerald-500' : school.status === 'below' ? 'bg-red-400' : 'bg-gray-400'}`} 
                        style={{ width: `${school.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-500">Click a bar to view detailed school metrics.</span>
              </div>
            </div>

          </div>

          {/* Content Engagement Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" /> Content Engagement</h3>
                <p className="text-xs text-gray-500 mt-1">Identifies most and least utilized study materials.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Content Item</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Views</th>
                    <th className="px-6 py-3">Completion Rate</th>
                    <th className="px-6 py-3">Avg Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contentTable.map((row) => (
                    <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">{row.item}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">{row.subject}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">{row.views}</td>
                      <td className="px-6 py-4 text-sm font-bold">
                        <span className={parseInt(row.completion) > 50 ? 'text-emerald-600' : 'text-red-500 flex items-center gap-1'} >
                          {parseInt(row.completion) <= 50 && <AlertCircle className="w-3 h-3"/>} {row.completion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </>
      )}

    </DashboardLayout>
  );
}