"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { 
  Calendar, Video, Plus, Users, Clock, PlayCircle, FileText, 
  Trash2, X, Edit3, ChevronLeft, ChevronRight, VideoIcon, Download, AlertCircle, Play
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";


const mockAttendance = [
  { id: "s1", name: "Arjun Kumar", school: "Delhi Public School", joined: true, joinTime: "14:28", duration: "60 mins" },
  { id: "s2", name: "Priya Sharma", school: "Delhi Public School", joined: true, joinTime: "14:35", duration: "53 mins" },
  { id: "s3", name: "Rohan Verma", school: "Delhi Public School", joined: false, joinTime: "-", duration: "-" },
  { id: "s4", name: "Sneha Gupta", school: "Delhi Public School", joined: true, joinTime: "14:30", duration: "58 mins" },
];

const weekDays = [
  { day: "Mon", date: "19", active: false, hasEvent: true },
  { day: "Tue", date: "20", active: false, hasEvent: true },
  { day: "Wed", date: "21", active: false, hasEvent: false },
  { day: "Thu", date: "22", active: true, hasEvent: true },
  { day: "Fri", date: "23", active: false, hasEvent: true },
  { day: "Sat", date: "24", active: false, hasEvent: false },
  { day: "Sun", date: "25", active: false, hasEvent: false },
];

