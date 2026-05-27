"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
  BookOpen, ClipboardList, Calendar, Sparkles, TrendingUp,
  Award, CheckSquare, Clock, Video, ArrowRight, Play, CheckCircle2, History, FileText
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import AIAssistantRobot from "@/components/AIAssistantRobot";

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  
  // Mock Data aligned with S-02 specifications
  const userName = "Arjun";
  const userInitial = "A";
  
  const isFirstLogin = false; // toggle for testing
  
  const [stats, setStats] = useState({
    subjectsEnrolled: 4,
    practiceTests: 12,
    examRank: 42 as number | string,
    attendance: 94
  });

  const [liveClassIds, setLiveClassIds] = useState<string[]>([]);
  const [liveClass, setLiveClass] = useState<any>(null);

  useEffect(() => {
    const fetchLiveClass = async () => {
      const { data, error } = await supabase.from('live_classes').select('*').order('id', { ascending: true }).limit(1);
      if (!error && data && data.length > 0) {
        const cls = data[0];
        setLiveClass({
          trainerName: "Rahul Singh",
          subject: cls.title,
          time: cls.time || "10:00 AM",
          id: cls.id
        });
        if (cls.status === 'live') {
          setLiveClassIds(prev => Array.from(new Set([...prev, String(cls.id)])));
        }
      } else {
        // Fallback Mock Live Class
        setLiveClass({
          trainerName: "Mr. Sharma",
          subject: "Advanced Algebra",
          time: new Date(Date.now() + 2 * 60 * 60 * 1000),
          id: 201
        });
      }
    };
    fetchLiveClass();
  }, []);

  useEffect(() => {
    const updateLiveClasses = () => {
      try {
        const active = JSON.parse(localStorage.getItem('eduolympia_live_classes') || '{}');
        setLiveClassIds(Object.keys(active));
      } catch (e) {
        console.error(e);
      }
    };
    updateLiveClasses();
    window.addEventListener('storage', updateLiveClasses);
    return () => {
      window.removeEventListener('storage', updateLiveClasses);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    
    const fetchStats = async () => {
      const { count: subjectsCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
      const { count: practiceCount } = await supabase.from('tests').select('*', { count: 'exact', head: true });
      const { count: resultsCount } = await supabase.from('results').select('*', { count: 'exact', head: true });

      if (isMounted) {
        setStats(prev => ({
          ...prev,
          subjectsEnrolled: subjectsCount || prev.subjectsEnrolled,
          practiceTests: practiceCount || prev.practiceTests,
          examRank: resultsCount ? Math.max(1, 42 - resultsCount) : prev.examRank,
        }));
      }
    };

    fetchStats();

    const subjectsSub = supabase.channel('student-subjects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, () => { fetchStats(); })
      .subscribe();

    const testsSub = supabase.channel('student-tests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tests' }, () => { fetchStats(); })
      .subscribe();

    const resultsSub = supabase.channel('student-results-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, () => { fetchStats(); })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subjectsSub);
      supabase.removeChannel(testsSub);
      supabase.removeChannel(resultsSub);
    };
  }, []);

  const upcomingExam = isFirstLogin ? null : {
    name: "National Math Olympiad",
    subject: "Mathematics",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    id: 101
  };



  const pendingPractice = isFirstLogin ? [] : [
    { id: 301, title: "Math Mock Test 4", subject: "Mathematics" },
    { id: 302, title: "Science Chapter 3", subject: "Science" }
  ];

  const recentActivity = isFirstLogin ? [] : [
    { id: 1, action: "Completed Chapter 3 notes", time: "2 hours ago", type: "material", link: "/dashboard/student/materials" },
    { id: 2, action: "Scored 78% on Mock 2", time: "Yesterday", type: "test", link: "/dashboard/student/results" },
    { id: 3, action: "Attended Physics Live Class", time: "2 days ago", type: "class", link: "/dashboard/student/classes" }
  ];

  // Helper to determine border color for exam
  const getExamBorderColor = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 48) return "border-red-500 shadow-red-500/20";
    if (hours < 7 * 24) return "border-orange-500 shadow-orange-500/20";
    return "border-blue-500 shadow-blue-500/20";
  };

  const getExamTimerString = (date: Date) => {
    const diff = Math.max(0, date.getTime() - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} Days to go`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} Hours to go`;
  };

  // Helper to check if class is joinable (< 10 mins OR active)
  const isClassJoinable = (id: string | number, date: Date) => {
    if (liveClassIds.includes(String(id))) return true;
    const diffMins = (date.getTime() - Date.now()) / (1000 * 60);
    return diffMins <= 10 && diffMins > -60; // Assuming class lasts an hour
  };

  return (
    <DashboardLayout 
      role="student" 
      userName="Arjun Sharma" 
      userDescription="Class 8 • Delhi Public School"
      studentPendingPracticeCount={pendingPractice.length}
    >
      <div className="pb-12 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Good morning, {userName}! <span className="animate-bounce origin-bottom-right">👋</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {isFirstLogin ? "Start by exploring the Content Library." : upcomingExam ? `You have 1 exam in ${mounted ? Math.floor((upcomingExam.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : '...'} days.` : "No exams scheduled. Keep practising!"}
            </p>
          </div>
          {!isFirstLogin && upcomingExam && (
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/student/practice?subject=${upcomingExam.subject}`} className="flex items-center gap-2 px-5 py-3 bg-[#0D7377] text-white rounded-2xl text-sm font-bold hover:bg-teal-800 transition-all duration-300 shadow-lg shadow-teal-700/20 hover:scale-[1.02] hover:-translate-y-0.5">
                <ArrowRight className="w-4 h-4" /> Prepare Now
              </Link>
            </div>
          )}
        </div>
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Card 1 */}
           <Link href="/dashboard/student/materials" className="bg-white hover:bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300/60 transition-all duration-300 ease-out relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100/50">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">Curriculum</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{stats.subjectsEnrolled}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">Subjects Enrolled</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 w-full">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Current Semester</span>
                  <span className="text-blue-600">4 Active</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-2/3 group-hover:bg-blue-600 transition-all"></div>
                </div>
              </div>
           </Link>
           
           {/* Card 2 */}
           <Link href="/dashboard/student/practice" className="bg-white hover:bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-300/60 transition-all duration-300 ease-out relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm border border-teal-100/50">
                    <CheckSquare className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 group-hover:bg-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">Completed</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{stats.practiceTests}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">Practice Tests</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 w-full">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Target Progress</span>
                  <span className="text-teal-600">80% Done</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[80%] group-hover:bg-teal-600 transition-all"></div>
                </div>
              </div>
           </Link>
           
           {/* Card 3 */}
           <Link href="/dashboard/student/results" className="bg-white hover:bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-300/60 transition-all duration-300 ease-out relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm border border-amber-100/50">
                    <TrendingUp className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 group-hover:bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">Percentile</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{stats.examRank === "-" ? "-" : `#${stats.examRank}`}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">Exam Rank</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 w-full">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Global Standing</span>
                  <span className="text-amber-600">Top 10%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[90%] group-hover:bg-amber-600 transition-all"></div>
                </div>
              </div>
           </Link>
           
           {/* Card 4 */}
           <div className="bg-white hover:bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-300/60 transition-all duration-300 ease-out relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100/50">
                    <Clock className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">Consistency</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{stats.attendance}%</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">Attendance Rate</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 w-full">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Class Presence</span>
                  <span className="text-purple-600">Excellent</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[94%] group-hover:bg-purple-600 transition-all"></div>
                </div>
              </div>
           </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column (Exam, Quick Access, Pending) */}
           <div className="lg:col-span-7 space-y-8">
              {/* Upcoming Exam */}
              <section>
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5"><Award className="w-5.5 h-5.5 text-[#0D7377]"/> Upcoming Exam</h2>
                 {upcomingExam ? (
                   <div className="bg-[#0D7377] rounded-[32px] p-6 sm:p-8 border border-teal-600/35 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                        <div>
                           <div className="bg-white/10 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-widest w-fit mb-4 flex items-center gap-1.5 border border-white/10 backdrop-blur-sm">
                             <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
                             {mounted ? getExamTimerString(upcomingExam.date) : 'Loading...'}
                           </div>
                           <h3 className="text-2xl sm:text-3.5xl font-black text-white mb-2 tracking-tight">{upcomingExam.name}</h3>
                           <p className="text-slate-200 font-semibold flex flex-wrap items-center gap-2 text-sm mt-3">
                             <span className="bg-white/15 text-white px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider backdrop-blur-sm border border-white/10">{upcomingExam.subject}</span>
                             <span className="text-white/30 font-light">|</span>
                             <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                               <Calendar className="w-4 h-4 text-white/80" />
                               {upcomingExam.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                             </span>
                           </p>
                        </div>
                        <Link href={`/dashboard/student/practice?subject=${upcomingExam.subject}`} className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 rounded-2xl text-center transition-all shadow-lg shrink-0 flex items-center justify-center gap-2 duration-300 hover:scale-[1.03] active:scale-98">
                          Prepare Now <ArrowRight className="w-4 h-4"/>
                        </Link>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-slate-50 border border-dashed border-slate-300/80 rounded-[32px] p-10 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                        <Award className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No exams scheduled</h3>
                      <p className="text-slate-500 font-medium mt-1">Keep practising to stay sharp!</p>
                   </div>
                 )}
              </section>

              {/* Pending Practice */}
              <section>
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5"><CheckSquare className="w-5.5 h-5.5 text-[#0D7377]"/> Pending Practice</h2>
                 {pendingPractice.length > 0 ? (
                    <div className="space-y-3.5">
                      {pendingPractice.map((practice, idx) => (
                        <div key={practice.id} className="bg-white border border-slate-200/60 rounded-3xl p-4.5 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:shadow-teal-500/5 hover:border-teal-200/70 group">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-teal-50 group-hover:text-[#0D7377] group-hover:border-teal-100 transition-all duration-300 shadow-sm">
                               <FileText className="w-6 h-6" />
                             </div>
                             <div>
                               <h4 className="font-bold text-slate-800 text-[15px] group-hover:text-[#0D7377] transition-colors leading-tight mb-1">{practice.title}</h4>
                               <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                 <span className="text-slate-500">{practice.subject}</span>
                                 <span>•</span>
                                 <span>45 Mins</span>
                                 <span>•</span>
                                 <span>30 Questions</span>
                               </p>
                             </div>
                           </div>
                           <Link href={`/dashboard/student/take-test/${practice.id}`} className="bg-[#0D7377] hover:bg-teal-800 text-white font-bold px-5.5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-teal-700/10 shrink-0 hover:scale-[1.02] active:scale-98">
                             Start Test
                           </Link>
                        </div>
                      ))}
                    </div>
                 ) : (
                   <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 flex items-center gap-5">
                     <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-emerald-950">You are all caught up!</h3>
                       <p className="text-emerald-700 font-semibold mt-0.5 text-sm">No pending practice papers. Great job.</p>
                     </div>
                   </div>
                 )}
              </section>

              {/* Quick Access Tiles (2x2 Grid) */}
              <section>
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5"><Sparkles className="w-5.5 h-5.5 text-[#0D7377]"/> Quick Access</h2>
                 <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <Link href="/dashboard/student/materials" className="bg-white border border-slate-200/70 p-6 sm:p-7 rounded-[28px] hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center group">
                       <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100/50">
                          <BookOpen className="w-6.5 h-6.5" />
                       </div>
                       <h4 className="font-extrabold text-slate-800 text-sm tracking-tight group-hover:text-blue-600 transition-colors">Content Library</h4>
                       <p className="text-[11px] text-slate-400 mt-1 font-bold">Access notes & materials</p>
                    </Link>
                    <Link href="/dashboard/student/practice" className="bg-white border border-slate-200/70 p-6 sm:p-7 rounded-[28px] hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center group">
                       <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm border border-teal-100/50">
                          <ClipboardList className="w-6.5 h-6.5" />
                       </div>
                       <h4 className="font-extrabold text-slate-800 text-sm tracking-tight group-hover:text-teal-600 transition-colors">Practice Tests</h4>
                       <p className="text-[11px] text-slate-400 mt-1 font-bold">Test your capabilities</p>
                    </Link>
                    <Link href="/dashboard/student/exams" className="bg-white border border-slate-200/70 p-6 sm:p-7 rounded-[28px] hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center group">
                       <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100/50">
                          <Calendar className="w-6.5 h-6.5" />
                       </div>
                       <h4 className="font-extrabold text-slate-800 text-sm tracking-tight group-hover:text-purple-600 transition-colors">My Exams</h4>
                       <p className="text-[11px] text-slate-400 mt-1 font-bold">Olympiad schedules</p>
                    </Link>
                    <Link href="/dashboard/student/doubts" className="bg-amber-50/20 border border-amber-250/70 p-6 sm:p-7 rounded-[28px] hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                       <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-sm">Ask AI</div>
                       <div className="w-14 h-14 bg-white text-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-md border border-amber-100">
                          <Sparkles className="w-6.5 h-6.5" />
                       </div>
                       <h4 className="font-extrabold text-amber-900 text-sm tracking-tight">Doubt Chat</h4>
                       <p className="text-[11px] text-amber-700/70 mt-1 font-bold">24/7 AI Assistance</p>
                    </Link>
                 </div>
              </section>

           </div>

           {/* Right Column (Live Class, Recent Activity) */}
           <div className="lg:col-span-5 space-y-8">
               
               {/* Next Live Class Card */}
               <section>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5"><Video className="w-5.5 h-5.5 text-[#0D7377]"/> Next Live Class</h2>
                  {liveClass ? (
                    <div className={`bg-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group border transition-all duration-300 ${liveClassIds.includes(String(liveClass.id)) ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-800/80'}`}>
                       <div className="relative z-10">
                          <div className="bg-white/10 w-fit backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase mb-6 flex items-center gap-2 border border-white/15">
                            {liveClassIds.includes(String(liveClass.id)) ? (
                              <>
                                <span className="relative flex h-2 w-2 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Live Now
                              </>
                            ) : (
                              <>
                                <span className="relative flex h-2 w-2 rounded-full bg-slate-500"></span>
                                Upcoming Class
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mb-7">
                             <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-white/20 shrink-0 shadow-md">
                                {liveClass.trainerName.charAt(0)}
                             </div>
                             <div>
                                <h3 className="font-extrabold text-[17px] leading-tight mb-1 group-hover:text-teal-300 transition-colors">{liveClass.subject}</h3>
                                <p className="text-slate-400 text-xs font-semibold">with {liveClass.trainerName}</p>
                             </div>
                          </div>
                          
                          <div className="bg-white/[0.04] rounded-2xl p-4 sm:p-5 flex items-center justify-between backdrop-blur-md border border-white/[0.06] mb-6">
                             <div className="flex items-center gap-3">
                                <Clock className="w-5.5 h-5.5 text-purple-400" />
                                <div>
                                   <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Scheduled For</p>
                                   <p className="font-bold text-base text-white tracking-tight" suppressHydrationWarning>
                                      {typeof liveClass.time === 'string' ? liveClass.time : liveClass.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                   </p>
                                 </div>
                             </div>
                          </div>

                          <button 
                            className={`w-full py-4 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 transition-all duration-300 shadow-xl ${
                              (mounted && isClassJoinable(liveClass.id, liveClass.time))
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/10 hover:scale-[1.02] hover:-translate-y-0.5' 
                                : 'bg-white/5 text-slate-400 cursor-not-allowed border border-white/5 hover:bg-white/10'
                            }`}
                            disabled={!mounted || !isClassJoinable(liveClass.id, liveClass.time)}
                            onClick={() => window.open(`/dashboard/student/live-class/${liveClass.id}`, '_blank')}
                          >
                            {mounted ? (
                              isClassJoinable(liveClass.id, liveClass.time) ? (
                                <><Play className="w-4 h-4 fill-current animate-bounce" /> Join Class Now</>
                              ) : (
                                typeof liveClass.time === 'string'
                                  ? 'Upcoming Class'
                                  : 'Join active ' + Math.ceil(Math.abs((liveClass.time.getTime() - Date.now()) / (1000 * 60))) + ' mins prior'
                              )
                            ) : (
                              'Loading...'
                            )}
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300/80 rounded-[32px] p-10 text-center">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                         <Video className="w-8 h-8 text-slate-400" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-800">No upcoming classes</h3>
                       <p className="text-slate-500 font-medium mt-1">Check back later for new schedules.</p>
                    </div>
                  )}
               </section>

               {/* Recent Activity */}
               <section>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5"><History className="w-5.5 h-5.5 text-[#0D7377]"/> Recent Activity</h2>
                  <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm">
                    {recentActivity.length > 0 ? (
                      <div className="relative border-l border-slate-100 ml-3.5 space-y-6 pb-2">
                        {recentActivity.map((activity, idx) => (
                          <div key={activity.id} className="relative pl-7 group">
                            <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ${
                              activity.type === 'test' ? 'bg-amber-400 ring-4 ring-amber-400/5' : activity.type === 'material' ? 'bg-blue-400 ring-4 ring-blue-400/5' : 'bg-purple-400 ring-4 ring-purple-400/5'
                            }`}></div>
                            <Link href={activity.link} className="block p-3 hover:bg-slate-50/70 rounded-2xl transition-all duration-200">
                              <h4 className="font-bold text-slate-800 text-[14.5px] group-hover:text-[#0D7377] transition-colors leading-tight mb-1">{activity.action}</h4>
                              <p className="text-xs text-slate-400 font-bold">{activity.time}</p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                           <History className="w-8 h-8 text-slate-350" />
                         </div>
                         <p className="text-slate-500 font-semibold text-sm">No recent activity yet.</p>
                      </div>
                    )}
                  </div>
               </section>

           </div>
        </div>
      </div>
      <AIAssistantRobot userName={userName} />
    </DashboardLayout>
  );
}
