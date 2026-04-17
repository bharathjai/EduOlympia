"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Video, Calendar, Plus, Users, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function TrainerClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', subject: '', class: '', date: '', time: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClasses = async () => {
    const { data, error } = await supabase.from('live_classes').select('*').order('id', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      // Map DB snake_case to UI expected camelCase
      const formattedClasses = data?.map(cls => ({
        id: cls.id,
        title: cls.title,
        subject: cls.subject,
        class: cls.class_grade, // Map class_grade to class
        date: cls.date,
        time: cls.time,
        status: cls.status,
        studentsRegistered: cls.students_registered
      })) || [];
      setClasses(formattedClasses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenModal = (cls?: any) => {
    if (cls) {
      setEditingId(cls.id);
      setFormData({
        title: cls.title,
        subject: cls.subject,
        class: cls.class,
        date: cls.date,
        time: cls.time
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', subject: '', class: '', date: '', time: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dbPayload = {
      title: formData.title,
      subject: formData.subject,
      class_grade: formData.class,
      date: formData.date,
      time: formData.time,
      status: 'upcoming',
      students_registered: editingId ? undefined : 0 // Don't overwrite if editing
    };

    try {
      if (editingId) {
        await supabase.from('live_classes').update(dbPayload).eq('id', editingId);
      } else {
        await supabase.from('live_classes').insert([dbPayload]);
      }
      
      await fetchClasses();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!editingId || !confirm("Are you sure you want to delete this class?")) return;
    setIsSubmitting(true);
    try {
      await supabase.from('live_classes').delete().eq('id', editingId);
      await fetchClasses();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleCancelClass = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this class?")) return;
    try {
      await supabase.from('live_classes').delete().eq('id', id);
      await fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎥</div>
            <h3 className="font-bold text-gray-900 mb-1">No upcoming classes</h3>
            <p className="text-sm text-gray-500">Schedule your first live class to get started.</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cls.status === 'upcoming' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {cls.date}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500">{cls.time}</span>
                  <button 
                    onClick={() => handleCancelClass(cls.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Cancel Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cls.title}</h3>
              <p className="text-xs text-gray-500 mb-6">{cls.class} • {cls.subject}</p>
              
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium mb-6">
                <Users className="w-4 h-4" />
                {cls.studentsRegistered} Students Registered
              </div>
              
              {cls.status === 'upcoming' ? (
                <Link href={`/dashboard/trainer/live-class/${cls.id}`} className="w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600">
                  <Video className="w-4 h-4" />
                  Start Class Now
                </Link>
              ) : (
                <button 
                  onClick={() => handleOpenModal(cls)}
                  className="w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover"
                >
                  <Calendar className="w-4 h-4" />
                  Edit Details
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">{editingId ? 'Edit Class Details' : 'Schedule New Class'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Title</label>
                <input 
                  type="text" required placeholder="e.g., Algebra Basics"
                  className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                  <input 
                    type="text" required placeholder="e.g., Math"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class/Grade</label>
                  <input 
                    type="text" required placeholder="e.g., Class 8"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                  <input 
                    type="text" required placeholder="e.g., Today"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                  <input 
                    type="text" required placeholder="e.g., 04:00 PM"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                {editingId && (
                  <button type="button" onClick={handleDelete} className="p-3.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Delete Class">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 px-4 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                  {isSubmitting ? "Saving..." : <><Calendar className="w-5 h-5" /> Save Class</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
