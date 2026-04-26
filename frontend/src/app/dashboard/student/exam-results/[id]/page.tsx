"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy, Medal, Share2, Download, BarChart2, Users,
  Sparkles, Award, CheckCircle2, ArrowLeft, Star, FileBadge, ChevronRight, Clock
} from "lucide-react";

// --- MOCK DATA ---
const mockResult = {
  id: "e1",
  title: "Mid-Term Mathematics Olympiad",
  subject: "Mathematics",
  date: "24 April 2026",
  isPublished: true,
  score: 85, // percentage
  marksObtained: 34,
  totalMarks: 40,
  correct: 35,
  wrong: 4,
  skipped: 1,
  rank: 1, // 1st Rank
  percentile: 98,
  schoolRank: "1st out of 450",
  leaderboard: [
    { rank: 1, name: "Arjun Sharma", school: "Delhi Public School", score: 85, isCurrentUser: true },
    { rank: 2, name: "Riya Verma", school: "Global Indian School", score: 82, isCurrentUser: false },
    { rank: 3, name: "Siddharth Rao", school: "Delhi Public School", score: 80, isCurrentUser: false },
    { rank: 4, name: "Ananya Iyer", school: "Kendriya Vidyalaya", score: 78, isCurrentUser: false },
    { rank: 5, name: "Karan Singh", school: "Modern School", score: 75, isCurrentUser: false },
    { rank: 6, name: "Meera Patel", school: "Delhi Public School", score: 74, isCurrentUser: false },
    { rank: 7, name: "Vikram Malhotra", school: "Global Indian School", score: 72, isCurrentUser: false },
    { rank: 8, name: "Sneha Gupta", school: "Kendriya Vidyalaya", score: 70, isCurrentUser: false },
    { rank: 9, name: "Rahul Deshmukh", school: "Modern School", score: 68, isCurrentUser: false },
    { rank: 10, name: "Pooja Reddy", school: "Delhi Public School", score: 67, isCurrentUser: false },
  ]
};

type Tab = 'overview' | 'leaderboard' | 'ai-feedback' | 'certificate';

