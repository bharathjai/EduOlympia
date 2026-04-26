"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, XCircle, AlertCircle, ArrowLeft, RotateCcw, 
  BarChart3, ListChecks, FileText, Sparkles, AlertTriangle, ArrowRight
} from "lucide-react";

// --- MOCK DATA ---
const mockResult = {
  id: "1",
  title: "Math Mock Test 4",
  subject: "Mathematics",
  type: "open", // "open" or "assigned"
  score: 78,
  totalQuestions: 20,
  correct: 15,
  wrong: 4,
  skipped: 1,
  passingScore: 60,
  topics: [
    { name: "Algebra", total: 8, correct: 7, percentage: 87.5 },
    { name: "Geometry", total: 7, correct: 4, percentage: 57.1 },
    { name: "Arithmetic", total: 5, correct: 4, percentage: 80.0 },
  ],
  questions: [
    { 
      id: 101, 
      text: "If 3x + 5 = 20, what is the value of x?", 
      topic: "Algebra",
      options: ["5", "10", "15", "20"],
      studentAnswer: "5",
      correctAnswer: "5",
      isCorrect: true,
      explanation: "Subtract 5 from both sides to get 3x = 15, then divide by 3 to get x = 5."
    },
    { 
      id: 102, 
      text: "A triangle has angles 45° and 90°. What is the third angle?", 
      topic: "Geometry",
      options: ["30°", "45°", "60°", "90°"],
      studentAnswer: "60°",
      correctAnswer: "45°",
      isCorrect: false,
      explanation: "The sum of angles in a triangle is 180°. 180 - (90 + 45) = 45°."
    },
    { 
      id: 103, 
      text: "What is the square root of 144?", 
      topic: "Arithmetic",
      options: ["10", "12", "14", "16"],
      studentAnswer: null, // Skipped
      correctAnswer: "12",
      isCorrect: false,
      explanation: "12 * 12 = 144."
    },
    // Adding one more for visual variety
    { 
      id: 104, 
      text: "What is 15% of 200?", 
      topic: "Arithmetic",
      options: ["15", "20", "30", "40"],
      studentAnswer: "30",
      correctAnswer: "30",
      isCorrect: true,
      explanation: "(15/100) * 200 = 30."
    }
  ]
};

type Tab = 'topics' | 'review';

