"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Users, BookOpen, Video, TrendingUp, Award, Clock } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TrainerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data, error } = await supabase.from('analytics_overview').select('*').limit(1).single();
      if (!error && data) {
        setAnalytics({
          totalStudents: data.total_students,
          materialsPublished: data.materials_published,
          questionsCreated: data.questions_created,
          liveClassesHosted: data.live_classes_hosted,
          averageTestScore: data.average_test_score,
          improvementRate: data.improvement_rate,
          recentActivity: [
            { action: 'Uploaded: "Quadratic Equations - Notes.pdf"', time: '2 hours ago' },
            { action: 'Generated 25 MCQs for "Linear Equations"', time: 'Yesterday' },
            { action: 'Created Practice Paper: Mathematics - Chapter 2', time: '2 days ago' }
          ]
        });
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
        <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor batch performance and engagement metrics.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Students</p>
            <h2 className="text-3xl font-black text-gray-900">{analytics?.totalStudents}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Average Test Score</p>
            <h2 className="text-3xl font-black text-gray-900">{analytics?.averageTestScore}%</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Overall Improvement</p>
            <h2 className="text-3xl font-black text-gray-900">+{analytics?.improvementRate}%</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area (Simulated with CSS) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Subject Performance Breakdown</h3>
          
          <div className="space-y-6">
            {[
              { subject: "Algebra", score: 85, color: "bg-brand" },
              { subject: "Geometry", score: 72, color: "bg-orange-500" },
              { subject: "Calculus", score: 64, color: "bg-red-500" },
              { subject: "Trigonometry", score: 91, color: "bg-emerald-500" }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-gray-700">{item.subject}</span>
                  <span className="text-gray-900">{item.score}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
             <div>
               <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Materials</p>
               <p className="text-xl font-bold text-gray-900">{analytics?.materialsPublished}</p>
             </div>
             <div>
               <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Questions</p>
               <p className="text-xl font-bold text-gray-900">{analytics?.questionsCreated}</p>
             </div>
             <div>
               <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Live Classes</p>
               <p className="text-xl font-bold text-gray-900">{analytics?.liveClassesHosted}</p>
             </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand" /> Recent Activity
          </h3>
          
          <div className="space-y-6">
            {analytics?.recentActivity?.map((activity: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-brand shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 leading-snug">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
