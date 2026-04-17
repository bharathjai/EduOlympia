"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Video, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function LiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from('live_classes').select('*').order('id', { ascending: false });
      if (!error && data) {
        setClasses(data);
      }
      setLoading(false);
    };
    fetchClasses();
  }, []);

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
        <p className="text-gray-500 mt-1">Join your scheduled live classes and view recordings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎥</div>
            <h3 className="font-bold text-gray-900 mb-1">No upcoming classes</h3>
            <p className="text-sm text-gray-500">You don't have any classes scheduled right now.</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cls.status === 'upcoming' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {cls.date}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{cls.title}</h3>
                <p className="text-xs text-gray-500 mb-6">{cls.subject}</p>
                
                <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium mb-6">
                  <Clock className="w-4 h-4" />
                  {cls.time}
                </div>
              </div>
              
              {cls.status === 'upcoming' ? (
                <Link href={`/dashboard/student/live-class/${cls.id}`} className="w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover">
                  <Video className="w-4 h-4" />
                  Join Class
                </Link>
              ) : (
                <button className="w-full text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                  <Video className="w-4 h-4" />
                  View Recording
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
