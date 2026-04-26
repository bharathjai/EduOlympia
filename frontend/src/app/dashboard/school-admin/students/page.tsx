"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Plus, Upload, MoreVertical, FileDown, CheckCircle2, AlertCircle, X, ChevronDown, Trash2, KeyRound, FolderTree, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function StudentManagement() {
  const searchParams = useSearchParams();
  const initFilter = searchParams?.get("filter") || "all";

  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initFilter);
  const [activeBatch, setActiveBatch] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Mock error state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showToast, setShowToast] = useState("");

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          batch_class,
          users (
            name
          )
        `);
      
      if (error) {
        setError(true);
        setLoading(false);
        return;
      }
      
      if (data) {
        const formattedData = data.map((d: any) => ({
          id: `STU-${d.id.toString().padStart(3, '0')}`,
          name: d.users?.name || 'Unknown',
          grade: d.batch_class || 'Unassigned',
          status: 'Active',
          lastLogin: 'Today',
          exams: 0,
          practice: 0
        }));
        setStudents(formattedData);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;
    
    // Status Filter
    if (statusFilter === "active") result = result.filter(s => s.status === "Active");
    if (statusFilter === "inactive") result = result.filter(s => s.status === "Inactive");

    // Batch Filter
    if (activeBatch !== "All") result = result.filter(s => s.grade === activeBatch);

    // Search Filter
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lowerSearch) || 
        s.id.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredStudents(result);
  }, [search, statusFilter, activeBatch, students]);

  // Derive batches and counts from students data
  const batchCounts = students.reduce((acc, student) => {
    const grade = student.grade || "Unassigned";
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleAction = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setActiveModal(null);
    if (type === "enroll") triggerToast("1 student enrolled successfully. Credentials generated.");
    if (type === "bulk") triggerToast("124 students enrolled. Credential list sent to your email.");
  };

  const activeCount = students.filter(s => s.status === 'Active').length;
  const inactiveCount = students.filter(s => s.status === 'Inactive').length;

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-[100] flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage enrollments, track activity, and organize batches.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveModal('bulk')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold transition-colors shadow-sm">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button onClick={() => setActiveModal('enroll')} className="flex items-center gap-2 px-5 py-2 text-white rounded-xl text-sm font-bold transition-colors bg-[#1D6A4A] hover:bg-green-800 shadow-md shadow-green-700/20">
            <Plus className="w-4 h-4" /> Enroll Student
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel - Batches */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><FolderTree className="w-4 h-4 text-[#1D6A4A]"/> Student Batches</h2>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => setActiveBatch("All")}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex justify-between items-center transition-colors ${activeBatch === "All" ? "font-bold bg-[#1D6A4A] text-white shadow-sm" : "font-medium text-gray-700 hover:bg-gray-50"}`}>
                All Students <span className={activeBatch === "All" ? "bg-white/20 px-2 py-0.5 rounded-md text-xs" : "bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-xs"}>{students.length}</span>
              </button>
              {Object.entries(batchCounts).map(([batchName, count]) => (
                <button 
                  key={batchName}
                  onClick={() => setActiveBatch(batchName)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex justify-between items-center transition-colors ${activeBatch === batchName ? "font-bold bg-[#1D6A4A] text-white shadow-sm" : "font-medium text-gray-700 hover:bg-gray-50"}`}>
                  {batchName} <span className={activeBatch === batchName ? "bg-white/20 px-2 py-0.5 rounded-md text-xs" : "bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-xs"}>{count as number}</span>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button className="w-full py-2 border border-dashed border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:border-[#1D6A4A] hover:text-[#1D6A4A] transition-colors">
                + Create Batch
              </button>
              <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">Batches group students for reporting, they do not affect access.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Student Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[600px] overflow-hidden">
          
          {/* Filters & Actions */}
          <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search student name or ID..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]"
                />
              </div>
              {/* Status Filter */}
              <div className="flex bg-white border border-gray-200 rounded-xl p-1 shrink-0">
                <button onClick={() => setStatusFilter("all")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
                <button onClick={() => setStatusFilter("active")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'active' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
                <button onClick={() => setStatusFilter("inactive")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${statusFilter === 'inactive' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>Inactive (7+ days)</button>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <span className="text-xs font-bold text-[#1D6A4A] bg-green-50 px-2 py-1 rounded-md">{selectedIds.size} Selected</span>
                <button className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50" title="Assign to Batch"><FolderTree className="w-4 h-4"/></button>
                <button className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50" title="Export CSV"><FileDown className="w-4 h-4"/></button>
                <button className="p-2 border border-red-200 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="Deactivate"><Trash2 className="w-4 h-4"/></button>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-3 border-b border-gray-100 bg-white flex justify-between items-center text-xs">
            <p className="text-gray-500 font-medium">
              <span className="font-bold text-gray-900">{filteredStudents.length}</span> students found.
            </p>
            <p className="text-gray-500">
              <span className="font-bold text-green-600">{activeCount} Active</span> • <span className="font-bold text-red-600">{inactiveCount} Inactive</span>
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            {loading ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-12"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Status & Last Login</th>
                    <th className="px-6 py-4 text-center">Exams</th>
                    <th className="px-6 py-4 text-center">Practice</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-6 ml-auto animate-pulse"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : error ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Data</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Unable to load data. Refresh the page or contact support.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold shadow-sm transition-colors">
                  Retry
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No students found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">No students match the current filters. Enroll individually or upload in bulk to get started.</p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveModal('bulk')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold shadow-sm">Bulk Upload</button>
                  <button onClick={() => setActiveModal('enroll')} className="px-4 py-2 bg-[#1D6A4A] text-white rounded-xl hover:bg-green-800 text-sm font-bold shadow-md">Enroll Student</button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0} className="w-4 h-4 rounded border-gray-300 text-[#1D6A4A] focus:ring-[#1D6A4A]" /></th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Status & Last Login</th>
                    <th className="px-6 py-4 text-center">Exams</th>
                    <th className="px-6 py-4 text-center">Practice</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className={`hover:bg-green-50/30 transition-colors ${selectedIds.has(student.id) ? 'bg-green-50/50' : ''}`}>
                      <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.has(student.id)} onChange={() => handleSelect(student.id)} className="w-4 h-4 rounded border-gray-300 text-[#1D6A4A] focus:ring-[#1D6A4A]" /></td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/school-admin/students/${student.id}`} className="font-bold text-[#1D6A4A] hover:underline block">{student.name}</Link>
                        <span className="text-xs text-gray-500 font-medium">{student.grade}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{student.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={`text-xs font-bold ${student.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>{student.status}</span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">Last: {student.lastLogin}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{student.exams}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{student.practice}</td>
                      <td className="px-6 py-4 text-right relative group">
                        <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {/* Hover Actions Menu */}
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                          <Link href={`/dashboard/school-admin/students/${student.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium text-left w-full">View Profile</Link>
                          <button onClick={() => triggerToast(`Password reset link sent to admin for ${student.name}.`)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium text-left w-full flex items-center justify-between">Reset Pass <KeyRound className="w-3 h-3 text-gray-400"/></button>
                          <button onClick={() => triggerToast(`${student.name} deactivated.`)} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold text-left w-full">Deactivate</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Enroll Student Drawer Modal */}
      {activeModal === 'enroll' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-[#1D6A4A] text-white">
              <div>
                <h2 className="text-xl font-bold">Enroll Student</h2>
                <p className="text-xs text-green-100 mt-1">System auto-generates login credentials</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-green-100 hover:text-white bg-white/10 p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={(e) => handleAction(e, 'enroll')} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                  <input required type="text" placeholder="John" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-green-700/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Last Name *</label>
                  <input required type="text" placeholder="Doe" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-green-700/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Class/Grade *</label>
                <select required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-green-700/20 bg-white">
                  <option value="">Select Grade...</option>
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                  <span>Parent Email</span> <span className="text-gray-400 font-normal text-xs">Optional</span>
                </label>
                <input type="email" placeholder="parent@email.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#1D6A4A] focus:ring-2 focus:ring-green-700/20" />
                <p className="text-[10px] text-gray-500 mt-1.5">If provided, results and notifications will be CC'd here.</p>
              </div>
              <div className="pt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
                  <KeyRound className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Upon submission, a unique Student ID and temporary password will be generated and added to your credential export list.
                  </p>
                </div>
              </div>
            </form>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl bg-white hover:bg-gray-50 shadow-sm transition-colors">Cancel</button>
              <button type="submit" onClick={(e) => handleAction(e, 'enroll')} className="flex-1 py-3 bg-[#1D6A4A] text-white font-bold rounded-xl shadow-md hover:bg-green-800 transition-colors">Enroll Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal Flow */}
      {activeModal === 'bulk' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Bulk Upload Students</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-900 bg-white border border-gray-200 p-2 rounded-lg shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-8">
              <div className="flex mb-8">
                <div className="flex-1 text-center relative">
                  <div className="w-8 h-8 mx-auto bg-[#1D6A4A] text-white rounded-full flex items-center justify-center font-bold text-sm relative z-10 shadow-sm border-[3px] border-white">1</div>
                  <p className="text-xs font-bold text-[#1D6A4A] mt-2">Download Template</p>
                  <div className="absolute top-4 left-1/2 w-full h-[2px] bg-gray-200"></div>
                </div>
                <div className="flex-1 text-center relative">
                  <div className="w-8 h-8 mx-auto bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm relative z-10 border-[3px] border-white">2</div>
                  <p className="text-xs font-bold text-gray-400 mt-2">Upload Data</p>
                  <div className="absolute top-4 left-1/2 w-full h-[2px] bg-gray-200"></div>
                </div>
                <div className="flex-1 text-center relative">
                  <div className="w-8 h-8 mx-auto bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm relative z-10 border-[3px] border-white">3</div>
                  <p className="text-xs font-bold text-gray-400 mt-2">Preview & Confirm</p>
                </div>
              </div>

              {/* Mock Step 1 View */}
              <div className="text-center py-8">
                <FileDown className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Download CSV Template</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Use our structured CSV template to ensure your student data is formatted correctly before uploading.</p>
                
                {/* Mock Error State preview embedded for UI demonstration */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left max-w-md mx-auto mb-6 hidden">
                  <p className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> 2 errors found in your upload</p>
                  <ul className="text-xs text-red-700 list-disc pl-5 space-y-1">
                    <li>Row 14: Missing class field</li>
                    <li>Row 22: Invalid email format</li>
                  </ul>
                  <p className="text-[10px] text-red-600 mt-3 font-semibold">You can proceed with valid rows or fix the file and re-upload.</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button className="px-6 py-2.5 border-2 border-[#1D6A4A] text-[#1D6A4A] rounded-xl font-bold hover:bg-green-50 transition-colors">
                    Download Template
                  </button>
                  <button onClick={(e) => handleAction(e, 'bulk')} className="px-6 py-2.5 bg-[#1D6A4A] text-white rounded-xl font-bold shadow-md hover:bg-green-800 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4"/> Upload Filled CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}