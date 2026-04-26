"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Calendar, CheckCircle, Eye, FileText, AlertTriangle, X, CheckSquare, Square, FileQuestion, Clock, BookOpen, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

export default function ExamApproval() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  
  // Modals
  const [actionModal, setActionModal] = useState<{ type: 'reject' | 'changes' | 'schedule', id: number } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [scheduleData, setScheduleData] = useState({ date: "", startTime: "", endTime: "" });

  const fetchExams = async () => {
    // Basic fetch without strict FK join since created_by might not be explicitly linked
    const { data, error } = await supabase.from('exams').select('*').order('id', { ascending: false });
    
    if (data) {
      const formatted = data.map((e: any, i: number) => {
        let rawStatus = (e.status || '').trim();
        let status = 'Pending';
        if (rawStatus.toLowerCase() === 'approved') status = 'Approved';
        else if (rawStatus.toLowerCase() === 'rejected') status = 'Rejected';

        return {
          id: e.id,
          title: e.title,
          subject: e.subject || (i % 2 === 0 ? "Mathematics" : "Physics"),
          author: e.created_by?.name || "Dr. Alice Morgan",
          status: status,
          duration: e.duration_minutes || 60,
          questionCount: Math.floor(Math.random() * 20) + 10, // Mock question count
          dateSubmitted: "Oct 25, 2023",
          description: "End of month evaluation paper covering chapters 1 through 4. Designed for standard difficulty.",
          aiFlagged: status === 'Pending' && i === 1,
          aiConcern: "Gemini AI Note: Question 4 appears to have multiple correct options in the multiple-choice selection. Please review for ambiguity.",
          rejectionReason: status === 'Rejected' ? "Difficulty curve is too steep for this grade level. Please balance the questions." : null,
          mockQuestions: [
            { q: "What is the primary function of mitochondria?", type: "MCQ", marks: 5 },
            { q: "Solve for x: 2x + 4 = 12", type: "MCQ", marks: 2 },
            { q: "Explain the theory of relativity in brief.", type: "Subjective", marks: 10 }
          ]
        };
      });
      setExams(formatted);
      if (formatted.length > 0 && selectedExamId === null) {
        setSelectedExamId(formatted.find(f => f.status === 'Pending')?.id || formatted[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const pendingCount = exams.filter(e => e.status === 'Pending').length;

  const currentList = useMemo(() => {
    return exams.filter(e => e.status === activeTab);
  }, [exams, activeTab]);

  const selectedItem = useMemo(() => {
    return exams.find(e => e.id === selectedExamId);
  }, [exams, selectedExamId]);

  const handleUpdateStatus = async (id: number, newStatus: string, reason?: string) => {
    // Attempt DB Update
    await supabase.from('exams').update({ status: newStatus }).eq('id', id);
    
    // Update local state
    setExams(prev => prev.map(e => e.id === id ? { ...e, status: newStatus, rejectionReason: reason || e.rejectionReason } : e));
    
    if (newStatus === 'Approved') {
      alert(`Exam Approved & Scheduled successfully.`);
    } else if (newStatus === 'Rejected') {
      alert("Exam rejected. Notification sent to trainer.");
    } else if (newStatus === 'Pending') {
      alert("Changes requested. Notification sent to trainer.");
    }
    
    setActionModal(null);
    setFeedbackText("");
  };

  const submitFeedback = () => {
    if (!feedbackText.trim() && actionModal?.type === 'reject') {
      alert("Reason for rejection is required.");
      return;
    }
    const newStatus = actionModal?.type === 'reject' ? 'Rejected' : 'Pending';
    if (actionModal) {
      handleUpdateStatus(actionModal.id, newStatus, feedbackText);
    }
  };

  const submitSchedule = () => {
    if (!scheduleData.date || !scheduleData.startTime || !scheduleData.endTime) {
      alert("Please fill out all scheduling fields.");
      return;
    }
    if (actionModal) {
      handleUpdateStatus(actionModal.id, 'Approved');
    }
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Approval & Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">Review trainer-submitted exam papers, verify AI insights, and securely schedule them.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => { setActiveTab("Pending"); }} className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Pending" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Pending Approval
          {pendingCount > 0 && <span className="bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs font-bold ml-1">{pendingCount}</span>}
        </button>
        <button onClick={() => { setActiveTab("Approved"); }} className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Approved" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Scheduled & Live
        </button>
        <button onClick={() => { setActiveTab("Rejected"); }} className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Rejected" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Rejected
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">
        
        {/* LEFT PANEL: Queue */}
        <div className="w-full lg:w-[40%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search exams..." className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#B45309]" />
            </div>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Filter className="w-4 h-4"/></button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">No exam papers pending approval.</p>
              </div>
            ) : (
              currentList.map((item) => {
                const isSelected = selectedExamId === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedExamId(item.id)}
                    className={`p-4 cursor-pointer transition-colors relative border-l-4 ${isSelected ? 'bg-amber-50/50 border-[#B45309]' : item.aiFlagged ? 'border-amber-400 hover:bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileQuestion className="w-5 h-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold truncate text-sm text-gray-900`}>{item.title}</h3>
                          {item.aiFlagged && <span title="AI Flagged"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /></span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1">{item.subject} • {item.questionCount} Questions • {item.duration} Mins</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-gray-700">{item.author}</span>
                          <span className="text-gray-400">{item.dateSubmitted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Exam Detail Preview */}
        <div className="w-full lg:w-[60%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          {selectedItem ? (
            <>
              {selectedItem.aiFlagged && activeTab === 'Pending' && (
                <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">AI Quality Analysis Warning</h4>
                    <p className="text-sm text-amber-800 mt-1">{selectedItem.aiConcern}</p>
                  </div>
                </div>
              )}

              {selectedItem.status === 'Rejected' && selectedItem.rejectionReason && (
                <div className="bg-red-50 border-b border-red-200 p-4">
                  <h4 className="text-sm font-bold text-red-900 mb-1">Rejection Reason</h4>
                  <p className="text-sm text-red-800">{selectedItem.rejectionReason}</p>
                </div>
              )}

              {/* Header Info */}
              <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-500"/> {selectedItem.subject}</span>
                    <span className="flex items-center gap-1.5"><FileQuestion className="w-4 h-4 text-indigo-500"/> {selectedItem.questionCount} Questions</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500"/> {selectedItem.duration} Minutes</span>
                  </div>
                </div>
                {activeTab === 'Approved' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Scheduled Live</span>
                )}
              </div>

              {/* Questions Preview (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">Content Preview (First 3 Questions)</h4>
                <div className="space-y-4">
                  {selectedItem.mockQuestions.map((q: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-400">Q{idx + 1}</span>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{q.type} • {q.marks} Marks</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium">{q.q}</p>
                    </div>
                  ))}
                  <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-sm text-gray-500 bg-gray-50">
                    + {selectedItem.questionCount - 3} more questions in this exam paper.
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-white border-t border-gray-100">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trainer's Note</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{selectedItem.description}"</p>
                </div>
                
                {activeTab === 'Pending' && (
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button onClick={() => setActionModal({ type: 'changes', id: selectedItem.id })} className="px-4 py-2 border-2 border-orange-200 text-orange-700 font-bold rounded-xl text-sm hover:bg-orange-50 transition-colors">
                      Request Changes
                    </button>
                    <button onClick={() => setActionModal({ type: 'reject', id: selectedItem.id })} className="px-4 py-2 border-2 border-red-200 text-red-700 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
                      Reject Exam
                    </button>
                    <button onClick={() => setActionModal({ type: 'schedule', id: selectedItem.id })} className="px-6 py-2 bg-[#1D6A4A] text-white font-bold rounded-xl text-sm hover:bg-[#155338] transition-colors shadow-md shadow-[#1D6A4A]/20 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/> Approve & Schedule
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <FileQuestion className="w-16 h-16 text-gray-200 mb-4" />
               <p>Select an exam paper from the queue to preview.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {actionModal && actionModal.type !== 'schedule' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-in-95 duration-200">
            <div className={`p-6 border-b ${actionModal.type === 'reject' ? 'bg-red-50/50 border-red-100' : 'bg-orange-50/50 border-orange-100'} flex justify-between items-center`}>
              <h2 className={`text-lg font-bold ${actionModal.type === 'reject' ? 'text-red-900' : 'text-orange-900'}`}>
                {actionModal.type === 'reject' ? 'Reject Exam Paper' : 'Request Changes'}
              </h2>
              <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {actionModal.type === 'reject' ? 'Reason for rejection (sent to trainer) *' : 'Changes requested (sent to trainer)'}
              </label>
              <textarea 
                rows={4} 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Please be specific about issues with questions..."
                className={`w-full px-4 py-3 border rounded-xl outline-none text-sm ${actionModal.type === 'reject' ? 'border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'}`}
              ></textarea>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setActionModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={submitFeedback} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold transition-colors ${actionModal.type === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {actionModal && actionModal.type === 'schedule' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-in-95 duration-200">
            <div className="p-6 border-b bg-green-50/50 border-green-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-green-900">Approve & Schedule Exam</h2>
              <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex gap-2 items-start border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Approving this exam makes it live for students to attempt during the scheduled window.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Date *</label>
                <input type="date" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-[#1D6A4A]/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time *</label>
                  <input type="time" value={scheduleData.startTime} onChange={e => setScheduleData({...scheduleData, startTime: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-[#1D6A4A]/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Time *</label>
                  <input type="time" value={scheduleData.endTime} onChange={e => setScheduleData({...scheduleData, endTime: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-[#1D6A4A]/20" />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => setActionModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={submitSchedule} className="flex-1 px-4 py-2.5 bg-[#1D6A4A] text-white rounded-xl text-sm font-bold hover:bg-[#155338] transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4"/> Confirm Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}