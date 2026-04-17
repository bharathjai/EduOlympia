"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase.from('trainer_exams').select('*').order('id', { ascending: false });
      if (!error && data) {
        setExams(data.map(exam => ({
          id: exam.id,
          title: exam.title,
          subject: exam.subject,
          class: exam.class_grade,
          date: exam.date,
          durationMinutes: exam.duration,
          status: exam.status,
          type: 'Formal Exam',
          questionsCount: 50
        })));
      }
      setLoading(false);
    };
    fetchExams();
  }, []);

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
        <p className="text-gray-500 mt-1">View your upcoming formal exams and past exam history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏱️</div>
            <h3 className="font-bold text-gray-900 mb-1">No upcoming exams</h3>
            <p className="text-sm text-gray-500">You're all caught up! Check your practice section.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${exam.type === 'Formal Exam' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {exam.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{exam.questionsCount} Questions</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2">{exam.title}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{exam.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{exam.date ? new Date(exam.date).toLocaleDateString() : (exam.dueDate ? `Due ${new Date(exam.dueDate).toLocaleDateString()}` : 'Flexible timing')}</span>
                  </div>
                </div>
              </div>
              
              <Link href={`/dashboard/student/take-test/${exam.id}`} className="w-full bg-brand text-white text-sm font-semibold py-2.5 rounded-xl group-hover:bg-brand-hover transition-colors flex items-center justify-center gap-2">
                Start Exam <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
