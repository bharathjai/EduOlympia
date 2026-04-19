"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { FileText, Clock, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import Link from "next/link";

type TestState = 'intro' | 'active' | 'submitting' | 'completed';

export default function TakeTestPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [testState, setTestState] = useState<TestState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [warnings, setWarnings] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from('trainer_exams')
        .select('*')
        .eq('id', id)
        .single();
        
      if (examData) {
        setExam({
          id: examData.id,
          title: examData.title,
          subject: examData.subject,
          class: examData.class_grade,
          totalQuestions: 10, // Mocking total questions
        });
        setTimeLeft((examData.duration || 60) * 60); // convert minutes to seconds
      }

      // Fetch questions (mocking options since trainer_questions only has text)
      const { data: qData, error: qError } = await supabase
        .from('trainer_questions')
        .select('*');
        
      if (qData) {
        const shuffled = qData.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10).map(q => ({
          ...q,
          options: [
            "Option A: " + Math.floor(Math.random() * 100),
            "Option B: " + Math.floor(Math.random() * 100),
            "Option C: " + Math.floor(Math.random() * 100),
            "Option D: " + Math.floor(Math.random() * 100),
          ],
          correctAnswer: "Option B"
        }));
        setQuestions(selected);
      }
      
      setLoading(false);
    };

    fetchExamDetails();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (testState !== 'active' || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  // Anti-cheat / Exam Privacy listeners
  useEffect(() => {
    if (testState !== 'active') return;

    const handleViolation = (reason: string) => {
      setWarnings(prev => {
        const next = prev + 1;
        if (next >= 2) {
          alert("Maximum warnings exceeded! Your exam is being automatically submitted.");
          setShouldAutoSubmit(true);
        } else {
          alert(`WARNING ${next}/2: ${reason}\n\nPlease stay in full-screen and do not switch tabs. Your exam will auto-submit after 2 warnings.`);
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
          }
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleViolation("You switched tabs or minimized the window.");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testState === 'active' && !shouldAutoSubmit && !isSubmittingRef.current) {
        handleViolation("You exited full-screen mode.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [testState, shouldAutoSubmit]);

  useEffect(() => {
    if (shouldAutoSubmit) {
      handleSubmitTest();
    }
  }, [shouldAutoSubmit]);

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.log("Fullscreen request failed", e);
    }
    setTestState('active');
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleSubmitTest = async () => {
    isSubmittingRef.current = true;
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log(e));
    }
    
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (answers[index]) calculatedScore++; 
    });
    setScore(calculatedScore);
    setTestState('submitting');
    
    setTimeout(() => {
      setTestState('completed');
    }, 800); 
    
    if (exam) {
      try {
        await supabase.from('student_test_results').insert({
          student_name: 'Aarav Sharma',
          paper_id: exam.id,
          paper_title: exam.title,
          score: calculatedScore,
          total_questions: questions.length
        });
      } catch (err) {
        console.error("Failed to save result", err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
        <div className="flex items-center justify-center h-64 text-gray-500">Loading exam...</div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    return (
      <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Exam Not Found</h2>
          <Link href="/dashboard/student/exams" className="text-brand hover:underline mt-4 inline-block">Return to Exams</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="student" 
      userName="Aarav Sharma" 
      userDescription="Class 8 • Delhi Public School"
      isTestActive={testState === 'active' || testState === 'submitting'}
    >
      <div className="max-w-4xl mx-auto">
        
        {testState === 'intro' && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-lg text-gray-500 mb-8">{exam.subject} • {exam.class}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-left">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                <p className="font-bold text-gray-900 text-lg">{questions.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="font-bold text-gray-900 text-lg">{Math.floor(timeLeft / 60)} mins</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Format</p>
                <p className="font-bold text-gray-900 text-lg">Formal Exam</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Proctored</p>
                <p className="font-bold text-red-600 text-lg">Yes</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/student/exams" className="px-8 py-4 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                Cancel
              </Link>
              <button 
                onClick={handleStartTest}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Begin Exam Now
              </button>
            </div>
          </div>
        )}

        {(testState === 'active' || testState === 'submitting') && questions.length > 0 && (
          <div className={`transition-all duration-700 transform ${testState === 'submitting' ? 'scale-90 opacity-0 -translate-y-20 blur-sm pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-4'}`}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-6 z-10">
              <div>
                <h2 className="font-bold text-gray-900 line-clamp-1">{exam.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
                  {warnings > 0 && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      ⚠️ {warnings}/2 Warnings
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-48 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-brand h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: (((currentIndex + 1) / questions.length) * 100) + '%' }}
                  ></div>
                </div>
                
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg font-mono font-bold">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 min-h-[400px]">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                  <span className="text-gray-400 font-bold mr-2">{currentIndex + 1}.</span>
                  {questions[currentIndex].question_text}
                </h3>
                <button className="text-gray-400 hover:text-brand transition-colors p-2" title="Flag for review">
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mt-8">
                {questions[currentIndex].options.map((option: string, i: number) => {
                  const isSelected = answers[currentIndex] === option;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(option)}
                      className={"w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group " + (isSelected ? "border-brand bg-brand/5" : "border-gray-100 hover:border-gray-300 hover:bg-gray-50")}
                    >
                      <div className={"w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors " + (isSelected ? "bg-brand text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200")}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={"text-lg " + (isSelected ? "text-brand font-medium" : "text-gray-700")}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-6 py-3 font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-gray-700 shadow-sm border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5" /> Previous
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button 
                  onClick={handleSubmitTest}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Submit Exam
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-6 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {testState === 'completed' && (
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center animate-in zoom-in-50 spin-in-12 fade-in duration-700 ease-out">
            <div className="w-28 h-28 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Exam Submitted Successfully!</h1>
            <p className="text-gray-500 mb-8">Great job completing the {exam.title}.</p>
            
            <div className="max-w-xs mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
              <p className="text-sm text-gray-500 font-semibold mb-1">Your Score (Demo)</p>
              <div className="text-5xl font-black text-brand mb-2">
                {score}<span className="text-2xl text-gray-400">/{questions.length}</span>
              </div>
              <p className="text-sm text-gray-400">Questions Answered: {Object.keys(answers).length}</p>
            </div>

            <Link 
              href="/dashboard/student/exams" 
              className="inline-block px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Return to Exams
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
