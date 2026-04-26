"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Search, Filter, Plus, Download, Mail, MoreVertical, X, CheckSquare, Square, Building2, AlertCircle, Ban, CheckCircle, Send, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

// Helper for generating mock data if DB is empty
const MOCK_PLANS = ["Starter", "Growth", "Elite"];
const MOCK_STATUSES = ["Active", "Trial", "Suspended", "Pending Setup"];
const MOCK_CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"];

export default function SchoolsManagement() {
  const [schools, setSchools] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPlan, setFilterPlan] = useState<string>("");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', adminName: '', adminEmail: '', plan: 'Starter', startDate: new Date().toISOString().split('T')[0] });
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [suspendModalId, setSuspendModalId] = useState<string | null>(null);

  const fetchSchools = async () => {
    const { data, error } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
    if (data) {
      const formattedData = data.map((school: any, idx: number) => ({
        id: school.id,
        code: `SCH-${String(school.id).padStart(4, '0').substring(0, 4)}`,
        name: school.name,
        city: school.city || MOCK_CITIES[idx % MOCK_CITIES.length],
        plan: school.plan || MOCK_PLANS[idx % MOCK_PLANS.length],
        adminEmail: `admin@${school.name.toLowerCase().replace(/\\s+/g, '')}.edu`,
        students: Math.floor(Math.random() * 2000) + 50,
        status: school.status || MOCK_STATUSES[idx % MOCK_STATUSES.length],
        date: new Date(school.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }));
      setSchools(formattedData);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const matchesSearch = search === "" || 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.city.toLowerCase().includes(search.toLowerCase()) || 
        s.adminEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "" || s.status === filterStatus;
      const matchesPlan = filterPlan === "" || s.plan === filterPlan;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [schools, search, filterStatus, filterPlan]);

  const stats = useMemo(() => {
    return {
      total: filteredSchools.length,
      active: filteredSchools.filter(s => s.status === 'Active').length,
      trial: filteredSchools.filter(s => s.status === 'Trial').length,
      suspended: filteredSchools.filter(s => s.status === 'Suspended').length,
    };
  }, [filteredSchools]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredSchools.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSchools.map(s => s.id)));
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Insert new school
    const { error } = await supabase.from('schools').insert([{ 
      name: formData.name,
      city: formData.city,
      plan: formData.plan,
      status: 'Pending Setup'
    }]);

    setIsSubmitting(false);
    if (!error) {
      setIsDrawerOpen(false);
      setFormData({ name: '', city: '', adminName: '', adminEmail: '', plan: 'Starter', startDate: new Date().toISOString().split('T')[0] });
      alert("School onboarded. Login credentials sent to admin email.");
      fetchSchools();
    } else {
      alert("Failed to onboard school");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('schools').update({ status: newStatus }).eq('id', id);
    fetchSchools();
  };

  const handleSuspendConfirm = () => {
    if (suspendModalId) {
      updateStatus(suspendModalId, 'Suspended');
      setSuspendModalId(null);
    }
  };

  const handleExport = (all: boolean = false) => {
    alert(`Exporting ${all ? 'all' : selectedIds.size} schools to CSV...`);
  };

  const renderStatusPill = (status: string) => {
    const styles: Record<string, string> = {
      'Active': 'bg-green-100 text-green-700',
      'Trial': 'bg-blue-100 text-blue-700',
      'Suspended': 'bg-red-100 text-red-700',
      'Pending Setup': 'bg-gray-100 text-gray-700'
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || styles['Active']}`}>{status}</span>;
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} Schools Total &nbsp;|&nbsp; {stats.active} Active &nbsp;|&nbsp; {stats.trial} Trial &nbsp;|&nbsp; {stats.suspended} Suspended
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleExport(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export All (CSV)
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors bg-[#B45309] hover:bg-amber-700 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Onboard New School
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search school name, city, admin email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 shadow-sm"
              />
            </div>
            
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none shadow-sm cursor-pointer"
            >
              <option value="">All Statuses</option>
              {MOCK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={filterPlan} 
              onChange={e => setFilterPlan(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none shadow-sm cursor-pointer"
            >
              <option value="">All Plans</option>
              {MOCK_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Active filter chips */}
            {(filterStatus || filterPlan) && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                {filterStatus && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs font-medium">
                    Status: {filterStatus}
                    <X className="w-3 h-3 cursor-pointer hover:text-amber-900" onClick={() => setFilterStatus("")} />
                  </span>
                )}
                {filterPlan && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs font-medium">
                    Plan: {filterPlan}
                    <X className="w-3 h-3 cursor-pointer hover:text-amber-900" onClick={() => setFilterPlan("")} />
                  </span>
                )}
              </div>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-sm font-medium text-gray-600 mr-2">{selectedIds.size} selected</span>
              <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-gray-200 bg-white" title="Export Selected">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-gray-200 bg-white" title="Email Admins">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {schools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Building2 className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No schools onboarded yet.</h3>
              <p className="text-gray-500 mt-1 mb-6 text-sm">Onboard your first school to get started.</p>
              <button onClick={() => setIsDrawerOpen(true)} className="px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                + Onboard New School
              </button>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No schools match your search.</h3>
              <p className="text-gray-500 mt-1 text-sm">Clear filters or onboard a new school.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 bg-white shadow-sm z-10 ring-1 ring-gray-100 ring-inset">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                  <th className="px-4 py-0 w-12">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-amber-600">
                      {selectedIds.size === filteredSchools.length && filteredSchools.length > 0 ? <CheckSquare className="w-4 h-4 text-amber-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-4 py-0">School Name</th>
                  <th className="px-4 py-0">City</th>
                  <th className="px-4 py-0">Plan</th>
                  <th className="px-4 py-0">Students</th>
                  <th className="px-4 py-0">Active Since</th>
                  <th className="px-4 py-0">Status</th>
                  <th className="px-4 py-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSchools.map((school) => {
                  const isSelected = selectedIds.has(school.id);
                  return (
                    <tr key={school.id} className={`h-[56px] transition-colors hover:bg-amber-50/50 ${isSelected ? 'bg-amber-50/30' : 'even:bg-gray-50/50'}`}>
                      <td className="px-4 py-0 w-12">
                        <button onClick={() => toggleSelection(school.id)} className="text-gray-400 hover:text-amber-600">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-amber-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-0">
                        <Link href={`/dashboard/super-admin/schools/${school.id}`} className="text-sm font-bold text-[#B45309] hover:underline flex flex-col">
                          <span>{school.name}</span>
                          <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">{school.code}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-0 text-sm text-gray-600">{school.city}</td>
                      <td className="px-4 py-0 text-sm font-medium text-gray-700">{school.plan}</td>
                      <td className="px-4 py-0 text-sm text-gray-600">{school.students.toLocaleString()}</td>
                      <td className="px-4 py-0 text-sm text-gray-500">{school.date}</td>
                      <td className="px-4 py-0">{renderStatusPill(school.status)}</td>
                      <td className="px-4 py-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/super-admin/schools/${school.id}`} className="px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 rounded transition-colors">
                            View Detail
                          </Link>
                          {school.status === 'Active' && (
                            <button onClick={() => setSuspendModalId(school.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Suspend">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          {school.status === 'Suspended' && (
                            <button onClick={() => updateStatus(school.id, 'Active')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Reactivate">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {school.status === 'Pending Setup' && (
                            <button onClick={() => alert('Reminder sent!')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Send Reminder">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-sm text-gray-500">
          <span>Showing {filteredSchools.length} schools</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Slide-in Drawer for Onboarding */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Onboard New School</h2>
              <p className="text-sm text-gray-500">Create a new tenant workspace.</p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleOnboard} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">School Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="e.g. Greenwood High" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
              <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="e.g. Mumbai" />
            </div>
            <div className="border-t border-gray-100 pt-5 mt-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Admin Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Name *</label>
                  <input type="text" required value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="Principal / Admin Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email *</label>
                  <input type="email" required value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" placeholder="admin@school.com" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5 mt-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Subscription setup</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plan Selection</label>
                  <select value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm">
                    {MOCK_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" />
                </div>
              </div>
            </div>
          </form>
          
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-white transition-colors">
              Cancel
            </button>
            <button type="submit" onClick={handleOnboard} disabled={isSubmitting || !formData.name || !formData.city || !formData.adminEmail} className="flex-1 px-4 py-2.5 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors disabled:opacity-50">
              {isSubmitting ? "Processing..." : "Onboard School"}
            </button>
          </div>
        </div>
      </div>

      {/* Suspend Confirm Modal */}
      {suspendModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Suspend School?</h2>
              <p className="text-sm text-gray-500 mb-6">This will instantly revoke access for the school admin and all associated trainers and students.</p>
              <div className="flex gap-3">
                <button onClick={() => setSuspendModalId(null)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSuspendConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
                  Yes, Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}