export default function ExamResultPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // AI Feedback State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Tab change handler
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'ai-feedback' && !aiFeedback && !isAiLoading) {
      setIsAiLoading(true);
      // Simulate Gemini API call (3-5 seconds)
      setTimeout(() => {
        setAiFeedback("Based on your performance in the Mid-Term Mathematics Olympiad, you have demonstrated an exceptional understanding of core mathematical concepts, securing a top-tier rank. Your overall accuracy is highly commendable, particularly in foundational topics where you scored nearly perfectly.\n\nYour strongest area is undoubtedly Algebra and Linear Equations. You tackled complex multi-step problems with ease and speed, showing that you have memorized the formulas and understand the underlying logic required to manipulate equations. This strength gave you a significant edge over your peers.\n\nHowever, there is a slight room for improvement in Geometry, specifically concerning theorems related to circles and tangents. The few questions you missed or skipped belonged to this category. It seems you might be overthinking the proofs or mixing up similar properties.\n\nStudy Recommendation: I recommend dedicating your next 3 practice sessions exclusively to Geometry. Review the circle theorem proofs, and practice drawing the diagrams yourself before attempting the calculations. Continuing your current trajectory with just a bit more focus on Geometry will make you unstoppable in the finals.");
        setIsAiLoading(false);
      }, 3500);
    }
  };

  const copyShareLink = () => {
    alert("Result summary copied to clipboard! (e.g. 'I just scored 85% and secured Rank 1 in the Mid-Term Mathematics Olympiad!')");
  };

  const handleDownloadCert = () => {
    alert("Downloading Certificate PDF...");
  };

  // Doughnut Chart Data
  const totalQ = mockResult.correct + mockResult.wrong + mockResult.skipped;
  const correctPct = (mockResult.correct / totalQ) * 100;
  const wrongPct = (mockResult.wrong / totalQ) * 100;
  const skippedPct = (mockResult.skipped / totalQ) * 100;

  if (!mockResult.isPublished) {
    return (
      <DashboardLayout role="student" userName="Arjun Sharma" userDescription="Class 8 • Delhi Public School">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Results Not Yet Published</h2>
          <p className="text-gray-500 max-w-md">Your exam results will be published on [15 May 2026]. The trainers are still grading the submissions. Check back then!</p>
          <Link href="/dashboard/student" className="mt-8 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl">Return to Dashboard</Link>
        </div>
      </DashboardLayout>
    );
  }

  const isPodium = mockResult.rank <= 3;
  const rankColors = {
    1: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300', gradient: 'from-amber-400 to-yellow-500' },
    2: { bg: 'bg-slate-200', text: 'text-slate-600', border: 'border-slate-300', gradient: 'from-slate-300 to-slate-400' },
    3: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', gradient: 'from-orange-400 to-amber-600' }
  };
  const currentRankColor = mockResult.rank <= 3 ? rankColors[mockResult.rank as 1 | 2 | 3] : { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-500' };

  return (
    <DashboardLayout role="student" userName="Arjun Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="max-w-6xl mx-auto pb-24 font-sans animate-in fade-in duration-500">

        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/dashboard/student"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>

          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-bold transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share My Result
          </button>
        </div>

        {/* --- HERO RANK CARD --- */}
        <div className={`rounded-3xl p-8 md:p-12 mb-8 shadow-xl relative overflow-hidden bg-gradient-to-br ${currentRankColor.gradient}`}>

          {/* Trophy Background Watermark */}
          {isPodium && (
            <Trophy className="absolute -right-10 -bottom-10 w-96 h-96 text-white opacity-10 transform -rotate-12 pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">

            {/* Rank Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center w-40 h-40 bg-white/20 backdrop-blur-md rounded-full border border-white/40 shadow-inner">
              {mockResult.rank === 1 ? (
                <Trophy className="w-14 h-14 text-yellow-300 mb-1" />
              ) : mockResult.rank === 2 ? (
                <Medal className="w-14 h-14 text-slate-200 mb-1" />
              ) : mockResult.rank === 3 ? (
                <Medal className="w-14 h-14 text-orange-300 mb-1" />
              ) : (
                <Award className="w-14 h-14 text-white mb-1" />
              )}
              <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Rank</span>
              <span className="text-4xl font-black text-white">{mockResult.rank}</span>
            </div>

            <div className="flex-1 text-center md:text-left text-white">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm border border-white/20">
                Formal Exam Result
              </span>
              <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">{mockResult.title}</h1>
              <p className="text-white/80 font-medium text-lg mb-8">{mockResult.subject} • Conducted on {mockResult.date}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 rounded-2xl">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Score</p>
                  <p className="text-2xl font-black">{mockResult.score}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 rounded-2xl">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Marks</p>
                  <p className="text-2xl font-black">{mockResult.marksObtained} <span className="text-sm font-bold text-white/60">/ {mockResult.totalMarks}</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 rounded-2xl">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Percentile</p>
                  <p className="text-2xl font-black">Top {100 - mockResult.percentile}%</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- MAIN CONTENT TABS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar (Tabs) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 sticky top-24">
              <button
                onClick={() => handleTabChange('overview')}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <BarChart2 className="w-5 h-5" /> Score Breakdown
              </button>
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'leaderboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Users className="w-5 h-5" /> Leaderboard
              </button>
              <button
                onClick={() => handleTabChange('ai-feedback')}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'ai-feedback' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Sparkles className="w-5 h-5" /> AI Feedback
              </button>
              {mockResult.rank <= 3 && (
                <button
                  onClick={() => handleTabChange('certificate')}
                  className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'certificate' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span className="flex items-center gap-3"><FileBadge className="w-5 h-5" /> Certificate</span>
                  {!activeTab.includes('cert') && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                </button>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Performance Breakdown</h3>

                <div className="flex flex-col md:flex-row items-center gap-12">
                  {/* CSS-only Doughnut Chart representation */}
                  <div className="relative w-48 h-48 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Background Ring */}
                      <path className="text-gray-100 stroke-current" strokeWidth="6" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

                      {/* Correct (Green) */}
                      <path className="text-emerald-500 stroke-current" strokeWidth="6" strokeDasharray={`${correctPct}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

                      {/* Wrong (Red) */}
                      <path className="text-red-500 stroke-current" strokeWidth="6" strokeDasharray={`${wrongPct}, 100`} strokeDashoffset={`-${correctPct}`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

                      {/* Skipped (Gray) */}
                      <path className="text-gray-400 stroke-current" strokeWidth="6" strokeDasharray={`${skippedPct}, 100`} strokeDashoffset={`-${correctPct + wrongPct}`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-gray-900">{totalQ}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questions</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                        <span className="font-bold text-emerald-900">Correct Answers</span>
                      </div>
                      <span className="font-black text-xl text-emerald-700">{mockResult.correct}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="font-bold text-red-900">Wrong Answers</span>
                      </div>
                      <span className="font-black text-xl text-red-700">{mockResult.wrong}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <span className="font-bold text-gray-700">Skipped Questions</span>
                      </div>
                      <span className="font-black text-xl text-gray-600">{mockResult.skipped}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Global Leaderboard</h3>
                    <p className="text-sm font-medium text-gray-500">Top 10 students across all participating schools.</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Rank</p>
                    <p className="text-2xl font-black text-blue-600">{mockResult.rank}</p>
                  </div>
                </div>

                <div className="p-0">
                  {mockResult.leaderboard.map((student, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 md:p-6 border-b border-gray-100 transition-colors ${student.isCurrentUser ? 'bg-blue-50/50 border-blue-100' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Rank Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' : student.rank === 2 ? 'bg-slate-200 text-slate-700' : student.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                          #{student.rank}
                        </div>

                        <div>
                          <h4 className={`font-bold text-lg flex items-center gap-2 ${student.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                            {student.name}
                            {student.isCurrentUser && <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] uppercase tracking-widest rounded-md">You</span>}
                          </h4>
                          <p className="text-sm text-gray-500">{student.school}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-gray-900">{student.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI FEEDBACK TAB */}
            {activeTab === 'ai-feedback' && (
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 min-h-[400px] flex flex-col animate-in fade-in slide-in-from-bottom-4">

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Personalised Analysis
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Generated by AI
                  </span>
                </div>

                {isAiLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 relative mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Analyzing your performance...</h4>
                    <p className="text-gray-500 max-w-sm">Gemini is reviewing your topic-wise accuracy to generate personalized study recommendations.</p>
                  </div>
                ) : (
                  <div className="flex-1 text-gray-700 leading-relaxed font-medium space-y-6 whitespace-pre-wrap animate-in fade-in duration-700">
                    {aiFeedback}
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATE TAB */}
            {activeTab === 'certificate' && isPodium && (
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">

                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your Certificate of Merit</h3>
                    <p className="text-gray-500">Congratulations! As a top 3 finisher, you have earned a formal certificate.</p>
                  </div>
                  <button
                    onClick={handleDownloadCert}
                    className="shrink-0 flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                </div>

                {/* Certificate Preview Mock */}
                <div className="aspect-[1.414] w-full max-w-2xl mx-auto bg-slate-50 border-8 border-double border-slate-300 p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group cursor-pointer" onClick={handleDownloadCert}>

                  <div className="absolute inset-0 bg-white/40 group-hover:bg-white/0 transition-colors pointer-events-none"></div>

                  <Award className={`w-20 h-20 mb-6 ${mockResult.rank === 1 ? 'text-yellow-500' : mockResult.rank === 2 ? 'text-slate-400' : 'text-orange-500'}`} />

                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Certificate of Merit</h4>
                  <h2 className="text-4xl font-serif text-slate-900 mb-6">EduOlympia</h2>

                  <p className="text-gray-600 mb-4">This is proudly presented to</p>
                  <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">Arjun Sharma</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-10">
                    For securing <strong className="text-gray-900">Rank {mockResult.rank}</strong> in the {mockResult.title} with a score of {mockResult.score}%.
                  </p>

                  <div className="w-full flex justify-between px-10 border-t border-slate-300 pt-6 mt-auto">
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">{mockResult.date}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Date</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 signature-font">EduOlympia Admin</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Signature</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
