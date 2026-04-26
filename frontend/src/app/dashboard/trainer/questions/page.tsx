"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo } from "react";
import { 
  Search, Plus, Sparkles, Upload, Filter, MoreVertical, 
  CheckCircle2, Circle, X, Trash2, Edit3, Archive, FileSpreadsheet, Loader2, BookOpen, AlertCircle
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";
export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('trainer_questions').select('*');

      if (data) {
        setQuestions(data.map((q: any) => ({
          id: q.id.toString(),
          text: q.question_text,
          type: q.type || 'MCQ',
          difficulty: q.difficulty || 'Medium',
          subject: q.subject || 'General',
          chapter: q.topic || 'General',
          usedIn: 0,
          status: 'Active',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswerIndex: 0,
          explanation: 'No explanation provided.'
        })));
      }
    };
    fetchQuestions();
  }, []);
  
  // Filters
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection & Preview
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<"add" | "ai" | "import" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "loading" | "preview">("idle");
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<any[]>([]);

  // Filtering Logic
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSubject = subjectFilter === "All" || q.subject === subjectFilter;
      const matchDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
      const matchStatus = statusFilter === "All" || q.status === statusFilter;
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchDifficulty && matchStatus && matchSearch;
    });
  }, [questions, subjectFilter, difficultyFilter, statusFilter, searchQuery]);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  // Handlers
  const handleRetire = (id: string) => {
    if(!confirm("Retire this question? It will no longer be available for new exams.")) return;
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: "Retired" } : q));
    if(selectedQuestionId === id) setSelectedQuestionId(null);
  };

  const handleSimulateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal(null);
      alert("Question added to bank!");
    }, 1000);
  };

  const handleSimulateAiGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setAiState("loading");
    
    // Simulate Gemini API Delay (4 seconds)
    setTimeout(() => {
      setAiGeneratedQuestions([
        {
          id: "ai1",
          text: "What is the chemical symbol for Gold?",
          options: ["Ag", "Au", "Pb", "Fe"],
          correctAnswerIndex: 1,
          explanation: "Au comes from the Latin word 'aurum' meaning shining dawn.",
          checked: true
        },
        {
          id: "ai2",
          text: "Which planet is known as the Red Planet?",
          options: ["Venus", "Jupiter", "Saturn", "Mars"],
          correctAnswerIndex: 3,
          explanation: "Mars appears red due to iron oxide (rust) on its surface.",
          checked: true
        }
      ]);
      setAiState("preview");
    }, 4000);
  };

  const handleAcceptAiQuestions = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const toAdd = aiGeneratedQuestions.filter(q => q.checked).map(q => ({
        id: "new_" + Math.random().toString(36).substr(2, 9),
        text: q.text,
        type: "MCQ",
        difficulty: "Medium",
        subject: "Generated",
        chapter: "AI Gen",
        usedIn: 0,
        status: "Active",
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      }));
      setQuestions(prev => [...toAdd, ...prev]);
      setActiveModal(null);
      setAiState("idle");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex flex-col h-[calc(100vh-80px)] font-sans">
        
        {/* --- HEADER --- */}
        <div className="bg-white p-6 border-b border-gray-200 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Question Bank</h1>
              <p className="text-gray-500 font-medium mt-1">Manage, generate, and organize all assessment items.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setActiveModal("import")} className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import Excel
              </button>
              <button onClick={() => setActiveModal("ai")} className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate with AI
              </button>
              <button onClick={() => setActiveModal("add")} className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
               <Filter className="w-4 h-4 text-gray-400" />
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
                 <option value="All">All Subjects</option>
                 <option value="Mathematics">Mathematics</option>
                 <option value="Science">Science</option>
               </select>
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
                 <option value="All">All Difficulties</option>
                 <option value="Easy">Easy</option>
                 <option value="Medium">Medium</option>
                 <option value="Hard">Hard</option>
               </select>
               <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                 <option value="All">All Statuses</option>
                 <option value="Active">Active</option>
                 <option value="Retired">Retired</option>
               </select>
            </div>
          </div>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div className="flex-1 flex overflow-hidden bg-slate-50">
          
          {/* Left Column: Question List */}
          <div className={`flex-1 overflow-y-auto p-6 ${selectedQuestionId ? 'hidden lg:block lg:max-w-2xl xl:max-w-3xl' : ''}`}>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">
                Showing {filteredQuestions.length} of {questions.length} questions
              </h2>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 border-dashed p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-500 font-medium">Clear your filters or add new questions to the bank.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md ${selectedQuestionId === q.id ? 'border-purple-600 ring-1 ring-purple-600 shadow-md' : 'border-gray-200'} ${q.status === 'Retired' ? 'opacity-60' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-md">{q.type}</span>
                      <span className={`px-2 py-0.5 font-bold text-xs rounded-md ${q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                        {q.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold text-xs rounded-md">{q.subject}</span>
                      {q.status === 'Retired' && <span className="px-2 py-0.5 bg-slate-800 text-white font-bold text-xs rounded-md">Retired</span>}
                    </div>
                    
                    <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-4">{q.text}</h3>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-gray-400">Used in {q.usedIn} exams</span>
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button className="text-gray-400 hover:text-gray-900 p-1.5 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        {q.status === 'Active' && (
                          <button onClick={() => handleRetire(q.id)} className="text-gray-400 hover:text-red-600 p-1.5 transition-colors"><Archive className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Preview Panel */}
          {selectedQuestionId && selectedQuestion && (
            <div className="w-full lg:w-[400px] xl:w-[450px] bg-white border-l border-gray-200 flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-300 z-10 absolute lg:relative inset-y-0 right-0">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" /> Question Preview
                </h3>
                <button onClick={() => setSelectedQuestionId(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full shadow-sm border border-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="flex gap-2 mb-6">
                   <span className="px-2 py-1 bg-gray-100 text-gray-600 font-bold text-xs rounded-md">{selectedQuestion.chapter}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-8">{selectedQuestion.text}</h2>
                
                <div className="space-y-3 mb-8">
                  {selectedQuestion.options.map((opt, idx) => {
                    const isCorrect = idx === selectedQuestion.correctAnswerIndex;
                    return (
                      <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 bg-white'}`}>
                        <div className="mt-0.5 shrink-0">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                        </div>
                        <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-900' : 'text-gray-700'}`}>{opt}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <h4 className="text-xs font-black text-purple-800 uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Explanation</h4>
                  <p className="text-sm font-medium text-purple-900 leading-relaxed">{selectedQuestion.explanation}</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex gap-3">
                <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">Edit</button>
                {selectedQuestion.status === 'Active' && (
                  <button onClick={() => handleRetire(selectedQuestion.id)} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">Retire</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- MODALS --- */}

        {/* Add Question Drawer */}
        {activeModal === "add" && (
          <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right-full duration-300 flex flex-col">
               <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                 <h3 className="text-xl font-black text-gray-900">Add New Question</h3>
                 <button onClick={() => !isSubmitting && setActiveModal(null)} className="text-gray-400 hover:text-gray-900 p-2 bg-white rounded-full border border-gray-200 shadow-sm" disabled={isSubmitting}>
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <form onSubmit={handleSimulateAdd} className="flex-1 overflow-y-auto p-6 space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Question Text</label>
                   <textarea required placeholder="What is..." className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold text-gray-900 min-h-[120px]" disabled={isSubmitting} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                     <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none font-semibold text-gray-900" disabled={isSubmitting}>
                       <option>Mathematics</option>
                       <option>Science</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Difficulty</label>
                     <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none font-semibold text-gray-900" disabled={isSubmitting}>
                       <option>Easy</option>
                       <option>Medium</option>
                       <option>Hard</option>
                     </select>
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Options (Mark correct answer)</label>
                   <div className="space-y-3">
                     {[1, 2, 3, 4].map((num, i) => (
                       <div key={num} className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 bg-white">
                         <input type="radio" name="correct" defaultChecked={i===0} className="w-5 h-5 text-emerald-500 ml-2" disabled={isSubmitting} />
                         <input type="text" required placeholder={`Option ${num}`} className="flex-1 px-3 py-2 bg-transparent border-none focus:ring-0 outline-none font-medium text-gray-900" disabled={isSubmitting} />
                       </div>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Explanation</label>
                   <textarea placeholder="Explain why the answer is correct..." className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold text-gray-900 min-h-[80px]" disabled={isSubmitting} />
                 </div>
               </form>
               
               <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                 <button onClick={handleSimulateAdd} disabled={isSubmitting} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                   {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Question to Bank"}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* AI Generator Modal */}
        {activeModal === "ai" && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
               <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 shrink-0 flex justify-between items-start text-white">
                 <div>
                   <h3 className="text-2xl font-black flex items-center gap-2 mb-1">
                     <Sparkles className="w-6 h-6 text-indigo-200" /> AI Question Generator
                   </h3>
                   <p className="text-indigo-100 font-medium text-sm">Powered by Gemini Flash. Instantly create high-quality assessments.</p>
                 </div>
                 <button onClick={() => aiState !== "loading" && setActiveModal(null)} className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full" disabled={aiState === "loading"}>
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               {aiState === "idle" && (
                 <form onSubmit={handleSimulateAiGenerate} className="p-8 overflow-y-auto">
                   <div className="grid grid-cols-2 gap-6 mb-6">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                       <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900">
                         <option>Science</option>
                         <option>Mathematics</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chapter / Topic</label>
                       <input type="text" required placeholder="e.g. Periodic Table" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 mb-8">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Difficulty</label>
                       <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900">
                         <option>Medium</option>
                         <option>Hard</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Number of Questions</label>
                       <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900">
                         <option>5 Questions</option>
                         <option>10 Questions</option>
                         <option>20 Questions</option>
                       </select>
                     </div>
                   </div>

                   <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 text-lg">
                     <Sparkles className="w-5 h-5" /> Generate Magic
                   </button>
                 </form>
               )}

               {aiState === "loading" && (
                 <div className="p-16 flex flex-col items-center justify-center text-center">
                   <div className="relative mb-8">
                     <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                     <Sparkles className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Gemini is generating your questions...</h3>
                   <p className="text-gray-500 font-medium">Analyzing topic "Periodic Table" and crafting distractors.</p>
                 </div>
               )}

               {aiState === "preview" && (
                 <div className="flex flex-col overflow-hidden">
                   <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3 shrink-0 px-6">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                     <span className="font-bold text-emerald-900">Generated 2 high-quality questions successfully.</span>
                   </div>
                   
                   <div className="overflow-y-auto p-6 space-y-4 bg-gray-50 flex-1">
                     {aiGeneratedQuestions.map((q, idx) => (
                       <div key={q.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex gap-4">
                         <div className="pt-1">
                           <input 
                             type="checkbox" 
                             checked={q.checked} 
                             onChange={(e) => {
                               const newQs = [...aiGeneratedQuestions];
                               newQs[idx].checked = e.target.checked;
                               setAiGeneratedQuestions(newQs);
                             }}
                             className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                           />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-bold text-gray-900 mb-3">{q.text}</h4>
                           <div className="grid grid-cols-2 gap-2 mb-3">
                             {q.options.map((opt: string, oidx: number) => (
                               <div key={oidx} className={`p-2 rounded-lg border text-sm font-medium ${oidx === q.correctAnswerIndex ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                                 {opt}
                               </div>
                             ))}
                           </div>
                           <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg font-medium"><span className="font-bold text-indigo-600">Explanation:</span> {q.explanation}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                     <button onClick={handleAcceptAiQuestions} disabled={isSubmitting} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Add ${aiGeneratedQuestions.filter(q => q.checked).length} Selected to Bank`}
                     </button>
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
