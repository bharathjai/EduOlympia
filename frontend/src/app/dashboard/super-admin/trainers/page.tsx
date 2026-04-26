"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Filter, Plus, MoreVertical, BookOpen, ToggleRight, ToggleLeft, Edit, Trash2, X, LayoutGrid, List, CheckCircle, Ban, Key, Upload, HelpCircle, FileText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"];

export default function TrainerManagement() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  
  // Drawers
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  
  // Forms
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subjects: ["Mathematics"] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ type: 'deactivate' | 'reactivate', id: string, name: string } | null>(null);

  const fetchTrainers = async () => {
    const { data, error } = await supabase.from('users').select('*').eq('role', 'trainer').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map((t, i) => ({
        id: t.id,
        code: `TR-${String(t.id).padStart(4, '0')}`,
        name: t.name,
        email: t.email,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`, // mock phone
        subjects: i % 2 === 0 ? ["Mathematics", "Physics"] : ["Chemistry"], // mock multi-select
        status: t.status || (i % 5 === 0 ? 'Inactive' : 'Active'), // mock status
        lastLogin: new Date(Date.now() - Math.random() * 10000000000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        stats: { content: Math.floor(Math.random() * 50), questions: Math.floor(Math.random() * 500), exams: Math.floor(Math.random() * 10) }
      }));
      setTrainers(formatted);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter(t => {
      const matchesSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = filterSubject === "" || t.subjects.includes(filterSubject);
      const matchesStatus = filterStatus === "" || t.status === filterStatus;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [trainers, search, filterSubject, filterStatus]);

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      if (prev.subjects.includes(subject)) return { ...prev, subjects: prev.subjects.filter(s => s !== subject) };
      return { ...prev, subjects: [...prev.subjects, subject] };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEditMode && selectedTrainer) {
      // Mock update local state
      const updated = trainers.map(t => t.id === selectedTrainer.id ? { ...t, name: formData.name, email: formData.email, phone: formData.phone, subjects: formData.subjects } : t);
      setTrainers(updated);
      setSelectedTrainer(updated.find(t => t.id === selectedTrainer.id));
      setIsEditMode(false);
      alert("Trainer updated successfully.");
    } else {
      // Mock Add
      const { data, error } = await supabase.from('users').insert([{
        name: formData.name,
        email: formData.email,
        role: 'trainer',
        password_hash: 'temp_pass'
      }]).select().single();
      
      if (!error && data) {
        alert(`Trainer account created. Login credentials sent to ${formData.email}`);
        setIsAddDrawerOpen(false);
        fetchTrainers();
      }
    }
    setIsSubmitting(false);
  };

  const toggleStatus = async () => {
    if (!confirmModal) return;
    const newStatus = confirmModal.type === 'deactivate' ? 'Inactive' : 'Active';
    
    // Attempt DB Update
    await supabase.from('users').update({ status: newStatus }).eq('id', confirmModal.id);
    
    // Update local state
    const updated = trainers.map(t => t.id === confirmModal.id ? { ...t, status: newStatus } : t);
    setTrainers(updated);
    if (selectedTrainer?.id === confirmModal.id) {
      setSelectedTrainer({ ...selectedTrainer, status: newStatus });
    }
    
    setConfirmModal(null);
  };

  const handleResetPassword = () => {
    alert(`Password reset email sent to ${selectedTrainer.email}`);
  };

  const openAddDrawer = () => {
    setFormData({ name: "", email: "", phone: "", subjects: [] });
    setIsAddDrawerOpen(true);
  };

  const openDetailDrawer = (trainer: any) => {
    setSelectedTrainer(trainer);
    setIsEditMode(false);
    setIsDetailDrawerOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Management</h1>
          <p className="text-sm text-gray-500 mt-1">{trainers.length} Trainers Onboarded</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg flex p-1 shadow-sm">
            <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("card")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <button onClick={openAddDrawer} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700 shadow-sm">
            <Plus className="w-4 h-4" /> Add Trainer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search trainer name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 shadow-sm"
            />
          </div>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none shadow-sm cursor-pointer">
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none shadow-sm cursor-pointer">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-0">
          {trainers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No trainers added.</h3>
              <p className="text-gray-500 mt-1 mb-6 text-sm">Add your first trainer to start building content.</p>
              <button onClick={openAddDrawer} className="px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-medium hover:bg-amber-700">+ Add Trainer</button>
            </div>
          ) : viewMode === "table" ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10 ring-1 ring-gray-100 ring-inset">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                  <th className="px-6 py-0">Trainer</th>
                  <th className="px-6 py-0">Subjects</th>
                  <th className="px-6 py-0">Status</th>
                  <th className="px-6 py-0">Last Login</th>
                  <th className="px-6 py-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrainers.map((t) => (
                  <tr key={t.id} onClick={() => openDetailDrawer(t)} className="h-[64px] hover:bg-amber-50/50 cursor-pointer transition-colors even:bg-gray-50/50">
                    <td className="px-6 py-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">{t.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-0">
                      <div className="flex flex-wrap gap-1">
                        {t.subjects.map((sub: string) => <span key={sub} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{sub}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-0">{renderStatusBadge(t.status)}</td>
                    <td className="px-6 py-0 text-sm text-gray-500">{t.lastLogin}</td>
                    <td className="px-6 py-0 text-right">
                      <button className="text-gray-400 hover:text-[#B45309] p-2 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredTrainers.map((t) => (
                <div key={t.id} onClick={() => openDetailDrawer(t)} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-lg border border-amber-200 group-hover:scale-105 transition-transform">{t.name.charAt(0)}</div>
                    {renderStatusBadge(t.status)}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500 truncate mb-3">{t.email}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {t.subjects.map((sub: string) => <span key={sub} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 rounded text-[10px] uppercase font-semibold">{sub}</span>)}
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                    <span>Last Login:</span>
                    <span className="font-medium text-gray-600">{t.lastLogin.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide-in Drawers */}

      {/* Add Trainer Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isAddDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAddDrawerOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isAddDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Trainer</h2>
              <p className="text-sm text-gray-500">Create a content creator account.</p>
            </div>
            <button onClick={() => setIsAddDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="e.g. john@eduolympia.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="+91" />
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Assignments *</label>
              <p className="text-xs text-gray-500 mb-3">Trainer can only manage content for assigned subjects.</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {SUBJECTS.map(sub => (
                  <label key={sub} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.subjects.includes(sub)} 
                      onChange={() => handleSubjectToggle(sub)} 
                      className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-600"
                    />
                    <span className="text-sm font-medium text-gray-900">{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
              <Key className="w-5 h-5 shrink-0" />
              <p>A temporary password will be auto-generated and securely emailed to the trainer.</p>
            </div>
          </form>
          
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button type="button" onClick={() => setIsAddDrawerOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-white transition-colors">
              Cancel
            </button>
            <button type="submit" onClick={handleSave} disabled={isSubmitting || !formData.name || !formData.email || formData.subjects.length === 0} className="flex-1 px-4 py-2.5 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors disabled:opacity-50">
              {isSubmitting ? "Processing..." : "Add Trainer"}
            </button>
          </div>
        </div>
      </div>

      {/* Trainer Detail Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDetailDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDetailDrawerOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isDetailDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedTrainer && (
            <>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Profile' : 'Trainer Profile'}</h2>
                <div className="flex items-center gap-2">
                  {!isEditMode && (
                    <button onClick={() => { setIsEditMode(true); setFormData({ name: selectedTrainer.name, email: selectedTrainer.email, phone: selectedTrainer.phone, subjects: selectedTrainer.subjects }); }} className="p-2 text-gray-400 hover:text-[#B45309] bg-white border border-gray-200 rounded-full transition-colors shadow-sm"><Edit className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => setIsDetailDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {!isEditMode ? (
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-2xl border border-amber-200 shrink-0">{selectedTrainer.name.charAt(0)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedTrainer.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{selectedTrainer.code}</p>
                        {renderStatusBadge(selectedTrainer.status)}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Info</h4>
                        <p className="text-sm font-medium text-gray-900 mb-1">{selectedTrainer.email}</p>
                        <p className="text-sm font-medium text-gray-900">{selectedTrainer.phone}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Assignments</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrainer.subjects.map((sub: string) => <span key={sub} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{sub}</span>)}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Platform Activity</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Upload className="w-5 h-5 text-[#B45309] mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{selectedTrainer.stats.content}</p>
                            <p className="text-xs text-gray-500 font-medium">Content Uploaded</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <HelpCircle className="w-5 h-5 text-[#B45309] mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{selectedTrainer.stats.questions}</p>
                            <p className="text-xs text-gray-500 font-medium">Questions Added</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
                            <FileText className="w-5 h-5 text-[#B45309] mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{selectedTrainer.stats.exams}</p>
                            <p className="text-xs text-gray-500 font-medium">Exams Created</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">Last login: {selectedTrainer.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="p-6 space-y-5">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-sm" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-sm" /></div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Assignments</label>
                      <div className="space-y-2 border border-gray-100 rounded-xl p-2 bg-gray-50">
                        {SUBJECTS.map(sub => (
                          <label key={sub} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={formData.subjects.includes(sub)} onChange={() => handleSubjectToggle(sub)} className="w-4 h-4 text-amber-600 rounded border-gray-300" />
                            <span className="text-sm font-medium text-gray-900">{sub}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                {isEditMode ? (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditMode(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold bg-white hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 px-4 py-2 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors">Save Changes</button>
                  </div>
                ) : (
                  <>
                    <button onClick={handleResetPassword} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                      <Key className="w-4 h-4" /> Send Password Reset Email
                    </button>
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Account Access</p>
                        <p className="text-xs text-gray-500">{selectedTrainer.status === 'Active' ? 'Trainer can log in' : 'Access revoked'}</p>
                      </div>
                      <button 
                        onClick={() => setConfirmModal({ type: selectedTrainer.status === 'Active' ? 'deactivate' : 'reactivate', id: selectedTrainer.id, name: selectedTrainer.name })} 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${selectedTrainer.status === 'Active' ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedTrainer.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-in-95 duration-200">
            <div className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.type === 'deactivate' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {confirmModal.type === 'deactivate' ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{confirmModal.type === 'deactivate' ? 'Deactivate' : 'Reactivate'} {confirmModal.name}?</h2>
              <p className="text-sm text-gray-500 mb-6">
                {confirmModal.type === 'deactivate' 
                  ? "Deactivating will prevent them from logging in. Their published content will remain visible to students. Confirm?"
                  : "Reactivating will restore their login access and ability to publish content."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={toggleStatus} className={`flex-1 px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors ${confirmModal.type === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                  Yes, {confirmModal.type === 'deactivate' ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}