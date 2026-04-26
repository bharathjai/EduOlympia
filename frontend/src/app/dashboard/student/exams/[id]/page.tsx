"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, Clock, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, 
  LayoutGrid, AlertTriangle, ShieldAlert, BookOpen
} from "lucide-react";

// --- MOCK DATA ---
const mockExam = {
  id: "e1",
  title: "Mid-Term Mathematics Olympiad",
  subject: "Mathematics",
  timeLimitMinutes: 45,
  negativeMarking: "-0.25",
  status: "open", // 'early', 'open', 'closed'
  startTime: new Date(Date.now() - 1000 * 60 * 5), // started 5 mins ago
  endTime: new Date(Date.now() + 1000 * 60 * 40),
  questions: [
    { id: 101, text: "If 3x + 5 = 20, what is the value of x?", options: ["5", "10", "15", "20"] },
    { id: 102, text: "Which of the following is a prime number?", options: ["9", "12", "17", "21"] },
    { id: 103, text: "What is the square root of 144?", options: ["10", "12", "14", "16"] },
    { id: 104, text: "What is 15% of 200?", options: ["15", "20", "30", "40"] },
    { id: 105, text: "Solve: 2(x - 3) = 8", options: ["x = 7", "x = 5", "x = 11", "x = -1"] },
    { id: 106, text: "What is the value of pi to two decimal places?", options: ["3.12", "3.14", "3.16", "3.18"] },
    { id: 107, text: "Simplify: 5x - 2x + 3x", options: ["4x", "5x", "6x", "7x"] },
    { id: 108, text: "A triangle has angles 45° and 90°. What is the third angle?", options: ["30°", "45°", "60°", "90°"] },
    { id: 109, text: "What is the area of a rectangle with length 10 and width 5?", options: ["15", "30", "50", "100"] },
    { id: 110, text: "Which of these fractions is the largest?", options: ["1/2", "3/4", "2/5", "5/8"] }
  ]
};

type ExamState = 'gate' | 'active' | 'confirm-submit' | 'submitting' | 'completed' | 'early' | 'closed';