export default function LiveClassManagerPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pastClasses, setPastClasses] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from('live_classes').select('*').order('scheduled_at', { ascending: true });
      if (data) {
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        
        data.forEach((cls: any) => {
          const date = new Date(cls.scheduled_at);
          const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          
          if (cls.status === 'completed' || date < now) {
            past.push({
              id: cls.id.toString(),
              title: cls.title,
              subject: cls.subject || 'General',
              date: formattedDate,
              attended: Math.floor(Math.random() * 20) + 20, // Mock attendance for now
              total: 50,
              processing: !cls.recording_url
            });
          } else {
            upcoming.push({
              id: cls.id.toString(),
              title: cls.title,
              subject: cls.subject || 'General',
              date: formattedDate,
              time: time,
              studentsRegistered: Math.floor(Math.random() * 20) + 30, // Mock registered
              isLaunchable: date.getTime() - now.getTime() < 15 * 60 * 1000 // 15 mins before
            });
          }
        });
        
        setUpcomingClasses(upcoming);
        setPastClasses(past.reverse());
      }
    };
    fetchClasses();
  }, []);
  
  // Modals
  const [activeModal, setActiveModal] = useState<"schedule" | "attendance" | "recording" | "launch" | null>(null);
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ title: '', subject: 'Mathematics', chapter: '', date: '', time: '', duration: '60', description: '' });

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal(null);
      alert("Class scheduled and students notified!");
    }, 1500);
  };

  const handleCancelSession = () => {
    if(!confirm("Are you sure you want to cancel this session? Enrolled students will be automatically notified.")) return;
    alert("Session cancelled successfully.");
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans bg-slate-50 relative">
        
        {/* --- HEADER --- */}
        <div className="bg-white p-6 md:p-8 border-b border-gray-200 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Live Classes</h1>
              <p className="text-gray-500 font-medium mt-1">Schedule sessions, view recordings, and track attendance.</p>
            </div>
            <button onClick={() => setActiveModal("schedule")} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Schedule Class
            </button>
          </div>

          {/* Calendar Strip */}
          <div className="flex items-center gap-4">
             <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-500"><ChevronLeft className="w-5 h-5"/></button>
             <div className="flex-1 flex justify-between gap-2 overflow-x-auto pb-2">
               {weekDays.map((d, i) => (
                 <button key={i} className={`flex-1 min-w-[70px] flex flex-col items-center py-3 rounded-2xl border transition-all ${d.active ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                   <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${d.active ? 'text-indigo-200' : 'text-gray-400'}`}>{d.day}</span>
                   <span className="text-xl font-black">{d.date}</span>
                   {d.hasEvent && <div className={`w-1.5 h-1.5 rounded-full mt-2 ${d.active ? 'bg-white' : 'bg-indigo-500'}`}></div>}
                 </button>
               ))}
             </div>
             <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-500"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 pb-px">
            <button onClick={() => setActiveTab("upcoming")} className={`px-4 py-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'upcoming' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              Upcoming Sessions
            </button>
            <button onClick={() => setActiveTab("past")} className={`px-4 py-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'past' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              Past Sessions & Recordings
            </button>
          </div>

          {activeTab === "upcoming" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingClasses.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl border border-gray-200 border-dashed p-12 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8" /></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming classes</h3>
                  <p className="text-gray-500 font-medium">Schedule your next session using the button above.</p>
                </div>
              ) : (
                upcomingClasses.map(cls => (
                  <div key={cls.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col hover:border-indigo-300 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {cls.date} at {cls.time}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"><Edit3 className="w-4 h-4"/></button>
                        <button onClick={handleCancelSession} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{cls.title}</h3>
                    <p className="text-sm font-semibold text-gray-500 mb-6">{cls.subject}</p>
                    
                    <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cls.studentsRegistered} Students</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => setActiveModal("launch")}
                        disabled={!cls.isLaunchable}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${cls.isLaunchable ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <VideoIcon className="w-5 h-5" /> Launch Class
                      </button>
                      {!cls.isLaunchable && <p className="text-center text-xs font-semibold text-orange-500 mt-3">Launch button activates 15 mins before start time.</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pastClasses.map(cls => (
                <div key={cls.id} className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">{cls.title}</h3>
                      <p className="text-sm font-semibold text-gray-500">{cls.date} • {cls.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                    
                    <div className="text-center md:text-left flex-1 md:flex-none">
                      <p className="text-2xl font-black text-gray-900">{cls.attended}<span className="text-sm text-gray-400">/{cls.total}</span></p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attended</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button onClick={() => setActiveModal("attendance")} className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                         <FileText className="w-4 h-4" /> Attendance
                      </button>
                      
                      {cls.processing ? (
                         <div className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2" title="Check back in 1-2 hours">
                           <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                         </div>
                      ) : (
                         <button onClick={() => setActiveModal("recording")} className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                           <PlayCircle className="w-4 h-4" /> View Recording
                         </button>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MODALS --- */}

        {/* Schedule Class Modal */}
        {activeModal === "schedule" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <Calendar className="w-6 h-6 text-indigo-600" /> Schedule Class
                 </h3>
                 <button onClick={() => !isSubmitting && setActiveModal(null)} disabled={isSubmitting} className="text-gray-400 hover:text-gray-900 bg-white p-2 border border-gray-200 rounded-full shadow-sm disabled:opacity-50">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleSimulateSubmit} className="overflow-y-auto p-6 space-y-5">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class Title</label>
                   <input type="text" required placeholder="e.g. Algebra Revision" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                     <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting}>
                       <option>Mathematics</option>
                       <option>Science</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chapter (Optional)</label>
                     <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting}>
                       <option value="">Select Chapter</option>
                       <option>Algebra</option>
                       <option>Geometry</option>
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                     <input type="date" required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Time</label>
                     <input type="time" required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Duration (Mins)</label>
                     <input type="number" required defaultValue="60" min="15" step="15" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900" disabled={isSubmitting} />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                   <textarea placeholder="What will be covered in this session?" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-gray-900 min-h-[100px]" disabled={isSubmitting}></textarea>
                 </div>

                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                   <p className="text-sm font-medium text-indigo-900 leading-snug">When you schedule this class, an automatic notification and calendar invite will be sent to all enrolled students.</p>
                 </div>

                 <div className="pt-4">
                   <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Notify Students"}
                   </button>
                 </div>
              </form>
            </div>
          </div>
        )}

        {/* Launch In-App Modal */}
        {activeModal === "launch" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 animate-in fade-in duration-300">
             <div className="w-full max-w-5xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700">
               <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-700">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <span className="font-bold">Algebra Masterclass (Live)</span>
                 </div>
                 <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold">End Class</button>
               </div>
               <div className="aspect-video bg-black flex items-center justify-center flex-col relative">
                 <VideoIcon className="w-16 h-16 text-slate-700 mb-4" />
                 <p className="text-slate-500 font-bold text-lg">In-App Video Conferencing Provider Initializes Here</p>
                 
                 {/* Mock UI controls */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white"><VideoIcon className="w-5 h-5"/></div>
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white"><Users className="w-5 h-5"/></div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Recording Player Modal */}
        {activeModal === "recording" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
             <div className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700 relative">
               <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors backdrop-blur-sm">
                 <X className="w-5 h-5" />
               </button>
               <div className="aspect-video bg-black flex items-center justify-center relative group">
                 {/* Mock Video Element */}
                 <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                   <p className="text-slate-600 font-bold">Video Player Embed</p>
                 </div>
                 <button className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                   <Play className="w-8 h-8 ml-2" />
                 </button>
                 
                 {/* Scrubber Mock */}
                 <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-700">
                   <div className="h-full bg-indigo-500 w-[30%]"></div>
                 </div>
               </div>
               <div className="p-6">
                 <h2 className="text-2xl font-black text-white mb-2">Geometry Refresher</h2>
                 <p className="text-slate-400 font-medium text-sm">Recorded on 24 April 2026 • 1h 15m</p>
               </div>
             </div>
          </div>
        )}

        {/* Attendance Modal */}
        {activeModal === "attendance" && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right-full duration-300 flex flex-col">
               <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                 <div>
                   <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-indigo-600" /> Attendance Log
                   </h3>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Geometry Refresher</p>
                 </div>
                 <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                 <p className="text-sm font-bold text-gray-700">Attended: <span className="text-indigo-600">3/4</span></p>
                 <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"><Download className="w-3 h-3"/> Export CSV</button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {mockAttendance.map(student => (
                   <div key={student.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-gray-900 text-sm mb-1">{student.name}</h4>
                       <p className="text-xs text-gray-500">{student.school}</p>
                     </div>
                     <div className="text-right">
                       {student.joined ? (
                         <>
                           <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest rounded mb-1">Joined</span>
                           <p className="text-xs font-bold text-gray-400">{student.duration}</p>
                         </>
                       ) : (
                         <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded">Absent</span>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
