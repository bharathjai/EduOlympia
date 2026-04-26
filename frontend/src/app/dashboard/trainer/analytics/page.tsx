"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Filter, Search, X, TrendingUp, TrendingDown, Target, Activity, 
  Sparkles, Loader2, ChevronRight, Users, BookOpen, Clock, Calendar, BarChart2
} from "lucide-react";

// --- MOCK DATA ---
const mockHeatmap = [
  { topic: "Algebra: Quadratic Eq", easy: 85, medium: 65, hard: 32 },
  { topic: "Geometry: Triangles", easy: 92, medium: 78, hard: 55 },
  { topic: "Number System", easy: 70, medium: 45, hard: 20 },
  { Math: "Trigonometry", easy: 60, medium: 40, hard: 15 },
  { Math: "Probability", easy: 88, medium: 72, hard: 65 }
];

const mockStudents = [
  { id: "s1", name: "Rohan Verma", school: "Delhi Public School", score: 92, rank: 1, weakTopics: ["Trigonometry"], lastActive: "Today", examsTaken: 5 },
  { id: "s2", name: "Priya Sharma", school: "Modern School", score: 64, rank: 42, weakTopics: ["Algebra", "Number System"], lastActive: "Yesterday", examsTaken: 5 },
  { id: "s3", name: "Aman Gupta", school: "Delhi Public School", score: 45, rank: 89, weakTopics: ["Trigonometry", "Geometry"], lastActive: "3 days ago", examsTaken: 3 },
  { id: "s4", name: "Sneha Reddy", school: "St. Xavier's High", score: 78, rank: 15, weakTopics: ["Number System"], lastActive: "Today", examsTaken: 4 }
];