export default function ExamAttemptPage() {
  const router = useRouter();
  
  // Base State
  const [examState, setExamState] = useState<ExamState>('gate');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(mockExam.timeLimitMinutes * 60); // seconds
  const isSubmittingRef = useRef(false);

  // Anti-Cheat State
  const [warnings, setWarnings] = useState(0);
  const [showTabWarningBanner, setShowTabWarningBanner] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  // Check initial exam status
  useEffect(() => {
    if (mockExam.status === 'early') setExamState('early');
    if (mockExam.status === 'closed') setExamState('closed');
  }, []);

  // Timer countdown
  useEffect(() => {
    if (examState !== 'active') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (!isSubmittingRef.current) {
            handleFinalSubmit(true, "Time is up! Your exam has been auto-submitted.");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [examState]);

  // --- ANTI CHEAT LOGIC ---
  useEffect(() => {
    if (examState !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmittingRef.current) {
        handleViolation("tab_switch");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmittingRef.current && examState === 'active') {
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examState, warnings]);

  const handleViolation = (type: "tab_switch" | "fullscreen_exit") => {
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    
    if (newWarnings >= 3) {
      handleFinalSubmit(true, "Exam auto-submitted due to multiple policy violations.");
    } else {
      if (type === 'tab_switch') {
        setShowTabWarningBanner(true);
        setTimeout(() => setShowTabWarningBanner(false), 8000); // Hide banner after 8s
      }
    }
  };

  const enforceFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullscreenWarning(false);
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
  };

  const handleStartExam = async () => {
    await enforceFullscreen();
    setExamState('active');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited(prev => new Set(prev).add(index));
  };

  const navigateNext = () => {
    if (currentIndex < mockExam.questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const handleFinalSubmit = (isAutoSubmit: boolean = false, autoMessage: string = "") => {
    isSubmittingRef.current = true;
    setExamState('submitting');
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log(e));
    }

    if (isAutoSubmit && autoMessage) {
      alert(autoMessage);
    }
    
    // Simulate API submission
    setTimeout(() => {
      // In a real app we'd navigate to S-10 results or a confirmation page
      router.push('/dashboard/student/exams'); 
    }, 2000);
  };

  const getQuestionStatusColor = (index: number) => {
    if (answers[index]) return 'bg-blue-600 text-white border-blue-600';
    if (visited.has(index)) return 'bg-red-50 text-red-500 border-red-200'; // Visited but not answered (skipped)
    return 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'; // Not visited
  };

  const unansweredCount = mockExam.questions.length - Object.keys(answers).length;

  // --- EARLY / CLOSED STATES ---
  if (examState === 'early') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
         <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Started Yet</h1>
            <p className="text-gray-500 mb-8 font-medium">The exam window has not opened yet. Please wait until the scheduled start time.</p>
            <button onClick={() => router.back()} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors w-full">
              Return to Dashboard
            </button>
         </div>
      </div>
    );
  }

  if (examState === 'closed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
         <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Window Closed</h1>
            <p className="text-gray-500 mb-8 font-medium">The exam window has closed. You cannot attempt this exam anymore. Please contact your school admin.</p>
            <button onClick={() => router.back()} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors w-full">
              Return to Dashboard
            </button>
         </div>
      </div>
    );
  }

  // --- GATE STATE (Instructions) ---
  if (examState === 'gate') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
          
          <div className="bg-blue-600 p-8 md:p-12 md:w-2/5 flex flex-col items-center justify-center text-center text-white shrink-0">
             <ShieldAlert className="w-16 h-16 mb-6 opacity-90" />
             <h1 className="text-2xl font-black mb-2 leading-tight">Formal Exam Rules</h1>
             <p className="text-blue-100 font-medium text-sm">Please read the instructions carefully before starting your attempt.</p>
          </div>

          <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-between bg-white">
             <div>
               <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{mockExam.title}</h2>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">{mockExam.subject}</p>

               <ul className="space-y-4 mb-8">
                 <li className="flex gap-3 text-sm text-gray-700 font-medium">
                   <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                   <span>Time Limit: <strong>{mockExam.timeLimitMinutes} minutes</strong>. The timer starts immediately and auto-submits at zero.</span>
                 </li>
                 <li className="flex gap-3 text-sm text-gray-700 font-medium">
                   <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                   <span>Negative Marking: <strong>{mockExam.negativeMarking} marks</strong> will be deducted for every incorrect answer.</span>
                 </li>
                 <li className="flex gap-3 text-sm text-gray-700 font-medium">
                   <LayoutGrid className="w-5 h-5 text-purple-600 shrink-0" />
                   <span>Proctoring: Full-screen mode is enforced. Tab switching is logged. <strong>3 warnings</strong> will result in auto-submission.</span>
                 </li>
               </ul>
             </div>

             <div className="border-t border-gray-100 pt-6 mt-4">
               <button 
                 onClick={handleStartExam}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
               >
                 I Understand — Start Exam
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE EXAM STATE ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100">
      
      {/* Fullscreen Enforcer Modal */}
      {showFullscreenWarning && examState === 'active' && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl animate-in zoom-in-95">
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertTriangle className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">Return to Full Screen</h2>
             <p className="text-gray-600 font-medium mb-8">You have exited full-screen mode. This is recorded as a violation. Please return to full screen to continue your exam.</p>
             <button 
               onClick={enforceFullscreen}
               className="w-full py-4 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
             >
               Return to Exam
             </button>
           </div>
        </div>
      )}

      {/* Tab Switch Warning Banner */}
      {showTabWarningBanner && (
        <div className="bg-yellow-400 text-yellow-900 px-6 py-4 flex items-center justify-center gap-3 font-bold shadow-md z-50 animate-in slide-in-from-top fade-in sticky top-0">
          <AlertTriangle className="w-5 h-5" /> 
          Warning: You left the exam window. This has been recorded. ({warnings}/3)
        </div>
      )}

      {/* Top Header Bar (No Navigation) */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0">
            {mockExam.subject}
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 hidden sm:block truncate">
            {mockExam.title}
          </h1>
        </div>

        {/* Huge Timer */}
        <div className={`flex items-center gap-3 px-6 py-2 rounded-xl font-mono font-black text-xl transition-colors shadow-inner border-2 ${timeLeft <= 600 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
          <Clock className={`w-6 h-6 ${timeLeft <= 600 ? 'animate-pulse' : ''}`} />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Negative Marking Note (If enabled) */}
      {mockExam.negativeMarking && (
        <div className="bg-blue-50 border-b border-blue-100 text-blue-800 text-xs font-bold text-center py-2 flex items-center justify-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" /> This exam has {mockExam.negativeMarking} negative marking for wrong answers.
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Question Navigator Panel */}
        <div className="lg:w-80 bg-white border-r border-gray-200 shrink-0 flex flex-col p-6 overflow-y-auto custom-scrollbar order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <h2 className="font-extrabold text-gray-900">Question Navigator</h2>
          </div>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            {mockExam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`aspect-square rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center hover:scale-105 ${getQuestionStatusColor(idx)} ${currentIndex === idx ? 'ring-4 ring-blue-500/20 shadow-md transform scale-105' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-xs font-bold text-gray-500 mt-auto bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300"></div> Not Visited</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-600"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-50 border border-red-200"></div> Skipped</div>
          </div>
        </div>

        {/* Right: Clean Question Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white order-1 lg:order-2">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:px-24 custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full">
              
              <div className="mb-8 border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Question {currentIndex + 1} of {mockExam.questions.length}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed mb-12">
                {mockExam.questions[currentIndex].text}
              </h2>

              {/* MCQ Options */}
              <div className="space-y-4 mb-10">
                {mockExam.questions[currentIndex].options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === option;
                  const labelLetter = String.fromCharCode(65 + idx); // A, B, C, D
                  return (
                    <label 
                      key={idx} 
                      className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-600 bg-blue-50/30 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 bg-white'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                        {labelLetter}
                      </div>
                      <span className={`text-lg transition-colors ${isSelected ? 'font-bold text-blue-900' : 'text-gray-700 font-medium'}`}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="bg-white border-t border-gray-200 p-4 md:px-12 flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
             <button 
                onClick={navigatePrev}
                disabled={currentIndex === 0}
                className="px-6 py-3.5 font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Previous</span>
              </button>
              
              <div className="flex items-center gap-4">
                {/* Submit button is ALWAYS available from Q1 in formal exams */}
                <button 
                  onClick={() => setExamState('confirm-submit')}
                  className="px-6 py-3.5 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  End Exam
                </button>

                <button 
                  onClick={navigateNext}
                  disabled={currentIndex === mockExam.questions.length - 1}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span> <ArrowRight className="w-5 h-5" />
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {examState === 'confirm-submit' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8">
               <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-red-100 text-red-600">
                 <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Submit Exam?</h3>
               <p className="text-center text-gray-500 mb-8 font-medium">Are you sure you want to end and submit your exam? You cannot undo this action.</p>
               
               {unansweredCount > 0 && (
                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 text-center">
                   <p className="text-orange-900 font-bold">You have <span className="text-orange-600 text-xl mx-1">{unansweredCount}</span> unanswered questions.</p>
                   {mockExam.negativeMarking && <p className="text-xs text-orange-700/80 mt-1 font-bold">Skipped questions have no negative marking.</p>}
                 </div>
               )}

               <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handleFinalSubmit()}
                   className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-all shadow-md"
                 >
                   Yes, End Exam
                 </button>
                 <button 
                   onClick={() => setExamState('active')}
                   className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200"
                 >
                   Return to Questions
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {examState === 'submitting' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-900 font-bold text-xl mb-2">Encrypting and Submitting Exam...</p>
            <p className="text-gray-500 font-medium">Please do not close your browser.</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}} />
    </div>
  );
}
