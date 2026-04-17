"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Video, Download } from "lucide-react";

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
        <p className="text-gray-500 mt-1">Access all your course materials and notes.</p>
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
                {mat.url ? (
                  <a href={mat.url} download target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-hover bg-brand/5 hover:bg-brand/10 p-2 rounded-lg transition-colors flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </a>
                ) : (
                  <button className="text-gray-400 bg-gray-50 p-2 rounded-lg cursor-not-allowed" title="No file available">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {materials.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No materials available right now.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
