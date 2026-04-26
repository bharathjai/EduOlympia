"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, CheckCircle, XCircle, FileText, Eye, MoreVertical, PlaySquare, FileSignature, AlertTriangle, MessageSquare, CheckSquare, Square, ThumbsUp, ThumbsDown, X, RefreshCw } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

export default function ContentApproval() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection & Viewing state
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  
  // Modals
  const [actionModal, setActionModal] = useState<{ type: 'reject' | 'changes', id: number } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const fetchContents = async () => {
    // Mock robust payload for demonstration of all required features
    const { data, error } = await supabase.from('study_materials').select('*').order('id', { ascending: false });
    console.log("FETCH RESULTS:", { dataLen: data?.length, error });
    
    if (data) {
      const formatted = data.map((item: any, i: number) => {
        const type = item.type || (i % 3 === 0 ? "Video" : i % 2 === 0 ? "Notes" : "PDF");
        let rawStatus = (item.status || '').trim();
        let status = 'Pending';
        if (rawStatus.toLowerCase() === 'approved') status = 'Approved';
        else if (rawStatus.toLowerCase() === 'rejected') status = 'Rejected';
        
        return {
          id: item.id || Math.random(),
          title: item.title || "Untitled Document",
          subject: item.subject || "Mathematics",
          chapter: `Chapter ${Math.floor(Math.random() * 10) + 1}`,
          author: item.uploaded_by?.name || "Dr. Robert Clark",
          status: status,
          type: type,
          size: type === "Video" ? "45 MB" : "2.4 MB",
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Oct 24, 2023",
          description: "This material covers advanced problem-solving techniques for the upcoming olympiad. Please review the final 2 pages carefully.",
          aiFlagged: status === 'Pending' && i === 2, // Mock an AI flag
          aiConcern: "Gemini AI Note: The content in section 3 appears to drift off-topic into university-level calculus, which may not align with the standard 8th-grade syllabus.",
          rejectionReason: status === 'Rejected' ? "Content lacks clear examples for the theorem discussed on page 4. Please revise and resubmit." : null
        };
      });
      setContents(formatted);
      if (formatted.length > 0 && selectedContentId === null) {
        handleRowClick(formatted.find(f => f.status === 'Pending')?.id || formatted[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const pendingCount = contents.filter(c => c.status === 'Pending').length;

  const currentList = useMemo(() => {
    return contents.filter(c => c.status === activeTab);
  }, [contents, activeTab]);

  const selectedItem = useMemo(() => {
    return contents.find(c => c.id === selectedContentId);
  }, [contents, selectedContentId]);

  const handleRowClick = (id: number) => {
    setSelectedContentId(id);
    setViewedIds(prev => new Set(prev).add(id));
  };

  const toggleCheck = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!viewedIds.has(id)) {
      alert("You must preview the content before selecting it for batch approval.");
      return;
    }
    const newSet = new Set(checkedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCheckedIds(newSet);
  };

  const toggleAllChecks = () => {
    // Only check items that have been viewed
    const viewablePending = currentList.filter(c => viewedIds.has(c.id));
    if (checkedIds.size === viewablePending.length && viewablePending.length > 0) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(viewablePending.map(c => c.id)));
    }
  };

  const handleUpdateStatus = async (id: number | number[], newStatus: string, reason?: string) => {
    const idsToUpdate = Array.isArray(id) ? id : [id];
    
    // Attempt DB Update (using IN for bulk)
    await supabase.from('study_materials').update({ status: newStatus }).in('id', idsToUpdate);
    
    // Update local state
    setContents(prev => prev.map(c => idsToUpdate.includes(c.id) ? { ...c, status: newStatus, rejectionReason: reason || c.rejectionReason } : c));
    
    if (newStatus === 'Approved') {
      alert(`Content published. Students can now access ${idsToUpdate.length === 1 ? 'this item' : 'these items'}.`);
    } else if (newStatus === 'Rejected') {
      alert("Content rejected. Notification sent to trainer.");
    } else if (newStatus === 'Pending') {
      alert("Changes requested. Notification sent to trainer.");
    }
    
    setActionModal(null);
    setFeedbackText("");
    setCheckedIds(new Set());
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

  const getIcon = (type: string) => {
    if (type === 'Video') return <PlaySquare className="w-5 h-5 text-red-500" />;
    if (type === 'Notes') return <FileSignature className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-red-600" />; // PDF
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Approval</h1>
          <p className="text-sm text-gray-500 mt-1">Review, flag, and publish trainer material.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => { setActiveTab("Pending"); setCheckedIds(new Set()); }} className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Pending" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Pending Review
          {pendingCount > 0 && <span className="bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs font-bold ml-1">{pendingCount}</span>}
        </button>
        <button onClick={() => { setActiveTab("Approved"); setCheckedIds(new Set()); }} className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Approved" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Approved
        </button>
        <button onClick={() => { setActiveTab("Rejected"); setCheckedIds(new Set()); }} className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors ${activeTab === "Rejected" ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Rejected
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">
        
        {/* LEFT PANEL: Queue */}
        <div className="w-full lg:w-[45%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-gray-100 bg-gray-50 flex gap-2 overflow-x-auto">
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white outline-none shrink-0"><option>All Trainers</option></select>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white outline-none shrink-0"><option>All Subjects</option></select>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white outline-none shrink-0"><option>Content Type</option></select>
          </div>

          {activeTab === 'Pending' && checkedIds.size > 0 && (
            <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <span className="text-sm font-bold text-amber-900">{checkedIds.size} items selected</span>
              <button onClick={() => handleUpdateStatus(Array.from(checkedIds), 'Approved')} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-4 h-4" /> Approve Selected
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">All content reviewed.</h3>
                <p className="text-sm text-gray-500 mt-1">No items pending approval in this queue.</p>
              </div>
            ) : (
              currentList.map((item) => {
                const isSelected = selectedContentId === item.id;
                const isViewed = viewedIds.has(item.id);
                const isChecked = checkedIds.has(item.id);
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleRowClick(item.id)}
                    className={`p-4 cursor-pointer transition-colors relative border-l-4 ${isSelected ? 'bg-amber-50/50 border-[#B45309]' : item.aiFlagged ? 'border-amber-400 hover:bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      {activeTab === 'Pending' && (
                        <button 
                          onClick={(e) => toggleCheck(e, item.id)} 
                          className={`mt-1 shrink-0 ${isViewed ? (isChecked ? 'text-[#B45309]' : 'text-gray-300 hover:text-gray-400') : 'text-gray-200 cursor-not-allowed'}`}
                          title={!isViewed ? "You must view this item first" : "Select for batch approval"}
                        >
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      )}
                      
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        {getIcon(item.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold truncate text-sm ${!isViewed && activeTab === 'Pending' ? 'text-gray-900' : 'text-gray-700'}`}>{item.title}</h3>
                          {item.aiFlagged && <span title="AI Flagged"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /></span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1">{item.subject} • {item.chapter}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-gray-700">{item.author}</span>
                          <span className="text-gray-400">{item.size} • {item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Preview */}
        <div className="w-full lg:w-[55%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <p className="text-gray-400 font-medium">Loading preview...</p>
            </div>
          ) : selectedItem ? (
            <>
              {selectedItem.aiFlagged && activeTab === 'Pending' && (
                <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">AI flagged for review</h4>
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

              {/* Preview Area (Mock) */}
              <div className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-8 border-b border-gray-100 relative group">
                <div className="absolute top-4 right-4"><button className="px-3 py-1.5 bg-white/80 hover:bg-white text-gray-700 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 backdrop-blur-sm transition-colors"><Eye className="w-4 h-4"/> Full Screen</button></div>
                {getIcon(selectedItem.type)}
                <h3 className="mt-4 text-lg font-bold text-slate-700">Preview rendering: {selectedItem.title}</h3>
                <p className="text-slate-500 text-sm mt-2">{selectedItem.type} Viewer Engine</p>
              </div>

              {/* Trainer Note & Actions */}
              <div className="p-6 bg-white">
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trainer's Note</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 italic">"{selectedItem.description}"</p>
                </div>
                
                {activeTab === 'Pending' && (
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => setActionModal({ type: 'changes', id: selectedItem.id })} className="px-4 py-2.5 border-2 border-orange-200 text-orange-700 font-bold rounded-xl text-sm hover:bg-orange-50 transition-colors">
                      Request Changes
                    </button>
                    <button onClick={() => setActionModal({ type: 'reject', id: selectedItem.id })} className="px-4 py-2.5 border-2 border-red-200 text-red-700 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
                      Reject
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedItem.id, 'Approved')} className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors shadow-md shadow-green-600/20">
                      Approve & Publish
                    </button>
                  </div>
                )}
                
                {activeTab === 'Approved' && (
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                     <p className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Content Published & Live</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select an item from the queue to preview.</div>
          )}
        </div>
      </div>

      {/* Rejection / Changes Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-in-95 duration-200">
            <div className={`p-6 border-b ${actionModal.type === 'reject' ? 'bg-red-50/50 border-red-100' : 'bg-orange-50/50 border-orange-100'} flex justify-between items-center`}>
              <h2 className={`text-lg font-bold ${actionModal.type === 'reject' ? 'text-red-900' : 'text-orange-900'}`}>
                {actionModal.type === 'reject' ? 'Reject Content' : 'Request Changes'}
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
                placeholder="Please be specific so the trainer can correct the issue..."
                className={`w-full px-4 py-3 border rounded-xl outline-none text-sm ${actionModal.type === 'reject' ? 'border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'}`}
              ></textarea>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setActionModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={submitFeedback} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold transition-colors ${actionModal.type === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}