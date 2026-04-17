"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Clock, FileText, Plus, Users, Calendar } from "lucide-react";

export default function TrainerExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams`)
      .then(res => res.json())
      .then(data => {
        setExams(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        <button className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Schedule Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⏱️</div>
            <h3 className="font-bold text-gray-900 mb-1">No upcoming exams</h3>
            <p className="text-sm text-gray-500">Schedule formal mock Olympiads and set timers.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                  <span>{exam.date ? new Date(exam.date).toLocaleDateString() : (exam.dueDate ? `Due ${new Date(exam.dueDate).toLocaleDateString()}` : 'No date set')}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <button className="text-brand hover:text-brand-hover text-sm font-bold transition-colors">Edit Details</button>
                <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"></div>
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300"></div>
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-brand text-white flex items-center justify-center text-[8px] font-bold">+42</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
