"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Play, CheckCircle2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

export default function PracticeTestsPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [completedTests, setCompletedTests] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchPapers = async () => {
    // Fetch papers
    const { data: papersData, error: papersError } = await supabase
      .from('practice_papers')
      .select('*')
      .order('id', { ascending: false });
      
    if (!papersError && papersData) {
      setPapers(papersData.map(p => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        class: p.class_grade,
        totalQuestions: p.total_questions,
        difficulty: p.difficulty,
        createdAt: new Date().toISOString() // Mocking for now since original schema lacked created_at
      })));
    }
    
    // Fetch completed test IDs
    const { data: resultsData, error: resultsError } = await supabase
      .from('student_test_results')
      .select('paper_id')
      .eq('student_name', 'Aarav Sharma');
      
    if (!resultsError && resultsData) {
      const completed = new Set(resultsData.map(r => r.paper_id));
      setCompletedTests(completed);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPapers();

    const channel = supabase
      .channel('student_practice_papers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'practice_papers' },
        (payload) => {
          fetchPapers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Practice Tests</h1>
        <p className="text-gray-500 mt-1">Access your assigned practice tests and quizzes to improve your skills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading practice papers...</div>
        ) : papers.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-4xl">📝</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">No Practice Tests Yet</h3>
            <p className="text-gray-500 max-w-md">Your trainer hasn't assigned any practice tests yet. Check back later!</p>
          </div>
        ) : (
          papers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative flex flex-col h-full group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  paper.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  paper.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {paper.difficulty}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{paper.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{paper.subject} • {paper.class}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Questions</p>
                  <p className="font-semibold text-gray-900">{paper.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Added</p>
                  <p className="font-semibold text-gray-900">{new Date(paper.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {completedTests.has(paper.id) ? (
                <Link 
                  href="/dashboard/student/results"
                  className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </Link>
              ) : (
                <Link 
                  href={`/dashboard/student/practice/${paper.id}`}
                  className="w-full bg-brand/10 text-brand hover:bg-brand hover:text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Test
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
