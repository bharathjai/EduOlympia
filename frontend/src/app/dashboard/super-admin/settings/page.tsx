"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Book, Bell, Palette, Save, AlertTriangle, X, Shield, Lock, Activity, Link2, UploadCloud, Eye, EyeOff, Hash, Download, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Subjects state
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", desc: "Advanced logic and algebra", color: "#B45309" },
    { id: 2, name: "Physics", desc: "Mechanics and thermodynamics", color: "#1D4ED8" },
    { id: 3, name: "Chemistry", desc: "Organic and inorganic elements", color: "#047857" },
  ]);
  const [newSubject, setNewSubject] = useState({ name: "", desc: "", color: "#4F46E5" });
  const [subjectDrawerOpen, setSubjectDrawerOpen] = useState(false);

  // Settings mock state
  const [examRules, setExamRules] = useState({ duration: 90, attempts: 1, grace: 5, tabSwitchLimit: 3 });
  const [branding, setBranding] = useState({ name: "EduOlympia Global", color: "#B45309", logoError: "" });
  const [emailTemplate, setEmailTemplate] = useState("Welcome to EduOlympia, {{student_name}}! You are enrolled in {{school_name}}.");
  
  // Mark unsaved changes
  const markDirty = () => setIsDirty(true);

  // Unsaved changes confirmation on tab switch
  const handleTabSwitch = (newTab: string) => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Leave without saving?")) {
        setIsDirty(false);
        setActiveTab(newTab);
      }
    } else {
      setActiveTab(newTab);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjects([...subjects, { id: Math.random(), ...newSubject }]);
    setSubjectDrawerOpen(false);
    setNewSubject({ name: "", desc: "", color: "#4F46E5" });
    markDirty();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setBranding({ ...branding, logoError: "File must be PNG or JPG, under 1MB." });
      } else {
        setBranding({ ...branding, logoError: "" });
        markDirty();
      }
    }
  };

  const navigationItems = [
    { id: 'subjects', label: 'Subjects & Curriculum', icon: Book },
    { id: 'exam-rules', label: 'Exam Rules', icon: Settings },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notification Templates', icon: Bell },
    { id: 'permissions', label: 'User Roles & Permissions', icon: Shield },
    { id: 'privacy', label: 'Data & Privacy', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
  ];

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Settings saved successfully.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure platform-wide defaults, security, and curriculum logic.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving || !isDirty}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${!isDirty ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#B45309] text-white hover:bg-amber-700 shadow-amber-900/20'}`}
        >
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {isDirty && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-yellow-800">You have unsaved changes</h3>
            <p className="text-xs text-yellow-700 mt-0.5">Save or discard your changes before leaving this section to prevent data loss.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {navigationItems.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => handleTabSwitch(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-[#B45309] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white/80' : 'text-gray-400'}`} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          
          {/* 1. Subjects & Curriculum */}
          {activeTab === 'subjects' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Subjects & Curriculum</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage master subject list used for content uploads and exam tagging.</p>
                </div>
                <button onClick={() => setSubjectDrawerOpen(true)} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg text-sm hover:bg-white bg-gray-50 transition-colors shadow-sm">
                  + Add Subject
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map(s => (
                    <div key={s.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center hover:border-gray-300 transition-colors cursor-move group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: s.color }}>
                        {s.name.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{s.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                      <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-5 h-5"/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Exam Rules */}
          {activeTab === 'exam-rules' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Global Exam Rules</h2>
                <p className="text-xs text-gray-500 mt-1">These are global defaults. Trainers can override these per-exam within logical limits.</p>
              </div>
              <div className="p-6 space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Max Duration (mins)</label>
                    <input type="number" value={examRules.duration} onChange={e => { setExamRules({...examRules, duration: Number(e.target.value)}); markDirty(); }} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Allowed Attempts</label>
                    <input type="number" value={examRules.attempts} onChange={e => { setExamRules({...examRules, attempts: Number(e.target.value)}); markDirty(); }} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-red-500"/> Anti-Cheat Strictness</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tab-Switch Limit (Auto-fail threshold)</label>
                      <input type="number" value={examRules.tabSwitchLimit} onChange={e => { setExamRules({...examRules, tabSwitchLimit: Number(e.target.value)}); markDirty(); }} className="w-full max-w-[200px] px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                      <p className="text-xs text-gray-500 mt-2">If a student leaves the exam tab this many times, their exam is forcefully submitted.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Branding */}
          {activeTab === 'branding' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Platform Branding</h2>
              </div>
              <div className="p-6 space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Platform Name</label>
                  <input type="text" value={branding.name} onChange={e => { setBranding({...branding, name: e.target.value}); markDirty(); }} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color (Hex)</label>
                  <div className="flex gap-3 items-center">
                    <input type="color" value={branding.color} onChange={e => { setBranding({...branding, color: e.target.value}); markDirty(); }} className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                    <input type="text" value={branding.color} onChange={e => { setBranding({...branding, color: e.target.value}); markDirty(); }} className="w-32 px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] uppercase font-mono text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Platform Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400 font-bold">LOGO</span>
                    </div>
                    <div>
                      <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4"/> Upload New Logo
                        <input type="file" className="hidden" accept=".png,.jpg" onChange={handleLogoUpload} />
                      </label>
                      <p className="text-[10px] text-gray-500 mt-2">Max 1MB. Transparent PNG recommended.</p>
                      {branding.logoError && <p className="text-xs text-red-600 font-bold mt-1">{branding.logoError}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Notification Templates */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-200 flex h-full min-h-[500px]">
              <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 space-y-1">
                {['Welcome (Student)', 'Welcome (Admin)', 'Exam Reminder', 'Results Published'].map((tmpl, i) => (
                  <button key={i} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${i===0 ? 'bg-white border border-gray-200 text-[#B45309] shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {tmpl}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Edit "Welcome (Student)" Template</h3>
                <div className="space-y-4">
                  <input type="text" defaultValue="Welcome to EduOlympia, {{student_name}}!" onChange={markDirty} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] font-bold text-gray-900" />
                  <textarea rows={8} value={emailTemplate} onChange={e => { setEmailTemplate(e.target.value); markDirty(); }} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] text-sm text-gray-700 font-mono bg-gray-50"></textarea>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-2 tracking-wider">Available Merge Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {['{{student_name}}', '{{school_name}}', '{{login_url}}', '{{temp_password}}'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded text-xs cursor-pointer hover:bg-blue-100">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. User Roles & Permissions */}
          {activeTab === 'permissions' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">User Roles & Permissions Matrix</h2>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-gray-200">
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Action Capability</th>
                      <th className="px-6 py-4 text-center border-l">Super Admin</th>
                      <th className="px-6 py-4 text-center border-l">School Admin</th>
                      <th className="px-6 py-4 text-center border-l">Trainer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { action: "Manage Billing", sa: true, sc: false, tr: false, lockSA: true },
                      { action: "Approve Content", sa: true, sc: false, tr: false, lockSA: true },
                      { action: "Upload Study Materials", sa: true, sc: false, tr: true, lockSA: false },
                      { action: "View Student Results", sa: true, sc: true, tr: false, lockSA: false },
                      { action: "Export Analytics", sa: true, sc: true, tr: false, lockSA: false },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{row.action}</td>
                        <td className="px-6 py-4 text-center border-l">
                          <input type="checkbox" checked={row.sa} disabled={row.lockSA} onChange={markDirty} className="w-4 h-4 text-[#B45309] rounded border-gray-300 focus:ring-[#B45309] disabled:opacity-50" />
                        </td>
                        <td className="px-6 py-4 text-center border-l">
                          <input type="checkbox" defaultChecked={row.sc} onChange={markDirty} className="w-4 h-4 text-[#B45309] rounded border-gray-300 focus:ring-[#B45309]" />
                        </td>
                        <td className="px-6 py-4 text-center border-l">
                          <input type="checkbox" defaultChecked={row.tr} onChange={markDirty} className="w-4 h-4 text-[#B45309] rounded border-gray-300 focus:ring-[#B45309]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Data & Privacy */}
          {activeTab === 'privacy' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Data & Privacy Control</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Data Retention Policy</h3>
                  <select onChange={markDirty} className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]">
                    <option>Retain data indefinitely</option>
                    <option>Auto-delete student records after 3 years inactive</option>
                    <option>Auto-delete student records after 1 year inactive</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900">System Audit Log</h3>
                    <button className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100"><Download className="w-3 h-3"/> Export CSV</button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden text-sm">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-xs text-gray-500 flex justify-between">
                      <span className="w-1/3">Timestamp</span><span className="w-1/3">User</span><span className="w-1/3">Action</span>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between text-gray-700">
                      <span className="w-1/3 font-mono text-xs text-gray-500">2023-10-24 14:05</span><span className="w-1/3 font-medium">System Admin</span><span className="w-1/3">Published Results for Math Olympiad</span>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between text-gray-700">
                      <span className="w-1/3 font-mono text-xs text-gray-500">2023-10-24 11:20</span><span className="w-1/3 font-medium">Dr. Alice Morgan</span><span className="w-1/3">Uploaded "Advanced Algebra" PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Integrations */}
          {activeTab === 'integrations' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Platform Integrations</h2>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Gemini Integration */}
                <div className="border border-purple-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-purple-50 p-4 border-b border-purple-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white"><Sparkles className="w-5 h-5"/></div>
                      <div>
                        <h3 className="font-bold text-purple-900">Google Gemini AI</h3>
                        <p className="text-xs text-purple-700">Powers Content Flagging & Analytics Reports</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-full">Connected</span>
                  </div>
                  <div className="p-5 bg-white space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">API Key</label>
                      <input type="password" defaultValue="AIzaSyA8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q" onChange={markDirty} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 flex gap-6 border border-gray-100 w-max">
                      <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Tokens Used (MTD)</p><p className="text-lg font-black text-gray-900">1.4M</p></div>
                      <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Est. Cost</p><p className="text-lg font-black text-gray-900">$2.10</p></div>
                    </div>
                  </div>
                </div>

                {/* Email Service */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Bell className="w-5 h-5"/></div>
                      <div>
                        <h3 className="font-bold text-gray-900">SendGrid Email Delivery</h3>
                        <p className="text-xs text-gray-500">SMTP service for notifications</p>
                      </div>
                    </div>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs font-bold rounded-full border border-gray-300">Configured</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Subject Drawer */}
      {subjectDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubjectDrawerOpen(false)}></div>
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Add New Subject</h2>
              <button onClick={() => setSubjectDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddSubject} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject Name *</label>
                <input required type="text" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <input type="text" value={newSubject.desc} onChange={e => setNewSubject({...newSubject, desc: e.target.value})} placeholder="Short description..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject Color Tag</label>
                <div className="flex gap-3 items-center">
                  <input type="color" value={newSubject.color} onChange={e => setNewSubject({...newSubject, color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                  <span className="font-mono text-sm uppercase text-gray-500">{newSubject.color}</span>
                </div>
              </div>
            </form>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button type="button" onClick={() => setSubjectDrawerOpen(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl bg-white hover:bg-gray-50 shadow-sm">Cancel</button>
              <button type="submit" onClick={handleAddSubject} disabled={!newSubject.name} className="flex-1 py-3 bg-[#B45309] text-white font-bold rounded-xl shadow-md hover:bg-amber-700 disabled:opacity-50">Save Subject</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}