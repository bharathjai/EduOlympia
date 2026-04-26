"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, Play, FileText, BookOpen, 
  Sparkles, CheckCircle2, MessageSquare, Download, ZoomIn, ZoomOut,
  Settings, RefreshCw, Maximize, Video
} from "lucide-react";

// --- MOCK DATA ---
const mockChapter = {
  id: "m2",
  title: "Algebra & Equations",
  subject: "Mathematics",
  chapterNumber: 2,
  nextChapterId: "m3",
  nextChapterTitle: "Geometry Basics",
  resources: {
    notes: { 
      available: true,
      content: `...`
    },
    video: { 
      available: true,
      title: "Introduction to Linear Equations"
    },
    pdf: { 
      available: true, 
      filename: "Algebra_Worksheet_Ch2.pdf",
      filesize: "2.4 MB"
    }
  }
};

export default function ChapterDetail() {
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<"notes" | "video" | "pdf" | "ai">("notes");
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  
  // Notes State
  const [fontSize, setFontSize] = useState(16);
  
  // Video State
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  
  // AI State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);

  const totalResources = (mockChapter.resources.notes.available ? 1 : 0) + 
                         (mockChapter.resources.video.available ? 1 : 0) + 
                         (mockChapter.resources.pdf.available ? 1 : 0);
                         
  const progressPercentage = Math.round((completedResources.size / totalResources) * 100) || 0;
  const isChapterComplete = completedResources.size === totalResources;

  // Actions
  const markAsComplete = (resourceId: string) => {
    setCompletedResources(prev => {
      const newSet = new Set(prev);
      newSet.add(resourceId);
      return newSet;
    });
  };

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
      if (progress > 90) {
        markAsComplete('video');
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
      setShowSpeedMenu(false);
    }
  };

  const generateAISummary = () => {
    setIsAILoading(true);
    // Simulate API call
    setTimeout(() => {
      setAiSummary({
        keyPoints: [
          "Algebra uses letters (variables) to represent unknown numbers.",
          "An equation shows that two mathematical expressions are equal.",
          "The golden rule of equations: Whatever you do to one side, you must do to the other.",
          "To solve for a variable, isolate it by performing inverse operations."
        ],
        glossary: [
          { term: "Variable", definition: "A symbol, usually a letter, that represents an unknown numerical value." },
          { term: "Constant", definition: "A fixed numerical value." },
          { term: "Coefficient", definition: "A number multiplied by a variable (e.g., the '3' in 3x)." },
          { term: "Term", definition: "A single mathematical expression (a number, a variable, or numbers and variables multiplied together)." }
        ]
      });
      setIsAILoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (activeTab === 'ai' && !aiSummary && !isAILoading) {
      generateAISummary();
    }
  }, [activeTab]);

  return (
    <DashboardLayout 
      role="student" 
      userName="Arjun Sharma" 
      userDescription="Class 8 • Delhi Public School"
    >
      <div className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-6 shrink-0">
          <Link href="/dashboard/student/materials" className="hover:text-blue-600 transition-colors">Mathematics</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
          <Link href="/dashboard/student/materials" className="hover:text-blue-600 transition-colors">Chapter {mockChapter.chapterNumber}</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-bold truncate">Resources</span>
        </nav>

        {/* Chapter Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg">Chapter {mockChapter.chapterNumber}</span>
              {isChapterComplete && <span className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Complete</span>}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{mockChapter.title}</h1>
          </div>
          
          <div className="w-full md:w-64 shrink-0 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-gray-600">Progress</span>
              <span className={isChapterComplete ? "text-emerald-600" : "text-blue-600"}>{completedResources.size} of {totalResources}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isChapterComplete ? 'bg-emerald-500' : 'bg-blue-600'}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Chapter Floating Arrow (Appears when complete) */}
        {isChapterComplete && (
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block animate-in slide-in-from-right fade-in duration-500">
            <button 
              onClick={() => router.push(`/dashboard/student/materials/${mockChapter.nextChapterId}`)}
              className="bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-300 shadow-xl rounded-2xl p-4 flex flex-col items-center gap-2 group transition-all hover:scale-105"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="text-center w-24">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Up Next</p>
                <p className="text-xs font-bold text-gray-900 leading-tight mt-1">{mockChapter.nextChapterTitle}</p>
              </div>
            </button>
          </div>
        )}

        {/* Content Viewer Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Resource Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 custom-scrollbar shrink-0">
            {mockChapter.resources.notes.available && (
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors shrink-0 ${
                  activeTab === 'notes' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${completedResources.has('notes') ? 'text-emerald-500' : ''}`} />
                Notes
                {completedResources.has('notes') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
              </button>
            )}
            
            {mockChapter.resources.video.available && (
              <button 
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors shrink-0 ${
                  activeTab === 'video' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Play className={`w-4 h-4 ${completedResources.has('video') ? 'text-emerald-500' : ''}`} />
                Video Lesson
                {completedResources.has('video') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
              </button>
            )}

            {mockChapter.resources.pdf.available && (
              <button 
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors shrink-0 ${
                  activeTab === 'pdf' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${completedResources.has('pdf') ? 'text-emerald-500' : ''}`} />
                PDF Worksheet
                {completedResources.has('pdf') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
              </button>
            )}

            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors shrink-0 ${
                activeTab === 'ai' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-gray-500 hover:text-purple-600 hover:bg-purple-50/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Summary
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="flex-1 bg-gray-50 relative overflow-hidden flex flex-col">
            
            {/* --- NOTES TAB --- */}
            {activeTab === 'notes' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative flex flex-col items-center">
                
                {/* Tools */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex gap-2 bg-white border border-gray-200 shadow-sm rounded-xl p-1 z-10">
                   <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Decrease Font Size">
                     <ZoomOut className="w-5 h-5" />
                   </button>
                   <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Increase Font Size">
                     <ZoomIn className="w-5 h-5" />
                   </button>
                </div>

                <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 min-h-full flex flex-col">
                  {/* Mock rendered Markdown */}
                  <div 
                    className="prose prose-slate max-w-none flex-1" 
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <h1 className="text-gray-900 font-extrabold mb-6 border-b pb-4">Algebra & Equations</h1>
                    <p className="text-gray-700 leading-relaxed mb-6">Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols represent quantities without fixed values, known as variables.</p>
                    
                    <h2 className="text-gray-900 font-bold mt-8 mb-4">Key Concepts</h2>
                    <ul className="list-disc pl-5 space-y-3 text-gray-700 mb-8">
                      <li><strong>Variables & Constants</strong>: A variable is a letter used to represent an unknown number. A constant is a fixed value.</li>
                      <li><strong>Expressions vs. Equations</strong>: An expression is a mathematical phrase containing numbers, variables, and operators (e.g., 3x + 5). An equation is a statement that two expressions are equal (e.g., 3x + 5 = 14).</li>
                      <li><strong>Solving Equations</strong>: The goal is to isolate the variable. Whatever you do to one side of the equation, you must do to the other.</li>
                    </ul>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl my-8">
                      <h3 className="font-bold text-blue-900 mt-0 mb-3">Example: Solve for x</h3>
                      <p className="font-mono text-blue-800 text-center text-lg my-2">2x + 4 = 10</p>
                      <p className="text-blue-800">Subtract 4 from both sides:</p>
                      <p className="font-mono text-blue-800 text-center text-lg my-2">2x = 6</p>
                      <p className="text-blue-800">Divide by 2:</p>
                      <p className="font-mono text-blue-800 text-center text-lg mt-2 mb-0 font-bold">x = 3</p>
                    </div>
                  </div>

                  <div className="mt-12 pt-6 border-t border-gray-100 flex justify-center">
                    <button 
                      onClick={() => markAsComplete('notes')}
                      className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-sm ${
                        completedResources.has('notes') 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                      }`}
                      disabled={completedResources.has('notes')}
                    >
                      {completedResources.has('notes') ? (
                        <><CheckCircle2 className="w-5 h-5" /> Marked as Read</>
                      ) : (
                        <><CheckCircle2 className="w-5 h-5" /> Mark as Read</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- VIDEO TAB --- */}
            {activeTab === 'video' && (
              <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-4">
                
                {/* Mock Video Player */}
                <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative group shadow-2xl border border-gray-800 flex items-center justify-center">
                  
                  {/* Fake Video Element for Progress Tracking */}
                  <video 
                    ref={videoRef}
                    onTimeUpdate={handleVideoProgress}
                    onEnded={() => markAsComplete('video')}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    muted
                  />

                  {/* Thumbnail / Mock Poster */}
                  <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center">
                    <Video className="w-20 h-20 text-slate-700 mb-4" />
                    <h3 className="text-slate-500 font-bold text-lg">{mockChapter.resources.video.title}</h3>
                  </div>

                  {/* Play Overlay */}
                  {!isPlaying && (
                    <button 
                      onClick={togglePlay}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group/play"
                    >
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </div>
                    </button>
                  )}

                  {/* Controls Bar (Visible on hover or paused) */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-600 rounded-full mb-4 cursor-pointer relative group/progress">
                       <div className="absolute -top-1.5 left-0 right-0 h-4 bg-transparent"></div> {/* hover catch */}
                       <div 
                         className="h-full bg-blue-500 rounded-full relative"
                         style={{ width: `${videoProgress}%` }}
                       >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md"></div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                       <div className="flex items-center gap-4">
                         <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                           {isPlaying ? (
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                           ) : (
                             <Play className="w-6 h-6 fill-current" />
                           )}
                         </button>
                         <span className="text-sm font-medium tabular-nums">{isPlaying ? '02:14' : '00:00'} / 12:45</span>
                       </div>

                       <div className="flex items-center gap-4 relative">
                         {/* Speed Menu */}
                         <div className="relative">
                           <button 
                             onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                             className="flex items-center gap-1 text-sm font-bold hover:text-blue-400 transition-colors bg-white/10 px-2 py-1 rounded"
                           >
                             <Settings className="w-4 h-4" /> {playbackRate}x
                           </button>
                           {showSpeedMenu && (
                             <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl py-1 z-50">
                               {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                                 <button 
                                   key={speed}
                                   onClick={() => changeSpeed(speed)}
                                   className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 ${playbackRate === speed ? 'text-blue-400 font-bold' : 'text-gray-300'}`}
                                 >
                                   {speed}x
                                 </button>
                               ))}
                             </div>
                           )}
                         </div>

                         <button className="hover:text-blue-400 transition-colors">
                           <Maximize className="w-5 h-5" />
                         </button>
                       </div>
                    </div>
                  </div>
                </div>

                {completedResources.has('video') && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg backdrop-blur animate-in slide-in-from-top-4 fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Video Completed
                  </div>
                )}
              </div>
            )}

            {/* --- PDF TAB --- */}
            {activeTab === 'pdf' && (
              <div className="flex-1 p-6 md:p-10 flex flex-col items-center custom-scrollbar overflow-y-auto">
                 <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
                    {/* PDF Header */}
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-3">
                         <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="font-bold text-gray-900">{mockChapter.resources.pdf.filename}</h3>
                           <p className="text-xs text-gray-500">{mockChapter.resources.pdf.filesize}</p>
                         </div>
                       </div>
                       
                       <button 
                         onClick={() => markAsComplete('pdf')}
                         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                       >
                         <Download className="w-4 h-4" /> Download PDF
                       </button>
                    </div>

                    {/* Fake PDF Viewer */}
                    <div className="flex-1 bg-gray-200 flex flex-col items-center overflow-y-auto py-8 px-4 gap-8 custom-scrollbar">
                       <div className="w-full max-w-2xl aspect-[1/1.4] bg-white shadow-md flex items-center justify-center">
                          <p className="text-gray-300 font-bold text-2xl">Page 1</p>
                       </div>
                       <div className="w-full max-w-2xl aspect-[1/1.4] bg-white shadow-md flex items-center justify-center">
                          <p className="text-gray-300 font-bold text-2xl">Page 2</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- AI SUMMARY TAB --- */}
            {activeTab === 'ai' && (
              <div className="flex-1 p-6 md:p-10 flex flex-col items-center custom-scrollbar overflow-y-auto">
                <div className="w-full max-w-3xl">
                   
                   {/* Header */}
                   <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                       <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                         <Sparkles className="w-6 h-6" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-extrabold text-gray-900">AI Chapter Summary</h2>
                         <p className="text-sm text-purple-600 font-bold flex items-center gap-1"><Sparkles className="w-3 h-3"/> Generated by Gemini</p>
                       </div>
                     </div>
                     
                     <button 
                       onClick={generateAISummary}
                       disabled={isAILoading}
                       className="text-gray-500 hover:text-purple-600 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                     >
                       <RefreshCw className={`w-5 h-5 ${isAILoading ? 'animate-spin' : ''}`} />
                     </button>
                   </div>

                   {/* Loading State */}
                   {isAILoading ? (
                     <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3 mb-6 text-purple-500 font-bold">
                          <RefreshCw className="w-5 h-5 animate-spin" /> Generating intelligent summary...
                        </div>
                        <div className="space-y-4 mb-8">
                          <div className="h-4 bg-gray-100 rounded w-full"></div>
                          <div className="h-4 bg-gray-100 rounded w-11/12"></div>
                          <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                          <div className="h-4 bg-gray-100 rounded w-full"></div>
                        </div>
                        <div className="h-6 w-32 bg-gray-100 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-24 bg-gray-100 rounded-xl"></div>
                          <div className="h-24 bg-gray-100 rounded-xl"></div>
                        </div>
                     </div>
                   ) : aiSummary ? (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Key Points */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                             <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Key Takeaways
                           </h3>
                           <ul className="space-y-4">
                             {aiSummary.keyPoints.map((point: string, idx: number) => (
                               <li key={idx} className="flex gap-4">
                                 <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</span>
                                 <span className="text-gray-700 font-medium leading-relaxed">{point}</span>
                               </li>
                             ))}
                           </ul>
                        </div>

                        {/* Glossary */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white">
                           <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                             <BookOpen className="w-5 h-5 text-blue-400" /> Essential Glossary
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {aiSummary.glossary.map((item: any, idx: number) => (
                               <div key={idx} className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                                 <h4 className="font-extrabold text-blue-300 mb-2">{item.term}</h4>
                                 <p className="text-sm text-gray-300 leading-relaxed">{item.definition}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                   ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Ask AI Button */}
        <button 
          onClick={() => router.push(`/dashboard/student/doubts?context=Chapter+${mockChapter.chapterNumber}:+${mockChapter.title}`)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-slate-900 hover:bg-purple-600 text-white rounded-full px-5 py-3.5 md:py-4 md:px-6 shadow-2xl hover:shadow-purple-600/30 transition-all duration-300 flex items-center gap-3 z-50 group transform hover:-translate-y-1"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 absolute -top-1 -right-2 text-amber-300 animate-pulse" />
          </div>
          <div className="hidden sm:block text-left pr-1 group-hover:pr-2 transition-all">
            <span className="block text-[10px] uppercase font-bold text-purple-300 mb-0.5">Ask about</span>
            <span className="block font-extrabold text-sm leading-none tracking-wide">{mockChapter.title}</span>
          </div>
        </button>

      </div>
      
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
