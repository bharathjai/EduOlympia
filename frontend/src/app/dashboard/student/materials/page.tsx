"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, CheckCircle2, MessageSquare, 
  FileText, BookOpen, Play, ChevronRight, 
  Sparkles, Award, Lock
} from "lucide-react";
import { supabase } from "@/utils/supabase";

// --- MOCK DATA ---
export default function ContentLibrary() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledSubjects, setEnrolledSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('subjects').select(`
        id,
        name,
        chapters (
          id,
          name,
          topics (
            study_materials (
              id,
              type
            )
          )
        )
      `);

      if (data) {
        const formattedSubjects = data.map((s: any, index: number) => ({
          id: s.id.toString(),
          name: s.name,
          completed: 0,
          total: s.chapters?.length || 0,
          percentage: 0,
          icon: index % 2 === 0 ? '➗' : '🔬',
          color: index % 2 === 0 ? 'blue' : 'emerald'
        }));
        
        const formattedChapters: any[] = [];
        data.forEach((s: any) => {
          (s.chapters || []).forEach((c: any, index: number) => {
            let pdf = 0, video = 0, notes = 0;
            (c.topics || []).forEach((t: any) => {
              (t.study_materials || []).forEach((m: any) => {
                if (m.type === 'PDF') pdf++;
                else if (m.type === 'Video') video++;
                else notes++;
              });
            });
            const total = pdf + video + notes;
            formattedChapters.push({
              id: c.id.toString(),
              subjectId: s.id.toString(),
              number: index + 1,
              title: c.name,
              resources: { pdf, video, notes },
              completedResources: 0,
              totalResources: total,
              isComplete: false
            });
          });
        });

        setEnrolledSubjects(formattedSubjects);
        setChapters(formattedChapters);
        if (formattedSubjects.length > 0) setActiveSubject(formattedSubjects[0].id);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const filteredChapters = chapters.filter(ch => {
    const matchesSubject = ch.subjectId === activeSubject;
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          `chapter ${ch.number}`.includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const activeSubjectData = enrolledSubjects.find(s => s.id === activeSubject);
  
  const allCompletedInSubject = filteredChapters.length > 0 && filteredChapters.every(ch => ch.isComplete);
  const hasNoSubjects = enrolledSubjects.length === 0;

  // Ring progress calculation
  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius;
  const getStrokeDashoffset = (radius: number, percentage: number) => {
    const circumference = getStrokeDasharray(radius);
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <DashboardLayout 
      role="student" 
      userName="Arjun Sharma" 
      userDescription="Class 8 • Delhi Public School"
      studentPendingPracticeCount={2}
    >
      <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-6 pb-6 relative animate-in fade-in duration-500">
        
        {/* State: No Subjects Enrolled */}
        {hasNoSubjects && !loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-gray-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">No subjects enrolled</h2>
             <p className="text-gray-500 max-w-md">Your school admin has not enrolled you in any subjects yet. Please contact your administrator to get access to study materials.</p>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Subjects Filter */}
            <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm sticky top-0">
                <h2 className="font-bold text-gray-900 mb-4 px-2">Your Subjects</h2>
                <div className="space-y-2">
                  {loading ? (
                    // Skeleton for subjects
                    [1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))
                  ) : (
                    enrolledSubjects.map(subject => {
                      const isActive = activeSubject === subject.id;
                      return (
                        <button
                          key={subject.id}
                          onClick={() => setActiveSubject(subject.id)}
                          className={`w-full text-left p-3 rounded-2xl transition-all duration-300 ${
                            isActive 
                              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-[1.02]' 
                              : 'hover:bg-gray-50 text-gray-700 hover:scale-[1.01]'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                              {subject.icon}
                            </div>
                            <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>{subject.name}</span>
                          </div>
                          
                          <div className="px-1">
                            <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                              <span className={isActive ? 'text-gray-300' : 'text-gray-500'}>Progress</span>
                              <span className={isActive ? 'text-white' : 'text-gray-900'}>{subject.percentage}%</span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${isActive ? 'bg-blue-400' : 'bg-blue-600'}`} 
                                style={{ width: `${subject.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Main Content area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              
              {/* Header Actions: Search & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Content Library</h1>
                  <p className="text-gray-500 font-medium mt-1">Explore chapters and resources.</p>
                </div>
                
                <div className="relative w-full sm:w-72 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters, topics..."
                    className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm font-medium text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* Progress Summary Banner */}
              {!loading && activeSubjectData && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        You have completed {activeSubjectData.completed} of {activeSubjectData.total} chapters in {activeSubjectData.name}
                      </p>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">Keep up the good work!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Chapters Complete Banner */}
              {!loading && allCompletedInSubject && !searchQuery && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 mb-6 flex items-center gap-4 text-white shadow-lg shadow-emerald-500/20 shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Great work!</h3>
                    <p className="font-medium text-emerald-50">You have completed all chapters. Ready for the exam?</p>
                  </div>
                  <Link href={`/dashboard/student/practice?subject=${activeSubjectData?.name}`} className="ml-auto hidden sm:block bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm">
                    Take Mock Test
                  </Link>
                </div>
              )}

              {/* Chapter Cards Grid (Scrollable) */}
              <div className="flex-1 overflow-y-auto pb-20 pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {loading ? (
                    // Skeletons for chapters
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-5 animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                          <div className="flex gap-2">
                            <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                            <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredChapters.length > 0 ? (
                    filteredChapters.map(chapter => {
                      const progressPercentage = Math.round((chapter.completedResources / chapter.totalResources) * 100);
                      const isComplete = chapter.isComplete;
                      const radius = 28;

                      return (
                        <div 
                          key={chapter.id} 
                          onClick={() => router.push(`/dashboard/student/materials/${chapter.id}`)}
                          className={`relative bg-white p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex gap-5 group overflow-hidden ${
                            isComplete 
                              ? 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-emerald-200 opacity-90' 
                              : 'border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300'
                          }`}
                        >
                          {/* Completion Tick Overlay */}
                          {isComplete && (
                            <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 rounded-full p-1 group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          )}

                          {/* Circular Progress Indicator */}
                          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                              {/* Background track */}
                              <circle 
                                cx="32" cy="32" r={radius} 
                                fill="none" 
                                className={isComplete ? "stroke-emerald-100" : "stroke-gray-100"} 
                                strokeWidth="6" 
                              />
                              {/* Progress track */}
                              <circle 
                                cx="32" cy="32" r={radius} 
                                fill="none" 
                                className={isComplete ? "stroke-emerald-500" : "stroke-blue-600"} 
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={getStrokeDasharray(radius)}
                                strokeDashoffset={getStrokeDashoffset(radius, progressPercentage)}
                                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className={`text-[10px] font-black tracking-tighter ${isComplete ? 'text-emerald-700' : 'text-gray-900'}`}>{progressPercentage}%</span>
                            </div>
                          </div>

                          <div className="flex-1 pr-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Chapter {chapter.number}
                            </p>
                            <h3 className={`font-extrabold text-lg mb-3 leading-tight ${isComplete ? 'text-gray-700' : 'text-gray-900 group-hover:text-blue-700 transition-colors'}`}>
                              {chapter.title}
                            </h3>
                            
                            {/* Resource Badges */}
                            <div className="flex flex-wrap gap-2">
                              {chapter.resources.pdf > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isComplete ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                  <FileText className="w-3 h-3" /> {chapter.resources.pdf} PDF{chapter.resources.pdf > 1 ? 's' : ''}
                                </span>
                              )}
                              {chapter.resources.video > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isComplete ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                  <Play className="w-3 h-3" /> {chapter.resources.video} Video{chapter.resources.video > 1 ? 's' : ''}
                                </span>
                              )}
                              {chapter.resources.notes > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isComplete ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                  <BookOpen className="w-3 h-3" /> {chapter.resources.notes} Notes
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-1 lg:col-span-2 py-12 text-center bg-white border border-gray-200 border-dashed rounded-3xl">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No chapters found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Floating AI Doubt Button */}
        <button 
          onClick={() => router.push(`/dashboard/student/doubts?subject=${activeSubjectData?.name || 'General'}`)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-slate-900 hover:bg-purple-600 text-white rounded-full px-5 py-3.5 md:py-4 md:px-6 shadow-2xl hover:shadow-purple-600/30 transition-all duration-300 flex items-center gap-3 z-50 group transform hover:-translate-y-1"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 absolute -top-1 -right-2 text-amber-300 animate-pulse" />
          </div>
          <span className="font-extrabold text-sm md:text-base hidden sm:block pr-1 group-hover:pr-2 transition-all">Ask AI</span>
        </button>

      </div>
      
      {/* Custom Scrollbar Styles for the scrollable container */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB; 
        }
      `}} />
    </DashboardLayout>
  );
}
