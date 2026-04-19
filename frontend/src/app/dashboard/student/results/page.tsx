"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Trophy, Target, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics State
  const [totalTests, setTotalTests] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('student_test_results')
        .select('*')
        .eq('student_name', 'Aarav Sharma')
        .order('completed_at', { ascending: false });

      if (data && data.length > 0) {
        setResults(data);
        setTotalTests(data.length);
        
        // Calculate average score percentage
        let totalScore = 0;
        let totalQuestionsAll = 0;
        
        data.forEach(r => {
          totalScore += r.score;
          totalQuestionsAll += r.total_questions;
        });
        
        const avgRawScore = totalScore / data.length;
        setAvgScore(Math.round(avgRawScore));
        setAccuracy(Math.round((totalScore / totalQuestionsAll) * 100));
      }
      
      setLoading(false);
    };

    fetchResults();
    
    // Set up Realtime listener to update if a test is taken in another tab
    const subscription = supabase
      .channel('results_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'student_test_results' }, fetchResults)
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Your Performance Hub <span className="text-2xl">📈</span>
        </h1>
        <p className="text-gray-500 mt-1">Track your progress, scores, and areas for improvement.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Loading your analytics...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Tests Taken</p>
                <p className="text-3xl font-bold text-gray-900">{totalTests}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{avgScore} <span className="text-base text-gray-400 font-normal">pts</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Overall Accuracy</p>
                <p className="text-3xl font-bold text-gray-900">{accuracy}%</p>
              </div>
            </div>
            
            <div className="bg-brand text-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80 mb-1">Study Streak</p>
                <p className="text-3xl font-bold text-white">12 Days</p>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Test History</h2>
            </div>
            
            {results.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                You haven't taken any practice tests yet. Head over to the Practice tab to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Test Name</th>
                      <th className="px-6 py-4">Date Taken</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4 text-center">Accuracy</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((result) => {
                      const date = new Date(result.completed_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      });
                      const acc = Math.round((result.score / result.total_questions) * 100);
                      
                      return (
                        <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-bold text-gray-900">{result.paper_title}</p>
                            <p className="text-xs text-gray-500 mt-1">Practice Assessment</p>
                          </td>
                          <td className="px-6 py-5 text-gray-600 text-sm">{date}</td>
                          <td className="px-6 py-5 text-center">
                            <span className="font-bold text-gray-900">{result.score}</span>
                            <span className="text-gray-400 text-xs">/{result.total_questions}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className={"h-1.5 rounded-full " + (acc > 75 ? 'bg-emerald-500' : acc > 50 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${acc}%` }}></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-600 w-8">{acc}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
