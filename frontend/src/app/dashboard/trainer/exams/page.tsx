"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Search, Plus, Filter, Trash2, GripVertical, Settings2, 
  ChevronDown, ChevronUp, AlertTriangle, Sparkles, Check, Loader2, Save, Send, AlertCircle, RefreshCw
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";
export default function CreateExamPage() {
  const router = useRouter();
  const [questionBank, setQuestionBank] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select(`
        id,
        question_text,
        type,
        difficulty,
        topics (
          name,
          chapters (
            name,
            subjects (
              name
            )
          )
        )
      `);

      if (data) {
        setQuestionBank(data.map((q: any) => ({
          id: q.id.toString(),
          text: q.question_text,
          type: q.type === 'mcq' ? 'MCQ' : 'T/F',
          difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
          subject: q.topics?.chapters?.subjects?.name || 'General',
          chapter: q.topics?.chapters?.name || 'General',
        })));
      }
    };
    fetchQuestions();
  }, []);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isSettingsConfirmed, setIsSettingsConfirmed] = useState(false);
  const [settings, setSettings] = useState({
    title: "",
    subject: "Mathematics",
    targetBatch: "All Schools",
    totalMarks: 20,
    timeLimit: 60,
    negativeMarking: false,
    deduction: 0.25
  });

  // Filter State for Bank
  const [searchQuery, setSearchQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");

  // Paper State
  const [paperQuestions, setPaperQuestions] = useState<{q: any, marks: number}[]>([]);

  // AI Balance State
  const [aiState, setAiState] = useState<"idle" | "loading" | "result">("idle");
  
  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived Values
  const currentTotalMarks = paperQuestions.reduce((sum, item) => sum + item.marks, 0);
  const hasMarksMismatch = currentTotalMarks !== settings.totalMarks;

  const filteredBank = useMemo(() => {
    return questionBank.filter(q => {
      if (q.subject !== settings.subject && isSettingsConfirmed) return false;
      if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [questionBank, searchQuery, diffFilter, settings.subject, isSettingsConfirmed]);

  const handleConfirmSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsConfirmed(true);
    setIsSettingsOpen(false);
  };

  const handleAddQuestion = (q: any) => {
    // Default marks based on difficulty
    const defaultMarks = q.difficulty === 'Easy' ? 1 : q.difficulty === 'Medium' ? 2 : 4;
    setPaperQuestions([...paperQuestions, { q, marks: defaultMarks }]);
  };

  const handleRemoveQuestion = (id: string) => {
    setPaperQuestions(paperQuestions.filter(item => item.q.id !== id));
  };

  const handleUpdateMarks = (id: string, marks: number) => {
    setPaperQuestions(paperQuestions.map(item => item.q.id === id ? { ...item, marks: marks || 0 } : item));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...paperQuestions];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    setPaperQuestions(newArr);
  };

  const handleMoveDown = (index: number) => {
    if (index === paperQuestions.length - 1) return;
    const newArr = [...paperQuestions];
    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    setPaperQuestions(newArr);
  };

  const handleCheckBalance = () => {
    setAiState("loading");
    setTimeout(() => {
      setAiState("result");
    }, 3500);
  };

  const handleAddAiSuggestion = () => {
    // Add a specific hard question as suggested
    const suggestion = questionBank.find(q => q.id === "q3" || q.difficulty === 'Hard'); // Irrational numbers
    if (suggestion && !paperQuestions.find(item => item.q.id === suggestion.id)) {
      handleAddQuestion(suggestion);
    }
    setAiState("idle");
  };

  const handleSubmit = (action: "draft" | "submit") => {
    if (hasMarksMismatch) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert(action === "submit" ? "Submitted. Super admin will review and schedule this exam." : "Saved as Draft.");
      router.push("/dashboard/trainer");
    }, 1500);
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans bg-slate-50 relative">
        
        {/* --- HEADER --- */}
        <div className="bg-white p-6 border-b border-gray-200 shrink-0 flex items-center justify-between z-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Create Exam Paper</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Configure settings and select questions from the bank.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSubmit("draft")}
              disabled={!isSettingsConfirmed || isSubmitting}
              className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
               <Save className="w-4 h-4" /> Save Draft
            </button>
            <button 
              onClick={() => handleSubmit("submit")}
              disabled={!isSettingsConfirmed || paperQuestions.length === 0 || hasMarksMismatch || isSubmitting}
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
               Submit for Approval
            </button>
          </div>
        </div>

        {/* --- MARKS MISMATCH WARNING --- */}
        {isSettingsConfirmed && hasMarksMismatch && (
          <div className="bg-orange-50 border-b border-orange-200 p-4 shrink-0 flex items-center justify-center gap-3 text-orange-800 font-bold animate-in slide-in-from-top-4">
             <AlertTriangle className="w-5 h-5" />
             Question marks total {currentTotalMarks}, but exam is set to {settings.totalMarks}. Adjust marks to submit.
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* --- LEFT PANEL: QUESTION BANK --- */}
          <div className={`w-full lg:w-[400px] xl:w-[450px] bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all ${!isSettingsConfirmed ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
             <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                   <FileText className="w-4 h-4 text-purple-600" /> Question Bank
                </h3>
                
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" placeholder="Search..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <select 
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none"
                    value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
                  >
                    <option value="All">All Diff.</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-purple-600 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
               {!isSettingsConfirmed && (
                 <div className="text-center p-6 mt-10">
                   <Settings2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                   <h4 className="font-bold text-gray-600 mb-1">Configure Exam First</h4>
                   <p className="text-xs text-gray-500">Confirm the exam settings to unlock the question bank.</p>
                 </div>
               )}

               {isSettingsConfirmed && filteredBank.map(q => {
                 const isAdded = paperQuestions.some(item => item.q.id === q.id);
                 return (
                   <div key={q.id} className={`bg-white rounded-xl p-4 border transition-all ${isAdded ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-purple-300 shadow-sm'}`}>
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">{q.type}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{q.chapter}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{q.text}</p>
                        </div>
                        <button 
                          onClick={() => !isAdded && handleAddQuestion(q)}
                          disabled={isAdded}
                          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isAdded ? 'bg-emerald-100 text-emerald-600 cursor-default' : 'bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white'}`}
                        >
                          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

          {/* --- RIGHT PANEL: PAPER BUILDER --- */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            
            {/* Exam Settings Collapsible Panel */}
            <div className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden mb-8 shadow-sm ${isSettingsConfirmed && !isSettingsOpen ? 'border-emerald-200' : 'border-gray-200'}`}>
               <div 
                 className={`p-5 flex items-center justify-between cursor-pointer ${isSettingsConfirmed && !isSettingsOpen ? 'bg-emerald-50/30' : 'bg-gray-50'}`}
                 onClick={() => isSettingsConfirmed && setIsSettingsOpen(!isSettingsOpen)}
               >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSettingsConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                      {isSettingsConfirmed ? <Check className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="font-black text-gray-900">Exam Configuration</h2>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                        {isSettingsConfirmed ? `${settings.title || 'Untitled'} • ${settings.totalMarks} Marks • ${settings.timeLimit} Mins` : 'Required before adding questions'}
                      </p>
                    </div>
                  </div>
                  {isSettingsConfirmed && (
                    <div className="text-gray-400 p-2 hover:bg-white rounded-lg">
                      {isSettingsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
               </div>

               {isSettingsOpen && (
                 <form onSubmit={handleConfirmSettings} className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Exam Title</label>
                        <input type="text" required placeholder="e.g. Mid-Term Assessment" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none font-bold text-gray-900" value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none font-bold text-gray-900" value={settings.subject} onChange={e => setSettings({...settings, subject: e.target.value})}>
                          <option>Mathematics</option>
                          <option>Science</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Batch</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none font-bold text-gray-900" value={settings.targetBatch} onChange={e => setSettings({...settings, targetBatch: e.target.value})}>
                          <option>All Schools</option>
                          <option>Delhi Public School</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Marks</label>
                        <input type="number" required min="1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none font-bold text-gray-900" value={settings.totalMarks} onChange={e => setSettings({...settings, totalMarks: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time Limit (Mins)</label>
                        <input type="number" required min="5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none font-bold text-gray-900" value={settings.timeLimit} onChange={e => setSettings({...settings, timeLimit: Number(e.target.value)})} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                      <div className="flex items-center gap-3">
                         <input type="checkbox" id="neg" className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer" checked={settings.negativeMarking} onChange={e => setSettings({...settings, negativeMarking: e.target.checked})} />
                         <label htmlFor="neg" className="font-bold text-gray-700 cursor-pointer">Enable Negative Marking</label>
                      </div>
                      {settings.negativeMarking && (
                        <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
                          <span className="font-bold text-gray-500 text-sm">Deduction:</span>
                          <input type="number" step="0.25" min="0" className="w-20 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-purple-600 outline-none" value={settings.deduction} onChange={e => setSettings({...settings, deduction: Number(e.target.value)})} />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md">
                        {isSettingsConfirmed ? "Update Settings" : "Confirm Settings"}
                      </button>
                    </div>
                 </form>
               )}
            </div>

            {/* Paper Builder */}
            {isSettingsConfirmed && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
                   <div>
                     <h2 className="text-xl font-black">{settings.title || 'Untitled Exam'}</h2>
                     <p className="text-slate-400 text-sm font-medium mt-1">{settings.subject} • {paperQuestions.length} Questions</p>
                   </div>
                   <div className="flex items-center gap-6 bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                        <p className="font-black text-xl">{settings.timeLimit}m</p>
                      </div>
                      <div className="w-px h-10 bg-slate-700"></div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Marks</p>
                        <p className={`font-black text-xl ${hasMarksMismatch ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {currentTotalMarks} <span className="text-sm text-slate-500">/ {settings.totalMarks}</span>
                        </p>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-end shrink-0">
                  <button 
                    onClick={handleCheckBalance}
                    disabled={paperQuestions.length === 0 || aiState === "loading"}
                    className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" /> Check Paper Balance
                  </button>
                </div>

                <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
                   {paperQuestions.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-300 rounded-3xl bg-white">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4"><Plus className="w-8 h-8" /></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Paper is empty</h3>
                        <p className="text-gray-500 font-medium">Add questions from the bank on the left to build your exam.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {paperQuestions.map((item, index) => (
                         <div key={item.q.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-stretch overflow-hidden group">
                           {/* Drag handle / Index */}
                           <div className="w-12 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-4 gap-2 text-gray-400">
                             <span className="font-black text-gray-900 text-sm">{index + 1}</span>
                             <div className="flex flex-col gap-1 mt-auto">
                               <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="hover:text-purple-600 disabled:opacity-30"><ChevronUp className="w-5 h-5"/></button>
                               <button onClick={() => handleMoveDown(index)} disabled={index === paperQuestions.length - 1} className="hover:text-purple-600 disabled:opacity-30"><ChevronDown className="w-5 h-5"/></button>
                             </div>
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 p-5">
                             <div className="flex justify-between items-start mb-3 gap-4">
                               <h4 className="font-semibold text-gray-900 leading-snug">{item.q.text}</h4>
                               <button onClick={() => handleRemoveQuestion(item.q.id)} className="text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                             
                             <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                               <div className="flex items-center gap-2">
                                 <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-md">{item.q.type}</span>
                                 <span className={`px-2 py-0.5 font-bold text-xs rounded-md ${item.q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : item.q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                   {item.q.difficulty}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Marks:</label>
                                 <input 
                                   type="number" min="1" 
                                   className="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 p-0"
                                   value={item.marks}
                                   onChange={e => handleUpdateMarks(item.q.id, parseInt(e.target.value) || 0)}
                                 />
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* --- AI BALANCE RESULT SIDEBAR --- */}
          {aiState !== "idle" && (
            <div className="w-full lg:w-[350px] bg-indigo-900 border-l border-indigo-800 text-white flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-300 z-20 absolute lg:relative inset-y-0 right-0 shadow-2xl">
              <div className="p-6 border-b border-indigo-800 flex justify-between items-center bg-indigo-950">
                <h3 className="font-black flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-indigo-300" /> AI Analysis</h3>
                <button onClick={() => setAiState("idle")} className="text-indigo-400 hover:text-white p-2 bg-white/5 rounded-full"><X className="w-4 h-4"/></button>
              </div>

              {aiState === "loading" ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-800 border-t-indigo-400 animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-indigo-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Analyzing your paper...</h4>
                  <p className="text-indigo-300 text-sm font-medium">Checking topic distribution and difficulty spread.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                     <h4 className="font-bold text-indigo-200 text-xs uppercase tracking-widest mb-4">Difficulty Spread</h4>
                     <div className="flex h-3 w-full rounded-full overflow-hidden mb-2">
                       <div className="bg-emerald-400 w-[50%]"></div>
                       <div className="bg-amber-400 w-[50%]"></div>
                       <div className="bg-red-400 w-[0%]"></div>
                     </div>
                     <div className="flex justify-between text-xs font-bold text-indigo-100">
                       <span>50% Easy</span>
                       <span>50% Med</span>
                       <span>0% Hard</span>
                     </div>
                   </div>

                   <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                     <h4 className="font-bold text-indigo-200 text-xs uppercase tracking-widest mb-4">Coverage Analysis</h4>
                     <p className="text-sm font-medium leading-relaxed mb-4">
                       <strong>Cell Biology:</strong> 60% of paper.<br/>
                       <strong>Physics:</strong> 40% of paper.<br/>
                       No Hard questions detected.
                     </p>
                     
                     <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800 relative">
                       <Sparkles className="w-4 h-4 text-amber-400 absolute top-4 right-4" />
                       <h5 className="font-bold text-amber-400 text-sm mb-2">Suggestion</h5>
                       <p className="text-xs text-indigo-200 mb-4 leading-relaxed">Add 1-2 Hard questions from the "Number System" or "Algebra" chapters to balance the assessment.</p>
                       <button onClick={handleAddAiSuggestion} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-colors">
                         + Add Recommended Question
                       </button>
                     </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
