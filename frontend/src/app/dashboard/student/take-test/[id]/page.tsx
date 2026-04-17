"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TakeTestPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data.questions) {
          setExam(data.data);
          setTimeLeft(data.data.durationMinutes * 60);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!exam || !exam.questions) return;
    
    let correct = 0;
    exam.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    
    setScore(correct);
    setIsSubmitted(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-brand font-bold text-xl">Preparing your exam...</div>;
  }

  if (!exam || !exam.questions) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-500 mb-6">This exam doesn't exist or has no questions attached yet.</p>
          <button onClick={() => router.back()} className="bg-brand text-white px-6 py-2 rounded-xl font-semibold">Go Back</button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const percentage = Math.round((score / exam.questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center animate-in zoom-in duration-300">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Submitted Successfully!</h1>
          <p className="text-gray-500 mb-8">{exam.title}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">Your Score</p>
              <p className="text-4xl font-black text-gray-900">{score} <span className="text-xl text-gray-400">/ {exam.questions.length}</span></p>
            </div>
            <div className={`p-6 rounded-2xl border ${percentage >= 70 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
              <p className="text-sm font-semibold mb-1 uppercase tracking-wider">Percentage</p>
              <p className="text-4xl font-black text-gray-900">{percentage}%</p>
            </div>
          </div>
          
          <Link href="/dashboard/student" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-gray-900 line-clamp-1">{exam.title}</h1>
            <span className="bg-brand/10 text-brand text-xs font-bold px-2 py-1 rounded">Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            )}
            <button 
              onClick={() => { if(confirm('Are you sure you want to finish and submit the exam?')) handleSubmit(); }}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Finish Exam
            </button>
          </div>
        </div>
      </header>

      {/* Main Test Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-brand h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-snug">
            {currentQuestionIndex + 1}. {currentQ.text}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option: string, idx: number) => {
              const isSelected = answers[currentQ.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, option)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-brand bg-brand/5' 
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                    isSelected ? 'border-brand bg-brand' : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <span className={`text-lg ${isSelected ? 'font-semibold text-brand' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-auto">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={isFirstQuestion}
            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${
              isFirstQuestion 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>

          {!isLastQuestion ? (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-all shadow-md"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover transition-all shadow-md"
            >
              Submit Exam <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>

      </main>
    </div>
  );
}