export default function TestResultPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('topics');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (mockResult.score === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Calculate colors based on score
  const getScoreColorInfo = (score: number) => {
    if (score >= 60) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', circle: 'text-emerald-500 stroke-emerald-500' };
    if (score >= 40) return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', circle: 'text-orange-500 stroke-orange-500' };
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', circle: 'text-red-500 stroke-red-500' };
  };

  const colors = getScoreColorInfo(mockResult.score);
  const isPass = mockResult.score >= mockResult.passingScore;
  const isPerfect = mockResult.score === 100;
  const isVeryLow = mockResult.score < 40;

  // SVG Circle calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (mockResult.score / 100) * circumference;

  return (
    <DashboardLayout role="student" userName="Arjun Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="max-w-5xl mx-auto pb-24 font-sans animate-in fade-in duration-500">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard/student/practice" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Practice Tests
          </Link>
          
          {mockResult.type === 'open' && (
            <button 
              onClick={() => router.push(`/dashboard/student/take-test/${mockResult.id}`)}
              className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-5 py-2 rounded-xl font-bold transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> Retake This Test
            </button>
          )}
        </div>

        {/* Dynamic Banners */}
        {isPerfect && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl shadow-emerald-500/20 flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-top-4 relative overflow-hidden">
             {showConfetti && (
               <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e1/Confetti.svg')] bg-cover mix-blend-screen"></div>
             )}
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md border border-white/30">
               <Sparkles className="w-8 h-8 text-amber-200" />
             </div>
             <div className="text-center sm:text-left relative z-10">
               <h2 className="text-2xl font-black mb-1 text-white">Full marks! Excellent work!</h2>
               <p className="text-emerald-100 font-medium">You have mastered this material perfectly. Keep up the amazing streak!</p>
             </div>
          </div>
        )}

        {isVeryLow && (
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
             <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
               <AlertTriangle className="w-8 h-8" />
             </div>
             <div className="text-center sm:text-left">
               <h2 className="text-xl font-bold text-orange-900 mb-1">Keep practising!</h2>
               <p className="text-orange-700 font-medium">Don't worry. Review your topic breakdown below, check the model answers, and try again when you're ready.</p>
             </div>
          </div>
        )}

        {/* Score Hero Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                {mockResult.subject}
              </span>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider border ${isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {isPass ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{mockResult.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl flex items-center gap-3 font-bold border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" /> Correct: <span className="text-xl">{mockResult.correct}</span>
              </div>
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 font-bold border border-red-100">
                <XCircle className="w-5 h-5" /> Wrong: <span className="text-xl">{mockResult.wrong}</span>
              </div>
              <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl flex items-center gap-3 font-bold border border-gray-200">
                <AlertCircle className="w-5 h-5" /> Skipped: <span className="text-xl">{mockResult.skipped}</span>
              </div>
            </div>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                className="stroke-gray-100"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="70" cy="70" r={radius}
                className={colors.circle}
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-5xl font-black tracking-tighter ${colors.text}`}>{mockResult.score}%</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>

        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('topics')}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold text-sm transition-colors border-b-2 ${activeTab === 'topics' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <BarChart3 className="w-5 h-5" /> Topic Breakdown
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold text-sm transition-colors border-b-2 ${activeTab === 'review' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <ListChecks className="w-5 h-5" /> Answer Review
            </button>
          </div>

          <div className="p-8 md:p-12">
            
            {/* TOPIC BREAKDOWN TAB */}
            {activeTab === 'topics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Performance by Topic</h3>
                  <button className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                    <FileText className="w-4 h-4" /> View Model Answer Paper
                  </button>
                </div>

                {mockResult.topics.map((topic, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{topic.name}</h4>
                        <p className="text-sm text-gray-500">{topic.correct} of {topic.total} questions correct</p>
                      </div>
                      <span className={`text-xl font-black ${topic.percentage >= 60 ? 'text-emerald-600' : 'text-orange-500'}`}>
                        {topic.percentage}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${topic.percentage >= 60 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                        style={{ width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ANSWER REVIEW TAB */}
            {activeTab === 'review' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Question Review</h3>
                  <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Correct</span>
                    <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-500"/> Wrong</span>
                  </div>
                </div>

                {mockResult.questions.map((q, idx) => {
                  const isSkipped = q.studentAnswer === null;
                  const isCorrect = q.isCorrect;

                  return (
                    <div key={q.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${isCorrect ? 'border-emerald-100' : isSkipped ? 'border-gray-200' : 'border-red-100'}`}>
                      
                      <div className={`p-6 border-b ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : isSkipped ? 'bg-gray-50 border-gray-100' : 'bg-red-50/50 border-red-100'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : isSkipped ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : isSkipped ? <AlertCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                              Question {idx + 1} • {q.topic}
                            </span>
                            <h4 className="text-lg font-bold text-gray-900 leading-snug">{q.text}</h4>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                        
                        {/* Student Answer */}
                        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : isSkipped ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-100'}`}>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Answer</p>
                          <p className={`font-bold text-lg ${isCorrect ? 'text-emerald-700' : isSkipped ? 'text-gray-500' : 'text-red-700'}`}>
                            {isSkipped ? "Did not answer" : q.studentAnswer}
                          </p>
                        </div>

                        {/* Correct Answer (only show if student was wrong or skipped) */}
                        {(!isCorrect || isSkipped) && (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Correct Answer</p>
                            <p className="font-bold text-lg text-emerald-700">
                              {q.correctAnswer}
                            </p>
                          </div>
                        )}
                        
                        {/* Explanation (only show if wrong or skipped) */}
                        {(!isCorrect || isSkipped) && q.explanation && (
                           <div className="col-span-1 md:col-span-2 mt-2 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
                             <div className="bg-blue-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                               <Sparkles className="w-4 h-4 text-blue-600" />
                             </div>
                             <div>
                               <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Explanation</p>
                               <p className="text-sm text-blue-900 leading-relaxed font-medium">{q.explanation}</p>
                             </div>
                           </div>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
