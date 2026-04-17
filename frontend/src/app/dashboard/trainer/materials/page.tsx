"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Video, Download, UploadCloud, Trash2, X } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TrainerMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subject: '', class: '', type: 'PDF' });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    const { data, error } = await supabase.from('trainer_materials').select('*').order('id', { ascending: false });
    if (!error && data) {
      setMaterials(data.map(m => ({
        id: m.id,
        title: m.title,
        subject: m.subject,
        class: m.class_grade,
        type: m.type,
        size: m.size,
        uploadedAt: m.uploaded_at
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('trainer_materials').insert([{
        title: formData.title,
        subject: formData.subject,
        class_grade: formData.class,
        type: formData.type,
        size: '1.2 MB', // Mock size
        uploaded_at: 'Just now'
      }]);
      await fetchMaterials();
      setIsModalOpen(false);
      setFormData({ title: '', subject: '', class: '', type: 'PDF' });
      setFile(null);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      await supabase.from('trainer_materials').delete().eq('id', id);
      fetchMaterials();
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Upload New
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading materials...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {materials.map((mat) => (
              <div key={mat.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mat.type === 'PDF' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {mat.type === 'PDF' ? <FileText className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{mat.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{mat.subject} • {mat.class} • {mat.type === 'PDF' ? mat.size : mat.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {mat.url ? (
                    <a href={mat.url} download target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-hover bg-brand/5 hover:bg-brand/10 p-2 rounded-lg transition-colors flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </a>
                  ) : (
                    <button className="text-gray-400 bg-gray-50 p-2 rounded-lg cursor-not-allowed" title="No file available">
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(mat.id)}
                    className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📁</div>
                <h3 className="font-bold text-gray-900 mb-1">No materials yet</h3>
                <p className="text-sm text-gray-500">Upload your first study material to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">Upload Material</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input 
                  type="text" required placeholder="e.g., Quadratic Equations Notes"
                  className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                  <input 
                    type="text" required placeholder="e.g., Mathematics"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class/Grade</label>
                  <input 
                    type="text" required placeholder="e.g., Class 10"
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                  <select 
                    className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all bg-white"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload File</label>
                <input 
                  type="file" required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition-all border border-dashed border-gray-300 rounded-xl p-2 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                  }}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 px-4 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                  {isSubmitting ? "Uploading..." : <><UploadCloud className="w-5 h-5" /> Upload Material</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
