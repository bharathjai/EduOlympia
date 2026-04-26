"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, Clock, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, 
  Flag, LayoutGrid, X, WifiOff 
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const mockPaper = {
  id: "1",
  title: "Math Mock Test 4",
  subject: "Mathematics",
  timeLimitMinutes: 10,
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

type TestState = 'loading' | 'active' | 'confirm-submit' | 'submitting' | 'completed';

export default function TakeTestPage() {
  const router = useRouter();
  
  // Test State
  const [testState, setTestState] = useState<TestState>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(mockPaper.timeLimitMinutes * 60); // seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const isSubmittingRef = useRef(false);

  // Network State
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setTestState('active'), 800);
    return () => clearTimeout(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (testState !== 'active') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 300 && prev > 299) { // 5 minutes remaining
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 5000); // Hide toast after 5s
        }
        
        if (prev <= 1) {
          clearInterval(timerId);
          if (!isSubmittingRef.current) {
            handleFinalSubmit(true); // Auto submit
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [testState]);

  // Network offline mock
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const toggleFlag = () => {
    setFlags(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentIndex)) newFlags.delete(currentIndex);
      else newFlags.add(currentIndex);
      return newFlags;
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited(prev => new Set(prev).add(index));
  };

  const navigateNext = () => {
    if (currentIndex < mockPaper.questions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      setTestState('confirm-submit');
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const handleFinalSubmit = (isAutoSubmit: boolean = false) => {
    isSubmittingRef.current = true;
    setTestState('submitting');
    
    // Simulate API submission
    setTimeout(() => {
      if (isAutoSubmit) {
        alert("Time is up! Your test has been auto-submitted.");
      }
      setTestState('completed');
    }, 1500);
  };

  const getQuestionStatusColor = (index: number) => {
    if (flags.has(index)) return 'bg-orange-100 text-orange-600 border-orange-300';
    if (answers[index]) return 'bg-blue-600 text-white border-blue-600';
    if (visited.has(index)) return 'bg-red-50 text-red-500 border-red-200'; // Visited but not answered
    return 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'; // Not visited
  };

  const unansweredCount = mockPaper.questions.length - Object.keys(answers).length;

  if (testState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold">Preparing your test environment...</p>
        </div>
      </div>
    );
  }

  if (testState === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
         <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center animate-in zoom-in-50 spin-in-12 fade-in duration-700 max-w-lg w-full">
            <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Test Submitted!</h1>
            <p className="text-gray-500 mb-8 font-medium">Your answers have been securely saved and graded.</p>
            
            <button 
              onClick={() => router.push('/dashboard/student/practice')}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Return to Practice Dashboard
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100">
      
      {/* Network Warning */}
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm z-50">
          <WifiOff className="w-4 h-4" /> You are offline. Answers are saved locally. Reconnect to submit.
        </div>
      )}

      {/* Auto Submit Warning Toast */}
      {showTimeWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top fade-in">
          <Clock className="w-5 h-5 animate-pulse" /> 5 minutes remaining — please submit soon!
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0">
            {mockPaper.subject}
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 hidden sm:block truncate">
            {mockPaper.title}
          </h1>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg transition-colors shadow-sm border ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Question Navigator Panel (Sidebar on Desktop, Top on Mobile) */}
        <div className="lg:w-80 bg-white border-r border-gray-200 shrink-0 flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <h2 className="font-extrabold text-gray-900">Question Navigator</h2>
          </div>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            {mockPaper.questions.map((_, idx) => (
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
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-50 border border-red-200"></div> Skipped</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-600"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300"></div> Flagged</div>
          </div>
        </div>

        {/* Right: Question Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
          
          {/* Progress Bar under header on mobile */}
          <div className="h-1 bg-gray-200 w-full lg:hidden block">
            <div className="h-1 bg-blue-600 transition-all" style={{ width: `${((currentIndex + 1) / mockPaper.questions.length) * 100}%` }}></div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full">
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Question {currentIndex + 1} of {mockPaper.questions.length}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-12">
                {mockPaper.questions[currentIndex].text}
              </h2>

              {/* MCQ Options */}
              <div className="space-y-4 mb-10">
                {mockPaper.questions[currentIndex].options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === option;
                  return (
                    <label 
                      key={idx} 
                      className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-600 bg-blue-50/30 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-white bg-white'}`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <input 
                          type="radio" 
                          name={`q-${currentIndex}`} 
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSelectAnswer(option)}
                          className="peer sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                           {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full animate-in zoom-in"></div>}
                        </div>
                      </div>
                      <span className={`text-lg transition-colors ${isSelected ? 'font-bold text-blue-900' : 'text-gray-700 font-medium'}`}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Flag Action */}
              <button 
                onClick={toggleFlag}
                className={`flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-lg -ml-4 ${flags.has(currentIndex) ? 'text-orange-600 bg-orange-50' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50/50'}`}
              >
                <Flag className={`w-4 h-4 ${flags.has(currentIndex) ? 'fill-current' : ''}`} /> 
                {flags.has(currentIndex) ? 'Flagged for review' : 'Flag this question'}
              </button>

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
              
              {currentIndex === mockPaper.questions.length - 1 ? (
                <button 
                  onClick={() => setTestState('confirm-submit')}
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Submit Test <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={navigateNext}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Next</span> <ArrowRight className="w-5 h-5" />
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {testState === 'confirm-submit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8">
               <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-orange-100 text-orange-600">
                 <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Submit Test?</h3>
               <p className="text-center text-gray-500 mb-8 font-medium">Are you sure you want to finish and submit your practice test?</p>
               
               {unansweredCount > 0 && (
                 <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-center">
                   <p className="text-red-800 font-bold">You have <span className="text-red-600 text-xl mx-1">{unansweredCount}</span> unanswered questions.</p>
                   <p className="text-xs text-red-600/80 mt-1 uppercase tracking-wider font-bold">Submit anyway?</p>
                 </div>
               )}

               <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handleFinalSubmit()}
                   className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all shadow-md"
                 >
                   Yes, Submit Now
                 </button>
                 <button 
                   onClick={() => setTestState('active')}
                   className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200"
                 >
                   Cancel & Continue Checking
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {testState === 'submitting' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-orange-600 font-bold text-lg">Submitting your test...</p>
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
