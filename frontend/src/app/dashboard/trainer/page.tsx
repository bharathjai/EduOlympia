"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Calendar,
  UploadCloud,
  Sparkles,
  FileText,
  TrendingUp,
  Video,
  Calculator,
  PieChart,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

export default function TrainerDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', subject: '', date: '', time: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnalytics = () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`).then(res => res.json()).then(data => setAnalytics(data.data));
  const fetchClasses = () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`).then(res => res.json()).then(data => setClasses(data.data));

  useEffect(() => {
    fetchAnalytics();
    fetchClasses();
  }, []);

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let endpoint = 'analytics/activity';
      let actionText = '';
      let body = {};

      if (activeModal === 'upload') {
        endpoint = 'materials';
        actionText = `Uploaded: "${formData.title}"`;
        body = { title: formData.title, type: 'PDF', subject: formData.subject };
      } else if (activeModal === 'generate') {
        endpoint = 'analytics/activity'; // Only log activity
        actionText = `Generated Questions for "${formData.title}"`;
        body = { action: actionText };
      } else if (activeModal === 'practice') {
        endpoint = 'exams';
        actionText = `Created Practice Paper: ${formData.title}`;
        body = { title: formData.title, type: 'Practice Test' };
      } else if (activeModal === 'class') {
        endpoint = 'classes';
        actionText = `Scheduled Live Class: ${formData.title}`;
        body = { title: formData.title, subject: formData.subject, date: formData.date, time: formData.time };
      }

      // 1. Post to specific endpoint
      if (activeModal === 'upload') {
        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('subject', formData.subject);
        if (file) {
          uploadData.append('file', file);
        }
        
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
          method: 'POST',
          body: uploadData
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      // 2. If it wasn't just an activity log, also log it to activity
      if (endpoint !== 'analytics/activity') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: actionText })
        });
      }

      // 3. Refresh data
      fetchAnalytics();
      fetchClasses();
      fetchClasses();
      setActiveModal(null);
      setFormData({ title: '', subject: '', date: '', time: '' });
      setFile(null);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout 
      role="trainer" 
      userName="Rahul Singh" 
      userDescription="Trainer - Mathematics"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, Rahul! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your training today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#FAF5FF] rounded-2xl p-5 border border-purple-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#E9D8FD] text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-600 mb-0.5 uppercase tracking-wider">Total Students</p>
            <p className="text-xl font-extrabold text-gray-900">{analytics?.totalStudents || "..."}</p>
          </div>
        </div>
        
        <div className="bg-[#F0FDF4] rounded-2xl p-5 border border-emerald-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#D1FAE5] text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-600 mb-0.5 uppercase tracking-wider">Materials Published</p>
            <p className="text-xl font-extrabold text-gray-900">{analytics?.materialsPublished || "..."}</p>
          </div>
        </div>

        <div className="bg-[#EFF6FF] rounded-2xl p-5 border border-blue-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#DBEAFE] text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-600 mb-0.5 uppercase tracking-wider">Questions Created</p>
            <p className="text-xl font-extrabold text-gray-900">{analytics?.questionsCreated || "..."}</p>
          </div>
        </div>

        <div className="bg-[#FFFBEB] rounded-2xl p-5 border border-orange-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#FEF3C7] text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-orange-600 mb-0.5 uppercase tracking-wider">Live Classes</p>
            <p className="text-xl font-extrabold text-gray-900">{analytics?.liveClassesHosted || "..."}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={() => setActiveModal('upload')} className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#F3F0FF] hover:bg-[#EBE5FF]">
                <div className="text-brand mb-5">
                  <UploadCloud className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Upload Study Material</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Notes, PDFs, Videos</p>
                </div>
              </button>

              <button onClick={() => setActiveModal('generate')} className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#ECFDF5] hover:bg-[#D1FAE5]">
                <div className="text-emerald-600 mb-5">
                  <Sparkles className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Generate Questions with AI</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Create from Topic</p>
                </div>
              </button>

              <button onClick={() => setActiveModal('practice')} className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#EFF6FF] hover:bg-[#DBEAFE]">
                <div className="text-blue-600 mb-5">
                  <FileText className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Create Practice Paper</h3>
                  <p className="text-xs text-gray-500 mt-1.5">From Question Bank</p>
                </div>
              </button>

              <button onClick={() => setActiveModal('class')} className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#FFFBEB] hover:bg-[#FEF3C7]">
                <div className="text-amber-600 mb-5">
                  <Calendar className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Schedule Live Class</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Set Date & Time</p>
                </div>
              </button>
            </div>
          </section>

          {/* Upcoming Live Classes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Live Classes</h2>
              <button className="text-sm text-brand font-medium hover:underline">View Calendar</button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {classes.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">Loading classes...</div>
              ) : (
                classes.map((cls, idx) => (
                  <div key={cls.id} className="bg-[#F3F0FF] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-brand/10 text-brand text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{cls.date}</span>
                        <span className="text-xs text-gray-600 font-medium">{cls.time}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-[15px] mb-1">{cls.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{cls.class} • {cls.subject}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium mb-4 relative z-10">
                        <Users className="w-4 h-4" />
                        {cls.studentsRegistered} Students Registered
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <button className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 w-fit">
                        <Video className="w-4 h-4" />
                        {cls.status === 'upcoming' ? 'Start Class' : 'View Details'}
                      </button>
                    </div>

                    {/* Decorative Graphic */}
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1 -right-2 text-brand opacity-60">
                      {idx % 2 === 0 ? <Calculator className="w-24 h-24" strokeWidth={1} /> : <PieChart className="w-24 h-24" strokeWidth={1} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-brand font-medium hover:underline">View All</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-2">
              {!analytics ? (
                <div className="text-center py-4 text-gray-500 text-sm">Loading activity...</div>
              ) : (
                (analytics?.recentActivity || []).map((activity: any, i: number) => {
                  const isUpload = activity.action.includes('Upload');
                  const isGen = activity.action.includes('Generat');
                  const Icon = isUpload ? FileText : (isGen ? Sparkles : FileText);
                  const color = isUpload ? "text-orange-500" : (isGen ? "text-emerald-500" : "text-brand");
                  const bg = isUpload ? "bg-orange-100" : (isGen ? "bg-emerald-100" : "bg-brand/10");

                  return (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${bg} ${color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">EduOlympia System</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
              <button className="text-sm text-brand font-medium hover:underline">Analytics</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg. Test Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900">{analytics?.averageTestScore || "..."}%</p>
                  <span className="text-xs text-emerald-500 font-medium flex items-center pb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> 5.2%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Students Improved</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900">62%</p>
                  <span className="text-xs text-emerald-500 font-medium flex items-center pb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {analytics?.improvementRate || "..."}%
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="h-40 bg-gradient-to-t from-brand/5 to-transparent border-b border-brand rounded-lg relative flex items-end px-2">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q25,60 50,70 T100,30 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.1" />
                <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#4F46E5" strokeWidth="2" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </section>

          <section className="bg-gradient-to-br from-brand to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-brand/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold">Try AI Doubt Assistant</h2>
            </div>
            <p className="text-sm text-white/80 mb-6">Get instant answers and explanations for student doubts.</p>
            <button className="w-full bg-white text-brand font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Open Assistant
            </button>
          </section>
        </div>
      </div>

      {/* Quick Action Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">
                {activeModal === 'upload' && 'Upload Material'}
                {activeModal === 'generate' && 'AI Question Generator'}
                {activeModal === 'practice' && 'Create Practice Paper'}
                {activeModal === 'class' && 'Schedule Live Class'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {activeModal === 'generate' ? 'Topic / Subject' : 'Title'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={activeModal === 'generate' ? 'e.g., Linear Equations' : 'Enter title...'}
                  className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {(activeModal === 'upload' || activeModal === 'class') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject / Category</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Mathematics"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              )}

              {activeModal === 'upload' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload File</label>
                  <input 
                    type="file" 
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition-all border border-dashed border-gray-300 rounded-xl p-2 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}

              {activeModal === 'class' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Tomorrow"
                      className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                    <input 
                      type="text" 
                      required
                      placeholder="10:00 AM"
                      className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="opacity-70">Processing...</span>
                  ) : (
                    <>
                      {activeModal === 'upload' && <UploadCloud className="w-5 h-5" />}
                      {activeModal === 'generate' && <Sparkles className="w-5 h-5" />}
                      {activeModal === 'practice' && <FileText className="w-5 h-5" />}
                      {activeModal === 'class' && <Calendar className="w-5 h-5" />}
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
