"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Trash2, Plus, Users, Calendar, X, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TrainerPracticePage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subject: '', class: '', totalQuestions: 20 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPapers = async () => {
    const { data, error } = await supabase.from('practice_papers').select('*').order('id', { ascending: false });
    if (!error && data) {
      setPapers(data.map(p => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        class: p.class_grade,
        totalQuestions: p.total_questions,
        createdAt: new Date().toISOString()
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPapers();

    const channel = supabase
      .channel('practice_papers_changes')
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this practice paper?')) return;
    try {
      await supabase.from('practice_papers').delete().eq('id', id);
      fetchPapers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('practice_papers').insert([{
        title: formData.title,
        subject: formData.subject,
        class_grade: formData.class,
        total_questions: formData.totalQuestions,
        difficulty: 'Medium'
      }]);
      
      fetchPapers();
      setIsModalOpen(false);
      setFormData({ title: '', subject: '', class: '', totalQuestions: 20 });
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Papers</h1>
          <p className="text-gray-500 mt-1">Assemble practice tests from your question bank.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Paper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading practice papers...</div>
        ) : papers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
            <h3 className="font-bold text-gray-900 mb-1">No practice papers yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first practice test to assign to students.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-brand font-semibold text-sm hover:underline">
              Create a practice paper
            </button>
          </div>
        ) : (
          papers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative flex flex-col h-full group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <button onClick={() => handleDelete(paper.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{paper.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{paper.subject} • {paper.class}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Questions</p>
                  <p className="font-semibold text-gray-900">{paper.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="font-semibold text-gray-900">{new Date(paper.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Paper Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">Create Practice Paper</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paper Title</label>
                <input 
                  type="text" required placeholder="e.g., Midterm Mock Test"
                  className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                  <input 
                    type="text" required placeholder="e.g., Physics"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class/Grade</label>
                  <input 
                    type="text" required placeholder="e.g., Class 10"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Questions to Auto-Select</label>
                <input 
                  type="number" required min="1" max="100"
                  className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  value={formData.totalQuestions}
                  onChange={(e) => setFormData({...formData, totalQuestions: parseInt(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Questions will be randomly picked from bank
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 px-4 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                  {isSubmitting ? "Generating..." : <><FileText className="w-5 h-5" /> Generate Paper</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
