"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo } from "react";
import { 
  MessageSquare, Search, Flag, CheckCircle2, Clock, Send, Bot, User, CornerDownRight, Check, X
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";

export default function DoubtQueuePage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Unanswered" | "Answered" | "Flagged">("Unanswered");

  useEffect(() => {
    const fetchDoubts = async () => {
      const { data, error } = await supabase.from('doubts').select(`
        id,
        question,
        ai_context,
        status,
        is_flagged,
        reply,
        created_at,
        users!student_id ( name, schools ( name ) ),
        subjects ( name ),
        chapters ( name )
      `).order('created_at', { ascending: false });

      let mappedDoubts: any[] = [];
      if (data) {
        mappedDoubts = data.map((d: any) => ({
          id: d.id.toString(),
          studentName: d.users?.name || 'Unknown Student',
          school: d.users?.schools?.name || 'Unknown School',
          subject: d.subjects?.name || 'General',
          chapter: d.chapters?.name || 'General',
          question: d.question,
          excerpt: d.question.length > 50 ? d.question.substring(0, 50) + '...' : d.question,
          aiContext: d.ai_context || 'No AI context provided.',
          timeAgo: new Date(d.created_at).toLocaleDateString(),
          status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
          isFlagged: d.is_flagged,
          unread: d.status === 'unanswered',
          reply: d.reply || ''
        }));
      }

      if (mappedDoubts.length === 0) {
        mappedDoubts = [
          {
            id: 'demo-doubt-1',
            studentName: 'Aarav Sharma',
            school: 'Delhi Public School',
            subject: 'Mathematics',
            chapter: 'Polynomials',
            question: "I'm having trouble understanding how to find the roots of a quadratic equation when the discriminant is negative. Can you explain the concept of imaginary numbers in this context?",
            excerpt: "I'm having trouble understanding how to find the ro...",
            aiContext: "Student struggled with 3 practice questions on quadratic equations. AI explained the formula but student asked for human clarification on negative square roots.",
            timeAgo: 'Just now',
            status: 'Unanswered',
            isFlagged: true,
            unread: true,
            reply: ''
          },
          {
            id: 'demo-doubt-2',
            studentName: 'Priya Patel',
            school: 'National Public School',
            subject: 'Science',
            chapter: 'Motion',
            question: "Why does the velocity-time graph for uniform acceleration form a straight line, but the displacement-time graph forms a curve? It's confusing to visualize.",
            excerpt: "Why does the velocity-time graph for uniform acceler...",
            aiContext: "Student was reviewing the differences between scalar and vector quantities. AI provided a textual explanation of graphs, but the student requested a more detailed physical analogy.",
            timeAgo: '2 hours ago',
            status: 'Unanswered',
            isFlagged: false,
            unread: true,
            reply: ''
          },
          {
            id: 'demo-doubt-3',
            studentName: 'Rohan Gupta',
            school: 'Kendriya Vidyalaya',
            subject: 'Mathematics',
            chapter: 'Real Numbers',
            question: "Can you provide another example of proving that square root of 2 is irrational? The textbook method using contradiction is a bit hard to follow.",
            excerpt: "Can you provide another example of proving that squ...",
            aiContext: "Student asked AI for a proof. AI provided the standard proof by contradiction. Student found it difficult and escalated.",
            timeAgo: '1 day ago',
            status: 'Answered',
            isFlagged: false,
            unread: false,
            reply: "Sure Rohan! Let's look at it differently. If sqrt(2) was a fraction a/b (in simplest form), then 2 = a^2 / b^2, meaning a^2 = 2b^2. This means a^2 is even, so 'a' must be even. If 'a' is even, we can write a = 2k. Substituting this back gives (2k)^2 = 2b^2, which simplifies to 4k^2 = 2b^2, or 2k^2 = b^2. This means b^2 is even, so 'b' is also even. But wait! We said a/b was in simplest form, so they can't both be even (divisible by 2). This is the contradiction that proves it cannot be a fraction!"
          }
        ];
      }

      setDoubts(mappedDoubts);
    };
    fetchDoubts();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);

  // Reply State
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Derived state
  const unansweredCount = doubts.filter(d => d.status === "Unanswered").length;
  const flaggedCount = doubts.filter(d => d.isFlagged).length;

  const filteredDoubts = useMemo(() => {
    return doubts.filter(d => {
      // Tab Filter
      if (activeTab === "Unanswered" && d.status !== "Unanswered") return false;
      if (activeTab === "Answered" && d.status !== "Answered") return false;
      if (activeTab === "Flagged" && !d.isFlagged) return false;
      
      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!d.studentName.toLowerCase().includes(query) && !d.question.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [doubts, activeTab, searchQuery]);

  const selectedDoubt = doubts.find(d => d.id === selectedDoubtId);

  // Handlers
  const handleSelectDoubt = (id: string) => {
    setSelectedDoubtId(id);
    setReplyText(doubts.find(d => d.id === id)?.reply || "");
    
    // Mark as read immediately
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, unread: false } : d));
  };

  const handleToggleFlag = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, isFlagged: !d.isFlagged } : d));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedDoubtId) return;
    
    setIsSending(true);
    await supabase.from('doubts').update({ reply: replyText, status: 'answered' }).eq('id', selectedDoubtId);
    
    setTimeout(() => {
      setDoubts(prev => prev.map(d => 
        d.id === selectedDoubtId 
          ? { ...d, status: "Answered", reply: replyText, unread: false } 
          : d
      ));
      setIsSending(false);
      // Don't auto-close the panel so they can see the success state
    }, 1000);
  };

  const handleMarkResolved = async () => {
    if (!selectedDoubtId) return;
    await supabase.from('doubts').update({ status: 'answered' }).eq('id', selectedDoubtId);
    setDoubts(prev => prev.map(d => 
      d.id === selectedDoubtId ? { ...d, status: "Answered", unread: false } : d
    ));
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex flex-col flex-1 overflow-hidden font-sans bg-slate-50 relative rounded-2xl border border-gray-200 shadow-sm">
        
        {/* --- HEADER --- */}
        <div className="bg-white p-6 md:p-8 border-b border-gray-200 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Doubt Queue</h1>
              <p className="text-gray-500 font-medium mt-1">Resolve escalated student doubts and review AI context.</p>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name or question..." 
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 font-medium focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button 
              onClick={() => setActiveTab("All")}
              className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${activeTab === 'All' ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              All Doubts
            </button>
            <button 
              onClick={() => setActiveTab("Unanswered")}
              className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'Unanswered' ? 'bg-purple-100 border border-purple-200 text-purple-800' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Unanswered
              {unansweredCount > 0 && (
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === 'Unanswered' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                  {unansweredCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("Answered")}
              className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all whitespace-nowrap ${activeTab === 'Answered' ? 'bg-emerald-100 border border-emerald-200 text-emerald-800' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Answered
            </button>
            <button 
              onClick={() => setActiveTab("Flagged")}
              className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'Flagged' ? 'bg-orange-100 border border-orange-200 text-orange-800' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Flag className="w-4 h-4" /> Flagged
              {flaggedCount > 0 && (
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === 'Flagged' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}>
                  {flaggedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Doubt List */}
          <div className={`overflow-y-auto p-4 md:p-6 space-y-3 ${selectedDoubtId ? 'hidden lg:block lg:w-1/2 flex-none' : 'w-full flex-1'}`}>
            
            {filteredDoubts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border border-gray-200 border-dashed">
                <div className="w-20 h-20 bg-purple-50 text-purple-300 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-10 h-10" /></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab === 'Unanswered' ? "No pending doubts!" : "No doubts found."}
                </h2>
                <p className="text-gray-500 font-medium max-w-xs">
                  {activeTab === 'Unanswered' ? "Students are all caught up and completely understand the material." : "Adjust your filters or search to find what you're looking for."}
                </p>
              </div>
            ) : (
              filteredDoubts.map((d) => (
                <div 
                  key={d.id} 
                  onClick={() => handleSelectDoubt(d.id)}
                  className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md ${selectedDoubtId === d.id ? 'border-purple-600 ring-1 ring-purple-600 shadow-md' : 'border-gray-200'} ${d.unread ? 'bg-purple-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {d.studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className={`text-sm text-gray-900 ${d.unread ? 'font-black' : 'font-bold'}`}>{d.studentName}</h3>
                        <p className="text-[10px] text-gray-500 font-semibold truncate">{d.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.unread && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {d.timeAgo}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded uppercase tracking-widest">{d.subject}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d.chapter}</span>
                    </div>
                    <p className={`text-sm text-gray-700 line-clamp-2 ${d.unread ? 'font-semibold text-gray-900' : 'font-medium'}`}>{d.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${d.status === 'Answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      {d.status}
                    </span>
                    <button 
                      onClick={(e) => handleToggleFlag(d.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${d.isFlagged ? 'bg-orange-100 text-orange-600' : 'text-gray-300 hover:text-orange-500 hover:bg-orange-50'}`}
                    >
                      <Flag className={`w-4 h-4 ${d.isFlagged ? 'fill-orange-600' : ''}`} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Doubt Detail */}
          {selectedDoubt && (
            <div className="w-full lg:w-1/2 bg-white border-l border-gray-200 flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-300 z-10 absolute lg:relative inset-y-0 right-0">
              
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedDoubtId(null)} className="lg:hidden p-2 text-gray-400 bg-white rounded-full shadow-sm border border-gray-200"><X className="w-4 h-4"/></button>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      {selectedDoubt.studentName} 
                      {selectedDoubt.status === 'Answered' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{selectedDoubt.school} • {selectedDoubt.timeAgo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedDoubt.status === 'Unanswered' && (
                    <button onClick={handleMarkResolved} className="hidden md:flex px-4 py-2 bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-gray-700 font-bold text-sm rounded-xl transition-all items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                    </button>
                  )}
                  <button 
                    onClick={() => handleToggleFlag(selectedDoubt.id)}
                    className={`p-2.5 rounded-xl border transition-all ${selectedDoubt.isFlagged ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-400 hover:text-orange-500'}`}
                  >
                    <Flag className={`w-5 h-5 ${selectedDoubt.isFlagged ? 'fill-orange-600' : ''}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* AI Context Note */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10"><Bot className="w-32 h-32 text-white" /></div>
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10"><Bot className="w-4 h-4" /> Prior AI Conversation</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10 italic">
                    "{selectedDoubt.aiContext}"
                  </p>
                </div>

                {/* Student Question */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shrink-0 mt-1 shadow-md">
                    {selectedDoubt.studentName.charAt(0)}
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-5 text-gray-800 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      Escalated Doubt 
                      <span className="bg-white px-2 py-0.5 rounded text-gray-500 border border-gray-200">{selectedDoubt.chapter}</span>
                    </p>
                    <p className="text-base font-medium leading-relaxed">{selectedDoubt.question}</p>
                  </div>
                </div>

                {/* Trainer Reply (if sent) */}
                {selectedDoubt.status === 'Answered' && (
                  <div className="flex gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shrink-0 mt-1 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tr-sm p-5 text-emerald-900 flex-1">
                      <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Check className="w-3 h-3"/> Your Reply Sent
                      </p>
                      <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">{selectedDoubt.reply}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Input Area */}
              {selectedDoubt.status === 'Unanswered' && (
                <div className="p-4 md:p-6 border-t border-gray-200 bg-white shrink-0">
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent transition-all">
                    <textarea 
                      placeholder={`Type your reply to ${selectedDoubt.studentName.split(' ')[0]}... (Markdown supported)`}
                      className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 py-3 min-h-[120px] text-gray-900 font-medium"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={isSending}
                    />
                    <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-gray-200 mt-2">
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1"><CornerDownRight className="w-3 h-3"/> Replies appear in student chat</p>
                      <button 
                        onClick={handleSendReply}
                        disabled={isSending || !replyText.trim()}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        {isSending ? "Sending..." : <><Send className="w-4 h-4"/> Send Reply</>}
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
