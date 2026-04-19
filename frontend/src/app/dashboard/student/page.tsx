"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  PlayCircle, 
  Award, 
  CheckSquare, 
  Flame,
  Calendar,
  ClipboardList,
  Video,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [question, setQuestion] = useState("");

  const getSubjectIcon = (subject: string) => {
    if (!subject) return '📚';
    if (subject.toLowerCase().includes('math')) return '➗';
    if (subject.toLowerCase().includes('science')) return '🔬';
    if (subject.toLowerCase().includes('logical')) return '🧩';
    return '📚';
  };

  const getSubjectColor = (subject: string) => {
    if (!subject) return 'bg-blue-100 text-blue-700';
    if (subject.toLowerCase().includes('math')) return 'bg-purple-100 text-purple-700';
    if (subject.toLowerCase().includes('science')) return 'bg-emerald-100 text-emerald-700';
    if (subject.toLowerCase().includes('logical')) return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch latest Live Classes
      const { data: classesData } = await supabase.from('live_classes').select('*').order('id', { ascending: false }).limit(3);
      if (classesData) setClasses(classesData);

      // Fetch latest Materials
      const { data: materialsData } = await supabase.from('trainer_materials').select('*').order('id', { ascending: false }).limit(3);
      if (materialsData) setMaterials(materialsData);

      // Fetch recommended practice papers
      const { data: recommendedData } = await supabase.from('practice_papers').select('*').limit(2);
      if (recommendedData) setRecommended(recommendedData);
      
      // Fetch dynamic analytics from student_test_results
      const { data: testResults } = await supabase.from('student_test_results').select('*').eq('student_name', 'Aarav Sharma');
      
      let avgScore = 0;
      let testsAttempted = 0;
      
      if (testResults && testResults.length > 0) {
        testsAttempted = testResults.length;
        const totalScore = testResults.reduce((acc, curr) => acc + curr.score, 0);
        const totalQuestions = testResults.reduce((acc, curr) => acc + curr.total_questions, 0);
        avgScore = Math.round((totalScore / totalQuestions) * 100) || 0;
      }
      
      setResults({
        overview: {
          streak: 12, // Still mock for demo purposes
          testsAttempted: testsAttempted,
          globalRank: 142, // Mock rank
          averageScore: avgScore
        }
      });
    };
    
    fetchData();
  }, []);

  return (
    <DashboardLayout 
      role="student" 
      userName="Aarav Sharma" 
      userDescription="Class 8 • Delhi Public School"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, Aarav! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">Let's continue your Olympiad preparation today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Study Streak</p>
            <p className="text-2xl font-bold text-gray-900">{results?.overview?.streak || "..."} Days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Tests Attempted</p>
            <p className="text-2xl font-bold text-gray-900">{results?.overview?.testsAttempted || "..."}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Current Rank</p>
            <p className="text-2xl font-bold text-gray-900">#{results?.overview?.globalRank || "..."}</p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{results?.overview?.averageScore || "..."}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
              <Link href="/dashboard/student/materials" className="text-sm text-brand font-medium hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materials.length > 0 ? (
                materials.map((item, idx) => {
                  const progress = (item.id * 15 + 30) % 100 + 10; // Pseudo-random progress
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full">
                      <div className={`${getSubjectColor(item.subject)} text-xs font-semibold px-2 py-1 rounded w-fit mb-4`}>{item.subject}</div>
                      <div className="h-20 flex items-center justify-center mb-4">
                         <div className="text-5xl">{getSubjectIcon(item.subject)}</div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 flex-grow">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-4">{item.class_grade} • {item.type}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                        <div className="bg-brand h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{progress}% Complete</p>
                      <Link href="/dashboard/student/materials" className="w-full bg-brand text-white text-sm font-medium py-2 rounded-xl group-hover:bg-brand-hover transition-colors mt-auto text-center block">
                        Continue Study
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-2xl">
                  No ongoing materials found. Start learning!
                </div>
              )}
            </div>
          </section>

          {/* Recommended for You */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
              <Link href="/dashboard/student/practice" className="text-sm text-brand font-medium hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {recommended.length > 0 ? (
                recommended.map((item, idx) => {
                  const isVideo = idx % 2 !== 0; // Alternate between Practice Test and Video Lesson for visual variety
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer flex gap-5">
                      <div className={`w-24 h-24 rounded-xl flex items-center justify-center shrink-0 ${isVideo ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                        {isVideo ? <Video className="w-10 h-10 text-blue-600" /> : <ClipboardList className="w-10 h-10 text-yellow-600" />}
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <div className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide">
                          {isVideo ? 'Video Lesson' : 'Practice Test'}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-3">{item.total_questions || 20} Questions • {item.difficulty || 'Medium'}</p>
                        <Link href={isVideo ? "/dashboard/student/materials" : `/dashboard/student/take-test/${item.id}`} className="text-sm text-brand font-bold flex items-center gap-1 group-hover:text-brand-hover transition-colors mt-auto w-fit">
                          {isVideo ? 'Watch Now' : 'Start Test'} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-2xl">
                  No recommendations available at the moment.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Schedule</h2>
              <Link href="/dashboard/student/classes" className="text-sm text-brand font-medium hover:underline">View Calendar</Link>
            </div>
            
            <div className="space-y-4">
              {classes.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">Loading schedule...</div>
              ) : (
                classes.map((cls, idx) => {
                  const Icon = idx === 0 ? PlayCircle : (idx === 1 ? CheckSquare : Award);
                  const color = idx === 0 ? "text-purple-600" : (idx === 1 ? "text-emerald-600" : "text-blue-600");
                  const bg = idx === 0 ? "bg-purple-50" : (idx === 1 ? "bg-emerald-50" : "bg-blue-50");
                  
                  return (
                    <Link href={`/dashboard/student/live-class/${cls.id}`} key={cls.id} className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors">
                      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-brand transition-colors">{cls.status === 'upcoming' ? 'Live Class: ' : ''}{cls.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{cls.date}, {cls.time}</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          <section className="bg-purple-50 border border-purple-100 rounded-3xl p-8">
             <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#F3F0FF"/>
                    {/* Ears */}
                    <path d="M12 24C10.8954 24 10 24.8954 10 26V30C10 31.1046 10.8954 32 12 32" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M36 24C37.1046 24 38 24.8954 38 26V30C38 31.1046 37.1046 32 36 32" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round"/>
                    {/* Antenna Base & Line */}
                    <path d="M24 16L24 12" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round"/>
                    {/* Antenna Top */}
                    <circle cx="24" cy="11" r="2" fill="#5B21B6"/>
                    {/* Head */}
                    <rect x="12" y="16" width="24" height="20" rx="8" fill="#5B21B6"/>
                    {/* Eyes */}
                    <circle cx="18" cy="24" r="2.5" fill="white"/>
                    <circle cx="30" cy="24" r="2.5" fill="white"/>
                    {/* Mouth */}
                    <path d="M22 30H26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                   <h3 className="font-extrabold text-gray-900 text-xl flex items-center gap-3">
                     Ask EduOlympia AI 
                     <span className="bg-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded-md font-bold">BETA</span>
                   </h3>
                   <p className="text-sm text-gray-500 mt-1.5">Have a doubt? Ask our AI Assistant!</p>
                </div>
             </div>
             
             <div className="flex gap-3">
               <input 
                 type="text" 
                 value={question}
                 onChange={(e) => setQuestion(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && question) {
                     router.push(`/dashboard/student/doubts?q=${encodeURIComponent(question)}`);
                   }
                 }}
                 placeholder="Type your question here..." 
                 className="flex-1 text-base text-gray-900 bg-white px-5 py-4 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand" 
               />
               <button 
                 onClick={() => {
                   if (question) router.push(`/dashboard/student/doubts?q=${encodeURIComponent(question)}`);
                 }}
                 className="bg-brand text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-brand-hover shadow-md transition-colors"
               >
                 Ask
               </button>
             </div>
             <p className="text-xs text-gray-500 mt-4 text-center font-medium">Try: "Explain Pythagoras Theorem" or "What is photosynthesis?"</p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
