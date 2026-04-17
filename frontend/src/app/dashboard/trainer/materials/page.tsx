"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Video, Download, UploadCloud, Trash2 } from "lucide-react";

export default function TrainerMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
        setMaterials(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMaterials();
      }
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
        <button className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
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
    </DashboardLayout>
  );
}
