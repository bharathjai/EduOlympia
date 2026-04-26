"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { 
  FileText, Play, CheckCircle2, Clock, Calendar, 
  AlertCircle, Trophy, Sparkles, Filter, Award, ChevronRight
} from "lucide-react";

// --- MOCK DATA ---
const mockPapers = [
  { id: '1', title: 'Math Mock Test 4', subject: 'Mathematics', type: 'assigned', questions: 30, timeLimit: 45, difficulty: 'Hard', status: 'new', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  { id: '2', title: 'Science Chapter 3', subject: 'Science', type: 'assigned', questions: 15, timeLimit: 20, difficulty: 'Medium', status: 'in-progress', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { id: '3', title: 'Logical Reasoning Basics', subject: 'Logical Reasoning', type: 'open', questions: 20, timeLimit: null, difficulty: 'Easy', status: 'completed', score: 85 },
  { id: '4', title: 'Algebra Fundamentals', subject: 'Mathematics', type: 'open', questions: 25, timeLimit: null, difficulty: 'Medium', status: 'new' },
  { id: '5', title: 'Physics Kinematics', subject: 'Science', type: 'assigned', questions: 40, timeLimit: 60, difficulty: 'Hard', status: 'completed', score: 92 },
  { id: '6', title: 'General Intelligence Set 1', subject: 'General', type: 'open', questions: 50, timeLimit: null, difficulty: 'Hard', status: 'completed', score: 68 },
];

type FilterTab = 'all' | 'assigned' | 'open' | 'completed';

export default function PracticeTestsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPapers = useMemo(() => {
    return mockPapers.filter(paper => {
      if (activeTab === 'all') return true;
      if (activeTab === 'assigned') return paper.type === 'assigned' && paper.status !== 'completed';
      if (activeTab === 'open') return paper.type === 'open' && paper.status !== 'completed';
      if (activeTab === 'completed') return paper.status === 'completed';
      return true;
    });
  }, [activeTab]);

  const completedPapers = mockPapers.filter(p => p.status === 'completed');
  const averageScore = completedPapers.length > 0 
    ? Math.round(completedPapers.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedPapers.length) 
    : 0;

  const allAssignedCompleted = activeTab === 'assigned' && filteredPapers.length === 0 && mockPapers.some(p => p.type === 'assigned');

  return (
    <DashboardLayout 
      role="student" 
      userName="Arjun Sharma" 
      userDescription="Class 8 • Delhi Public School"
      studentPendingPracticeCount={2}
    >
      <div className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Practice Tests</h1>
            <p className="text-gray-500 font-medium mt-2 max-w-2xl">Sharpen your skills with assigned mock tests and open practice sets.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 flex flex-wrap gap-1 mb-8">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'all' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            All Tests
          </button>
          <button 
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'assigned' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Assigned
          </button>
          <button 
            onClick={() => setActiveTab('open')}
            className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'open' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Open Practice
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'completed' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <CheckCircle2 className={`w-4 h-4 ${activeTab === 'completed' ? 'text-teal-600' : 'text-gray-400'}`} /> Completed
          </button>
        </div>

        {/* Score Summary Bar (Visible only on Completed tab) */}
        {activeTab === 'completed' && completedPapers.length > 0 && !isLoading && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold mb-1">Performance Summary</h2>
                <p className="text-gray-300 font-medium">Average score across {completedPapers.length} completed tests</p>
              </div>
            </div>
            <div className="text-center sm:text-right bg-white/10 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <span className="block text-3xl font-black text-amber-400">{averageScore}%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Average</span>
            </div>
          </div>
        )}

        {/* All Assigned Completed Banner */}
        {allAssignedCompleted && !isLoading && (
           <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm animate-in zoom-in-95 duration-500">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
               <Award className="w-8 h-8" />
             </div>
             <div className="text-center sm:text-left">
               <h3 className="text-xl font-bold text-emerald-900 mb-1">You have completed all assigned practice tests!</h3>
               <p className="text-emerald-700 font-medium">Well done! Check the Open Practice tab to keep sharpening your skills.</p>
             </div>
             <button 
               onClick={() => setActiveTab('open')}
               className="sm:ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
             >
               View Open Practice <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        )}

        {/* Practice Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton Loader
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col h-72">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg mb-8"></div>
                <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                  <div className="h-10 bg-gray-100 rounded-xl"></div>
                  <div className="h-10 bg-gray-100 rounded-xl"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
              </div>
            ))
          ) : filteredPapers.length === 0 && !allAssignedCompleted ? (
            // Empty State
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white border border-gray-200 border-dashed rounded-3xl">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No practice tests found</h3>
              <p className="text-gray-500 font-medium max-w-md">
                {activeTab === 'assigned' 
                  ? 'Your trainer will assign tests here soon. Check Open Practice in the meantime!' 
                  : activeTab === 'completed'
                  ? 'You haven\'t completed any tests yet. Time to get started!'
                  : 'There are no practice tests available in this category right now.'}
              </p>
            </div>
          ) : (
            // Render Cards
            filteredPapers.map((paper) => {
              // Status Badge Logic
              let statusBadge = null;
              if (paper.status === 'completed') {
                statusBadge = (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white rotate-12 z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Score</span>
                    <span className="font-black text-lg leading-none">{paper.score}%</span>
                  </div>
                );
              } else if (paper.status === 'in-progress') {
                statusBadge = (
                  <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-orange-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span> In Progress
                  </div>
                );
              } else if (paper.status === 'new') {
                statusBadge = (
                  <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> New
                  </div>
                );
              }

              // Difficulty Colors
              const diffColors = {
                Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                Medium: 'bg-amber-50 text-amber-700 border-amber-200',
                Hard: 'bg-rose-50 text-rose-700 border-rose-200'
              };

              // Due date string
              const getDueString = () => {
                if (!mounted || !paper.dueDate) return '';
                const diff = paper.dueDate.getTime() - Date.now();
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                if (days < 0) return 'Overdue';
                if (days === 0) return 'Due today';
                return `Due in ${days} days`;
              };

              const isDueSoon = mounted && paper.dueDate && (paper.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 3;

              return (
                <div key={paper.id} className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 transition-all duration-300 relative flex flex-col h-full group ${paper.status === 'completed' ? 'border-gray-200 hover:border-emerald-300 hover:shadow-emerald-500/10' : 'border-gray-100 hover:border-teal-300 hover:shadow-teal-500/10 hover:-translate-y-1'}`}>
                  
                  {statusBadge}
                  
                  <div className="flex flex-col gap-2 mb-6 pr-16">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md w-fit">
                      {paper.subject}
                    </span>
                    <h3 className={`font-extrabold text-xl leading-tight ${paper.status === 'completed' ? 'text-gray-700' : 'text-gray-900 group-hover:text-teal-700 transition-colors'}`}>
                      {paper.title}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Questions</span>
                      </div>
                      <p className="font-bold text-gray-900">{paper.questions} Qs</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Time Limit</span>
                      </div>
                      <p className="font-bold text-gray-900">{paper.timeLimit ? `${paper.timeLimit} mins` : 'Open'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${diffColors[paper.difficulty as keyof typeof diffColors]}`}>
                      {paper.difficulty}
                    </span>
                    
                    {paper.type === 'assigned' && paper.dueDate && paper.status !== 'completed' && (
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDueSoon ? 'text-red-500' : 'text-gray-500'}`}>
                        {isDueSoon && <AlertCircle className="w-3.5 h-3.5" />}
                        {getDueString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  {paper.status === 'completed' ? (
                    <Link 
                      href={`/dashboard/student/results/${paper.id}`}
                      className="w-full bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      Review Answers <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link 
                      href={`/dashboard/student/take-test/${paper.id}`}
                      className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-lg ${
                        paper.status === 'in-progress' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                          : 'bg-slate-900 hover:bg-teal-700 text-white group-hover:shadow-teal-700/20'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current ml-1" />
                      {paper.status === 'in-progress' ? 'Resume Test' : 'Start Test'}
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
