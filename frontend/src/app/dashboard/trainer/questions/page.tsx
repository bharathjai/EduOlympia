"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, X } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TrainerQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswerIndex: 0,
    subject: '',
    difficulty: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    const { data, error } = await supabase.from('trainer_questions').select('*').order('id', { ascending: false });
    if (!error && data) {
      setQuestions(data.map(q => ({
        id: q.id,
        text: q.question_text,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        type: q.type,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], // Mock options since DB doesn't have options column
        correctAnswer: 'Option 1'
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await supabase.from('trainer_questions').delete().eq('id', id);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('trainer_questions').insert([{
        question_text: formData.text,
        subject: formData.subject,
        topic: 'General',
        difficulty: formData.difficulty,
        type: 'Multiple Choice'
      }]);
      
      fetchQuestions();
      setIsModalOpen(false);
      setFormData({
        text: '', option1: '', option2: '', option3: '', option4: '', correctAnswerIndex: 0, subject: '', difficulty: 'Medium'
      });
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-500 mt-1">Manage and create Multiple Choice Questions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❓</div>
            <h3 className="font-bold text-gray-900 mb-1">No questions yet</h3>
            <p className="text-sm text-gray-500 mb-6">Build your question bank to create practice papers later.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-brand font-semibold text-sm hover:underline">
              Create your first question
            </button>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-600 font-bold text-xs px-2 py-1 rounded">Q{questions.length - idx}</span>
                  <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded">{q.subject}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {q.difficulty}
                  </span>
                </div>
                <button onClick={() => handleDelete(q.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{q.text}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt: string, i: number) => {
                  const isCorrect = opt === q.correctAnswer;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100'}`}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
                      <span className={`text-sm ${isCorrect ? 'font-semibold text-emerald-900' : 'text-gray-600'}`}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-xl text-gray-900">Add New Question</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Question Text</label>
                  <textarea 
                    required
                    placeholder="Type the question here..."
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand min-h-[100px] resize-y"
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                    <input 
                      type="text" required placeholder="e.g., Mathematics"
                      className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Difficulty</label>
                    <select 
                      className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Answer Options <span className="text-xs font-normal text-gray-500">(Select the correct one)</span></label>
                  
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${formData.correctAnswerIndex === index ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="correctAnswer" 
                        checked={formData.correctAnswerIndex === index}
                        onChange={() => setFormData({...formData, correctAnswerIndex: index})}
                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 ml-2 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        required
                        placeholder={`Option ${index + 1}`}
                        className="w-full px-3 py-2 text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                        value={formData[`option${index + 1}` as keyof typeof formData] as string}
                        onChange={(e) => setFormData({...formData, [`option${index + 1}`]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 px-4 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                  {isSubmitting ? "Saving..." : <><Plus className="w-5 h-5" /> Save Question</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
