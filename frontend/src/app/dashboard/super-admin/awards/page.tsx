"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Award, Plus, Download, Star, Users, X, MapPin, Calendar as CalendarIcon, ChevronLeft, Edit3, Send, Globe, AlertTriangle, Image as ImageIcon, Search, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function AwardFunctionManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Event Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", examId: "", date: "", venue: "", description: "" });
  
  // Detail View State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  // Medal Board / Override Modal
  const [overrideModal, setOverrideModal] = useState<{ id: string, title: string, current: string } | null>(null);
  const [newStudentName, setNewStudentName] = useState("");

  // Special Awards Modal
  const [specialModalOpen, setSpecialModalOpen] = useState(false);
  const [specialAward, setSpecialAward] = useState({ title: "Most Improved", student: "" });

  // Certificate Template Drawer
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [templateConfig, setTemplateConfig] = useState({ color: "amber", hasSignature: true });

  const fetchEvents = async () => {
    // Mocking robust data to fulfill specs without complex DB joins right now
    setTimeout(() => {
      setEvents([
        { 
          id: 1, 
          title: "Math Olympiad 2023 Honors", 
          examName: "Math Olympiad 2023 - Finals",
          date: "Nov 15, 2023", 
          venue: "Grand Hall, EduOlympia Center",
          description: "Annual ceremony to honor the brightest minds in mathematics across all our partner schools.",
          status: "Draft",
          medalsCount: 15,
          medals: [
            { id: 'm1', type: 'Gold', level: 'Platform', student: 'David Chen', school: 'Pinnacle Int.' },
            { id: 'm2', type: 'Silver', level: 'Platform', student: 'Emma Watson', school: 'Pinnacle Int.' },
            { id: 'm3', type: 'Bronze', level: 'Platform', student: 'Alex Mercer', school: 'Greenfield Academy' },
            { id: 'm4', type: 'School Champion', level: 'School', student: 'Samira Khan', school: 'Riverside High' },
          ],
          specialAwards: []
        }
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.examId || !newEvent.date) return;
    
    const created = {
      id: Math.random(),
      title: newEvent.title,
      examName: newEvent.examId,
      date: newEvent.date,
      venue: newEvent.venue || "Virtual / TBD",
      description: newEvent.description,
      status: "Draft",
      medalsCount: 0,
      medals: [],
      specialAwards: []
    };
    
    setEvents([created, ...events]);
    setIsDrawerOpen(false);
    setNewEvent({ title: "", examId: "", date: "", venue: "", description: "" });
    setSelectedEvent(created); // Auto-navigate to detail
  };

  const handleOverrideSubmit = () => {
    if (!selectedEvent || !overrideModal) return;
    const updatedEvent = {
      ...selectedEvent,
      medals: selectedEvent.medals.map((m: any) => m.id === overrideModal.id ? { ...m, student: newStudentName } : m)
    };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setOverrideModal(null);
    setNewStudentName("");
  };

  const handleSpecialSubmit = () => {
    if (!selectedEvent || !specialAward.student) return;
    const updatedEvent = {
      ...selectedEvent,
      specialAwards: [...selectedEvent.specialAwards, { id: Math.random(), type: specialAward.title, student: specialAward.student }]
    };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSpecialModalOpen(false);
    setSpecialAward({ title: "Most Improved", student: "" });
  };

  const handlePublish = () => {
    if (!selectedEvent) return;
    const updatedEvent = { ...selectedEvent, status: "Published" };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    alert("Award Event Page Published! Visible to students and school admins.");
  };

  const handleNotify = () => {
    alert(`Personalized emails sent to ${selectedEvent?.medals.length + selectedEvent?.specialAwards.length} medal recipients!`);
  };

  const handleDownloadBrochure = () => {
    alert("Downloading PDF Award Brochure for physical ceremony...");
  };

  // --- RENDER DETAIL VIEW ---
  if (selectedEvent) {
    return (
      <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {selectedEvent.title}
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedEvent.status === 'Draft' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                {selectedEvent.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> {selectedEvent.date}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {selectedEvent.venue}</span>
            </p>
          </div>
          
          <div className="ml-auto flex gap-3">
            <button onClick={handleDownloadBrochure} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4"/> Brochure
            </button>
            <button onClick={() => setTemplateDrawerOpen(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4"/> Edit Template
            </button>
            <button onClick={handleNotify} className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2">
              <Send className="w-4 h-4"/> Notify Winners
            </button>
            {selectedEvent.status === 'Draft' && (
              <button onClick={handlePublish} className="px-5 py-2 bg-[#B45309] border border-amber-700 text-white font-bold rounded-xl text-sm hover:bg-amber-700 transition-colors shadow-md flex items-center gap-2">
                <Globe className="w-4 h-4"/> Publish Page
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Medal Board */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Platform Medals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-slate-900 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500"/> Platform-Level Medals</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">Auto-populated from SA-08</span>
              </div>
              <div className="p-2">
                {selectedEvent.medals.filter((m:any) => m.level === 'Platform').map((medal:any) => (
                  <div key={medal.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${medal.type === 'Gold' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : medal.type === 'Silver' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {medal.type === 'Gold' ? '1st' : medal.type === 'Silver' ? '2nd' : '3rd'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{medal.student}</h4>
                        <p className="text-xs text-gray-500">{medal.school}</p>
                      </div>
                    </div>
                    <button onClick={() => setOverrideModal({ id: medal.id, title: `${medal.type} Medal`, current: medal.student })} className="p-2 text-gray-400 hover:text-[#B45309] hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Override Assignment">
                      <Edit3 className="w-5 h-5"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* School Champions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Award className="w-5 h-5 text-[#B45309]"/> School Champions</h2>
              </div>
              <div className="p-2">
                {selectedEvent.medals.filter((m:any) => m.level === 'School').map((medal:any) => (
                  <div key={medal.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Star className="w-5 h-5"/>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{medal.student}</h4>
                        <p className="text-xs text-gray-500">{medal.school} • Top Scorer</p>
                      </div>
                    </div>
                    <button onClick={() => setOverrideModal({ id: medal.id, title: `Champion for ${medal.school}`, current: medal.student })} className="p-2 text-gray-400 hover:text-[#B45309] hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Edit3 className="w-5 h-5"/>
                    </button>
                  </div>
                ))}
                {selectedEvent.medals.filter((m:any) => m.level === 'School').length === 0 && <p className="p-4 text-sm text-gray-500 text-center">No school champions assigned yet.</p>}
              </div>
            </div>
            
          </div>

          {/* Right Sidebar: Special Awards & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                <h2 className="font-bold text-purple-900 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-purple-600"/> Special Awards</h2>
                <button onClick={() => setSpecialModalOpen(true)} className="p-1.5 bg-white text-purple-600 rounded-md shadow-sm hover:bg-purple-100 transition-colors"><Plus className="w-4 h-4"/></button>
              </div>
              <div className="p-4 space-y-3">
                {selectedEvent.specialAwards.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No custom special awards added.</p>
                ) : (
                  selectedEvent.specialAwards.map((sa:any) => (
                    <div key={sa.id} className="p-3 border border-purple-100 bg-white rounded-xl shadow-sm">
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">{sa.type}</p>
                      <p className="text-sm font-bold text-gray-900 flex items-center justify-between">
                        {sa.student}
                        <button className="text-gray-300 hover:text-red-500"><X className="w-4 h-4"/></button>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Event Details</h3>
              <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2"><Award className="w-4 h-4"/> <b>Linked Exam:</b> {selectedEvent.examName}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4"/> <b>Total Recipients:</b> {selectedEvent.medals.length + selectedEvent.specialAwards.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Override Modal */}
        {overrideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">Override {overrideModal.title}</h2>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500">Currently assigned to: <b>{overrideModal.current}</b></p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select New Student</label>
                  <input type="text" placeholder="Search student name..." value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#B45309] outline-none" />
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button onClick={() => setOverrideModal(null)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button onClick={handleOverrideSubmit} className="flex-1 px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-bold hover:bg-amber-700">Confirm Override</button>
              </div>
            </div>
          </div>
        )}

        {/* Special Award Modal */}
        {specialModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
              <div className="p-5 border-b border-purple-100 bg-purple-50">
                <h2 className="font-bold text-purple-900">Add Special Award</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={specialAward.title} onChange={e => setSpecialAward({...specialAward, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-600 outline-none">
                    <option>Most Improved</option>
                    <option>Perfect Scorer</option>
                    <option>Most Active Learner</option>
                    <option>Perseverance Award</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                  <input type="text" placeholder="Search student name..." value={specialAward.student} onChange={e => setSpecialAward({...specialAward, student: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-600 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button onClick={() => setSpecialModalOpen(false)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button onClick={handleSpecialSubmit} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700">Add Award</button>
              </div>
            </div>
          </div>
        )}

        {/* Template Drawer */}
        {templateDrawerOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={() => setTemplateDrawerOpen(false)}></div>
            <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Certificate Template</h2>
                <button onClick={() => setTemplateDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Preview Box */}
                <div className={`aspect-[4/3] rounded-lg border-8 p-4 flex flex-col items-center justify-center text-center bg-white shadow-inner relative ${templateConfig.color === 'amber' ? 'border-[#B45309]' : templateConfig.color === 'blue' ? 'border-blue-800' : 'border-emerald-800'}`}>
                  <Award className={`w-12 h-12 mb-3 ${templateConfig.color === 'amber' ? 'text-[#B45309]' : templateConfig.color === 'blue' ? 'text-blue-800' : 'text-emerald-800'}`} />
                  <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight">Certificate of Excellence</h3>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">{selectedEvent.title}</p>
                  <p className="text-sm italic text-gray-700 mt-4">This certifies that</p>
                  <h2 className="text-2xl font-script text-[#B45309] font-bold mt-1 border-b border-gray-300 w-3/4 pb-1">Student Name</h2>
                  <p className="text-[10px] text-gray-600 mt-2">has been awarded the Gold Medal.</p>
                  {templateConfig.hasSignature && (
                    <div className="absolute bottom-4 right-6 border-t border-gray-400 pt-1 text-[8px] text-gray-500 italic w-24 text-center">
                      Authorized Signature
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Border Color</label>
                    <div className="flex gap-3">
                      <button onClick={() => setTemplateConfig({...templateConfig, color: 'amber'})} className={`w-8 h-8 rounded-full bg-[#B45309] ${templateConfig.color === 'amber' ? 'ring-2 ring-offset-2 ring-[#B45309]' : ''}`}></button>
                      <button onClick={() => setTemplateConfig({...templateConfig, color: 'blue'})} className={`w-8 h-8 rounded-full bg-blue-800 ${templateConfig.color === 'blue' ? 'ring-2 ring-offset-2 ring-blue-800' : ''}`}></button>
                      <button onClick={() => setTemplateConfig({...templateConfig, color: 'emerald'})} className={`w-8 h-8 rounded-full bg-emerald-800 ${templateConfig.color === 'emerald' ? 'ring-2 ring-offset-2 ring-emerald-800' : ''}`}></button>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={templateConfig.hasSignature} onChange={e => setTemplateConfig({...templateConfig, hasSignature: e.target.checked})} className="w-4 h-4 text-[#B45309] rounded border-gray-300 focus:ring-[#B45309]" />
                    <span className="text-sm font-medium text-gray-700">Include Signature Line</span>
                  </label>
                </div>

              </div>
              <div className="p-6 border-t bg-gray-50">
                <button onClick={() => setTemplateDrawerOpen(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm shadow-md">Apply Template Changes</button>
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    );
  }

  // --- RENDER LIST VIEW ---
  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Award Function Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Create physical & virtual award events linked to published exam results.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold transition-colors bg-[#B45309] hover:bg-amber-700 shadow-md shadow-amber-900/20"
        >
          <Plus className="w-4 h-4" /> Create Award Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium animate-pulse">Loading events...</div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#B45309] group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${event.status === 'Draft' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                  {event.status}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#B45309] transition-colors">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {event.venue}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3"/> {event.date}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400"/> {event.medalsCount} Recipients</span>
                <span className="text-sm font-bold text-[#B45309] flex items-center gap-1">Manage &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Award className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No Award Events</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">You need to publish exam results before creating an award event.</p>
          <button onClick={() => window.location.href = '/dashboard/super-admin/results'} className="text-sm font-bold text-[#B45309] hover:underline">Go to Results & Leaderboard &rarr;</button>
        </div>
      )}

      {/* CREATE EVENT DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Create Award Event</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Name *</label>
                <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Annual Math Honors 2023" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link to Published Exam *</label>
                <select required value={newEvent.examId} onChange={e => setNewEvent({...newEvent, examId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20 bg-white">
                  <option value="" disabled>Select exam...</option>
                  <option value="Math Olympiad 2023 - Finals">Math Olympiad 2023 - Finals</option>
                  <option value="Science Qualifier Q3">Science Qualifier Q3</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">Medalists will be auto-populated based on the selected exam's leaderboard.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ceremony Date *</label>
                  <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ceremony Venue</label>
                  <input type="text" placeholder="Optional" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Description</label>
                <textarea rows={4} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Add details about the ceremony..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20"></textarea>
              </div>
            </form>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl bg-white hover:bg-gray-50 shadow-sm">Cancel</button>
              <button type="submit" onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.examId || !newEvent.date} className="flex-1 py-3 bg-[#B45309] text-white font-bold rounded-xl shadow-md hover:bg-amber-700 disabled:opacity-50">Create & Auto-Assign</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

// Icon hack to avoid lucide-react import error if Sparkles is missing
function SparklesIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}