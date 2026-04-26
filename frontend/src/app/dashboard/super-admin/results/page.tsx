"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Search, Award, Download, CheckCircle, BarChart3, Users, AlertTriangle, EyeOff, X, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

export default function ResultsLeaderboard() {
  const [exams, setExams] = useState<any[]>([
    { id: 1, title: "Math Olympiad 2023 - Finals" },
    { id: 2, title: "Science Qualifier Q3" },
  ]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // Mocked state for the specific exam
  const [results, setResults] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Publishing state
  const [isPublished, setIsPublished] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    setIsPublished(false);
    
    // Mocking the backend fetch for the specific exam
    setTimeout(() => {
      // Mock schools breakdown
      setSchools([
        { id: 101, name: "Greenfield Academy", attempted: 45, avgScore: 82.4, topStudent: "Alex Mercer", withheld: false },
        { id: 102, name: "Riverside High", attempted: 112, avgScore: 78.1, topStudent: "Samira Khan", withheld: false },
        { id: 103, name: "Pinnacle International", attempted: 23, avgScore: 91.5, topStudent: "David Chen", withheld: false }
      ]);

      // Mock top 10 leaderboard
      const mockLeaderboard = [
        { rank: 1, name: "David Chen", school: "Pinnacle International", score: "99%" },
        { rank: 2, name: "Emma Watson", school: "Pinnacle International", score: "97%" },
        { rank: 3, name: "Alex Mercer", school: "Greenfield Academy", score: "96%" },
        { rank: 4, name: "Samira Khan", school: "Riverside High", score: "95%" },
        { rank: 5, name: "Rahul Sharma", school: "Greenfield Academy", score: "94%" },
        { rank: 6, name: "Chloe Price", school: "Riverside High", score: "93%" },
        { rank: 7, name: "Max Caulfield", school: "Greenfield Academy", score: "92%" },
        { rank: 8, name: "Warren Graham", school: "Pinnacle International", score: "91%" },
        { rank: 9, name: "Kate Marsh", school: "Riverside High", score: "90%" },
        { rank: 10, name: "Victoria Chase", school: "Greenfield Academy", score: "89%" },
      ];
      setResults(mockLeaderboard);
      setLoading(false);
    }, 600);
  }, [selectedExamId]);

  const toggleWithhold = (schoolId: number) => {
    if (isPublished) return;
    setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, withheld: !s.withheld } : s));
  };

  const handlePublishClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPublish = () => {
    setIsPublishing(true);
    setPublishProgress(0);
    
    // Simulate irreversible server action and certificate generation
    const interval = setInterval(() => {
      setPublishProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPublishing(false);
            setIsPublished(true);
            setIsConfirmModalOpen(false);
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 600);
  };

  const totalAttempted = useMemo(() => schools.reduce((acc, curr) => acc + curr.attempted, 0), [schools]);
  const overallAvg = useMemo(() => schools.length ? (schools.reduce((acc, curr) => acc + curr.avgScore, 0) / schools.length).toFixed(1) : 0, [schools]);

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      
      {/* Header & Exam Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results & Leaderboard</h1>
          <div className="w-80">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Exam to review</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-900 outline-none focus:border-[#B45309] shadow-sm"
              value={selectedExamId || ""}
              onChange={(e) => setSelectedExamId(Number(e.target.value))}
            >
              <option value="" disabled>Select an exam...</option>
              {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
        </div>
        
        {selectedExamId && (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {isPublishing ? (
              <div className="w-full sm:w-64">
                <div className="flex justify-between text-xs font-bold text-amber-700 mb-1">
                  <span>Generating Certificates...</span>
                  <span>{publishProgress}%</span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#B45309] h-2.5 rounded-full transition-all duration-300" style={{ width: `${publishProgress}%` }}></div>
                </div>
              </div>
            ) : isPublished ? (
              <div className="px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Results Published
              </div>
            ) : (
              <button onClick={handlePublishClick} className="w-full sm:w-auto px-6 py-3 bg-[#B45309] hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2">
                Publish Results & Generate Certificates
              </button>
            )}
          </div>
        )}
      </div>

      {!selectedExamId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Award className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No Exam Selected</h3>
          <p className="text-sm text-gray-500 mt-1">Please select an exam from the dropdown above to view results.</p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading results data...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Total Submissions</p>
              <p className="text-3xl font-black text-gray-900">{totalAttempted}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Global Average</p>
              <p className="text-3xl font-black text-gray-900">{overallAvg}%</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500"/> Highest Score</p>
              <p className="text-3xl font-black text-green-600">99%</p>
              <p className="text-xs text-gray-500 mt-1 truncate">David Chen (Pinnacle Int.)</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pass Rate</p>
              <p className="text-3xl font-black text-gray-900">84%</p>
              <p className="text-xs text-gray-400 mt-1">Threshold: 40%</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* LEFT: School Breakdown */}
            <div className="flex-[3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-bold text-gray-900">School Breakdown</h2>
                {!isPublished && <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">Verify before publishing</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-5 py-3">School Name</th>
                      <th className="px-5 py-3">Students</th>
                      <th className="px-5 py-3">Avg Score</th>
                      <th className="px-5 py-3 text-right">Visibility Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {schools.map((s, idx) => (
                      <tr key={s.id} className={`transition-colors ${s.withheld ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                        <td className="px-5 py-4">
                          <p className={`text-sm font-bold ${s.withheld ? 'text-red-900' : 'text-gray-900'}`}>{s.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Top: {s.topStudent}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-700">{s.attempted}</td>
                        <td className="px-5 py-4 text-sm font-bold text-[#B45309]">{s.avgScore}%</td>
                        <td className="px-5 py-4 text-right">
                          {isPublished ? (
                            s.withheld ? <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded"><EyeOff className="w-3 h-3"/> Withheld</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded"><Eye className="w-3 h-3"/> Published</span>
                          ) : (
                            <button 
                              onClick={() => toggleWithhold(s.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ml-auto ${s.withheld ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                              {s.withheld ? <><EyeOff className="w-3 h-3"/> Withheld</> : "Withhold"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: Leaderboard Preview */}
            <div className="flex-[2] bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col relative">
              {!isPublished && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-30deg]">
                  <span className="text-white text-6xl font-black uppercase tracking-widest">PREVIEW ONLY</span>
                </div>
              )}
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 relative z-10">
                <h2 className="font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Global Top 10</h2>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 relative z-10">
                {results.map((row) => (
                  <div key={row.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${row.rank === 1 ? 'bg-yellow-500 text-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : row.rank === 2 ? 'bg-slate-300 text-slate-800' : row.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {row.rank}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.school}</p>
                      </div>
                    </div>
                    <div className="text-sm font-black text-emerald-400">{row.score}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 duration-200">
            <div className="p-6 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600" /> Irreversible Action
              </h2>
              <button onClick={() => setIsConfirmModalOpen(false)} className="text-amber-400 hover:text-amber-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 font-medium mb-4">
                You are about to publish the global results for <strong className="text-gray-900">{exams.find(e => e.id === selectedExamId)?.title}</strong>.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6 list-disc pl-5">
                <li>Results will become visible to all students in their portal.</li>
                <li>School admins will receive an email notification.</li>
                <li><strong>Certificates will be permanently generated</strong> for all passing students.</li>
                {schools.filter(s => s.withheld).length > 0 && (
                  <li className="text-red-600 font-bold">Results for {schools.filter(s => s.withheld).length} school(s) will be withheld.</li>
                )}
              </ul>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmPublish}
                  className="flex-1 px-4 py-3 bg-[#B45309] text-white rounded-xl text-sm font-black hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20"
                >
                  Confirm & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}