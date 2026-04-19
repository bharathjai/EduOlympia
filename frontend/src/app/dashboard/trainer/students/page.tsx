"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search, UserCircle, MoreVertical, TrendingUp, TrendingDown, Phone } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TrainerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from('trainer_students').select('*').order('id', { ascending: true });
      if (!error && data) {
        setStudents(data.map(s => ({
          id: s.id,
          name: s.name,
          class: s.class_grade,
          section: s.section,
          lastActive: s.last_active,
          score: s.score,
          phone: s.phone
        })));
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students & Performance</h1>
          <p className="text-gray-500 mt-1">View your students, manage batches, and monitor their performance.</p>
        </div>
        
        <div className="relative w-72">
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Student</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Class & Section</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Contact</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Last Active</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm w-48">Performance Score</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No students found matching your search.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                          {student.class} - {student.section}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm flex items-center gap-2 mt-2">
                        <Phone className="w-3.5 h-3.5" /> {student.phone}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {student.lastActive}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.score >= 80 ? 'bg-emerald-500' : student.score >= 60 ? 'bg-brand' : 'bg-orange-500'}`}
                              style={{ width: `${student.score}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-bold ${student.score >= 80 ? 'text-emerald-600' : student.score >= 60 ? 'text-brand' : 'text-orange-600'}`}>
                            {student.score}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                          className="text-gray-400 hover:text-brand transition-colors p-2 rounded-lg hover:bg-brand/10"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === student.id && (
                          <div className="absolute right-6 top-14 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors">
                              View Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors">
                              Message
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors">
                              Assign Test
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