export default function StudentPerformancePage() {
  const router = useRouter();

  // Filters State
  const [filters, setFilters] = useState({
    subject: "Mathematics",
    exam: "Mid-Term Assessment",
    school: "All Schools",
    dateRange: "Last 30 Days"
  });

  const [activeChips, setActiveChips] = useState([
    { key: 'subject', label: 'Math' },
    { key: 'exam', label: 'Mid-Term' }
  ]);

  // AI Report State
  const [aiState, setAiState] = useState<"idle" | "loading" | "result">("idle");

  // Selection
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Sorting
  const [sortCol, setSortCol] = useState<"score" | "rank">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Handlers
  const handleRemoveChip = (key: string) => {
    setActiveChips(prev => prev.filter(c => c.key !== key));
  };

  const handleGenerateReport = () => {
    setAiState("loading");
    setTimeout(() => {
      setAiState("result");
    }, 4500);
  };

  const handleSort = (col: "score" | "rank") => {
    if (sortCol === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortOrder("desc");
    }
  };

  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => {
      let comparison = 0;
      if (a[sortCol] > b[sortCol]) comparison = 1;
      else if (a[sortCol] < b[sortCol]) comparison = -1;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [sortCol, sortOrder]);

  const getHeatmapColor = (score: number) => {
    if (score >= 70) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans bg-slate-50 relative">
        
        {/* --- HEADER & FILTERS --- */}
        <div className="bg-white p-6 md:p-8 border-b border-gray-200 shrink-0 z-10 shadow-sm relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Student Performance</h1>
              <p className="text-gray-500 font-medium mt-1">Analyze batch trends, topic accuracy, and individual student progress.</p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 mb-4">
             <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 flex-1">
               <div className="px-3 text-gray-400"><Filter className="w-5 h-5"/></div>
               
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})}>
                 <option value="Mathematics">Mathematics</option>
                 <option value="Science">Science</option>
               </select>
               
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={filters.exam} onChange={e => setFilters({...filters, exam: e.target.value})}>
                 <option value="Mid-Term Assessment">Mid-Term Assessment</option>
                 <option value="Practice Test 1">Practice Test 1</option>
                 <option value="All Exams">All Exams</option>
               </select>
               
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={filters.school} onChange={e => setFilters({...filters, school: e.target.value})}>
                 <option value="All Schools">All Schools</option>
                 <option value="Delhi Public School">Delhi Public School</option>
               </select>

               <button className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Apply</button>
             </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Active Filters:</span>
              {activeChips.map(chip => (
                <span key={chip.key} className="px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-100 flex items-center gap-1.5">
                  {chip.label}
                  <button onClick={() => handleRemoveChip(chip.key)} className="hover:text-purple-900"><X className="w-3 h-3"/></button>
                </span>
              ))}
              <button onClick={() => setActiveChips([])} className="text-xs font-bold text-gray-400 hover:text-gray-600 ml-2">Clear All</button>
            </div>
          )}
        </div>

        {/* --- MAIN SCROLL AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 relative">

          {/* Batch Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4"><Activity className="w-5 h-5"/></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average Score</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-gray-900">68%</h3>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 mb-1.5"><TrendingUp className="w-3 h-3"/> 4%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><Target className="w-5 h-5"/></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Highest Score</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-gray-900">96%</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-red-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4"><TrendingDown className="w-5 h-5"/></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lowest Score</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-gray-900">22%</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><Users className="w-5 h-5"/></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Completion Rate</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-gray-900">94%</h3>
                  <span className="text-xs font-bold text-gray-500 mb-1.5">142/150</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Heatmap & AI Report (Left/Main Area) */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Topic Accuracy Heatmap</h2>
                    <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Average % correct by difficulty</p>
                  </div>
                  {aiState === "idle" && (
                    <button onClick={handleGenerateReport} className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm border border-purple-100">
                      <Sparkles className="w-4 h-4"/> Generate Weak Area Report
                    </button>
                  )}
                </div>

                <div className="p-6 overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr>
                        <th className="text-left pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-[40%]">Topic</th>
                        <th className="text-center pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-[20%]">Easy</th>
                        <th className="text-center pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-[20%]">Medium</th>
                        <th className="text-center pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-[20%]">Hard</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {mockHeatmap.map((row, idx) => {
                        const tName = row.topic || row.Math;
                        return (
                          <tr key={idx} className="group">
                            <td className="py-2.5 pr-4 text-sm font-bold text-gray-700 group-hover:text-gray-900">{tName}</td>
                            <td className="p-1">
                              <div className={`w-full py-2.5 rounded-lg border text-center font-bold text-sm transition-all ${getHeatmapColor(row.easy)}`}>{row.easy}%</div>
                            </td>
                            <td className="p-1">
                              <div className={`w-full py-2.5 rounded-lg border text-center font-bold text-sm transition-all ${getHeatmapColor(row.medium)}`}>{row.medium}%</div>
                            </td>
                            <td className="p-1">
                              <div className={`w-full py-2.5 rounded-lg border text-center font-bold text-sm transition-all ${getHeatmapColor(row.hard)}`}>{row.hard}%</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-200"></div><span className="text-xs font-bold text-gray-500">&lt; 40%</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-200"></div><span className="text-xs font-bold text-gray-500">40 - 70%</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-200"></div><span className="text-xs font-bold text-gray-500">&gt; 70%</span></div>
                  </div>
                </div>
              </div>

              {/* AI Report Panel */}
              {aiState !== "idle" && (
                <div className={`bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800 transition-all ${aiState === 'loading' ? 'animate-pulse' : 'animate-in slide-in-from-bottom-4'}`}>
                  <div className="p-6 bg-slate-800/50 flex items-center justify-between border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Sparkles className={`w-6 h-6 text-purple-400 ${aiState === 'loading' ? 'animate-spin' : ''}`} />
                      <h3 className="text-xl font-black text-white">Gemini AI Pattern Analysis</h3>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {aiState === "loading" ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                        <p className="text-slate-300 font-medium">Analysing student performance patterns and isolating learning gaps...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">1</div>
                          <div>
                            <h4 className="text-slate-100 font-bold mb-2 leading-relaxed">Students in all schools are critically struggling with Algebra — specifically Quadratic Equations (only 32% accuracy on Hard questions).</h4>
                            <p className="text-slate-400 text-sm font-medium mb-4">Action: Consider scheduling a dedicated revision class focusing on factoring techniques.</p>
                            <button onClick={() => router.push('/dashboard/trainer/classes')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-colors">
                              Schedule Class on Algebra
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">2</div>
                          <div>
                            <h4 className="text-slate-100 font-bold mb-2 leading-relaxed">Number System fundamentals show widespread weakness across Medium and Hard difficulties (avg 32.5%).</h4>
                            <p className="text-slate-400 text-sm font-medium mb-4">Action: Generate and assign a targeted Practice Paper focusing on irrational numbers.</p>
                            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs transition-colors">
                              Create Practice Paper
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">3</div>
                          <div>
                            <h4 className="text-slate-100 font-bold leading-relaxed">Geometry concepts are very strong! Over 75% accuracy even on medium difficulty.</h4>
                            <p className="text-slate-400 text-sm font-medium">Action: You can safely move on to the next topic in the curriculum.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Student Roster (Right Side / Bottom on Mobile) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[700px]">
              <div className="p-6 border-b border-gray-100 shrink-0">
                <h3 className="text-lg font-black text-gray-900">Individual Performance</h3>
                <div className="relative mt-4">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search student..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-600 outline-none" />
                </div>
              </div>
              
              <div className="p-2 border-b border-gray-100 flex bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                <div className="flex-1 px-4 py-2">Student</div>
                <div className="w-16 px-2 py-2 text-center cursor-pointer hover:text-gray-900" onClick={() => handleSort('score')}>Score {sortCol === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}</div>
                <div className="w-16 px-2 py-2 text-center cursor-pointer hover:text-gray-900" onClick={() => handleSort('rank')}>Rank {sortCol === 'rank' && (sortOrder === 'desc' ? '↓' : '↑')}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sortedStudents.map(student => (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{student.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{student.school}</p>
                    </div>
                    <div className="w-16 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-black ${student.score >= 75 ? 'bg-emerald-100 text-emerald-700' : student.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {student.score}%
                      </span>
                    </div>
                    <div className="w-16 text-center">
                      <span className="font-bold text-gray-600 text-sm">#{student.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- STUDENT DETAIL DRAWER --- */}
        {selectedStudent && (
          <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedStudent(null)}></div>
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="bg-slate-900 p-8 flex flex-col justify-end text-white relative shrink-0 min-h-[200px]">
                <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-black mb-4 border-4 border-slate-800 shadow-xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-black">{selectedStudent.name}</h2>
                <p className="text-slate-400 text-sm font-medium">{selectedStudent.school} • Grade 10</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Rank</p>
                    <p className="text-2xl font-black text-gray-900">#{selectedStudent.rank}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Score</p>
                    <p className={`text-2xl font-black ${selectedStudent.score >= 75 ? 'text-emerald-600' : selectedStudent.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{selectedStudent.score}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-purple-600"/> Weak Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.weakTopics.map((topic: string) => (
                      <span key={topic} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-lg">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h4 className="font-black text-gray-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-600"/> Latest AI Feedback</h4>
                    <span className="text-xs font-bold text-gray-400">Mid-Term</span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                      "{selectedStudent.name.split(' ')[0]}, you performed excellently in Geometry but struggled with Trigonometric ratios. Focus on memorizing the unit circle."
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2"><History className="w-4 h-4 text-purple-600"/> Recent Activity</h4>
                  <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-gray-200 ml-2">
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-50"></div>
                      <p className="text-sm font-bold text-gray-900">Completed Mid-Term Assessment</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">Scored {selectedStudent.score}% • {selectedStudent.lastActive}</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-purple-500 rounded-full border-4 border-slate-50"></div>
                      <p className="text-sm font-bold text-gray-900">Attended "Algebra Revision"</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">Live Class • 3 days ago</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-gray-300 rounded-full border-4 border-slate-50"></div>
                      <p className="text-sm font-bold text-gray-900">Joined Platform</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">2 months ago</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}

// Quick Lucide shim since History isn't imported
function History(props: any) {
  return <Clock {...props} />
}
