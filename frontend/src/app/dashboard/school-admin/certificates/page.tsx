"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Award, Download, FileArchive, Search, AlertCircle, Medal, Calendar, ChevronRight, FileDown, CheckCircle2, ChevronLeft, MapPin } from "lucide-react";
import { useState } from "react";

export default function CertificatesAwards() {
  const [activeTab, setActiveTab] = useState<"certificates" | "awards">("certificates");
  const [examFilter, setExamFilter] = useState("midterm");
  const [search, setSearch] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState("");

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  // Mock Data
  const certificateData = [
    { id: "STU-001", name: "Aisha Ramachandran", class: "Grade 10", score: "96%", rank: 1, status: "Ready" },
    { id: "STU-002", name: "Michael Brown", class: "Grade 10", score: "88%", rank: 2, status: "Ready" },
    { id: "STU-004", name: "Sarah Williams", class: "Grade 10", score: "72%", rank: 3, status: "Not Available" }, // Mock missing cert
  ];

  const awardEvents = [
    { id: "evt1", name: "Annual Excellence Awards 2023", exam: "Term 1 Mathematics Olympiad", date: "Dec 15, 2023", status: "Upcoming", hasBrochure: true, venue: "Grand City Hall" },
    { id: "evt2", name: "Spring Science Honors", exam: "Regional Physics Qualifier", date: "Oct 30, 2023", status: "Past", hasBrochure: true, venue: "Virtual" },
  ];

  const awardRecipients = [
    { name: "Aisha Ramachandran", class: "Grade 10", medal: "Gold", rank: 1, desc: "Platform Rank 1" },
    { name: "Michael Brown", class: "Grade 10", medal: "School Champion", rank: 2, desc: "Highest in Springfield High" },
    { name: "David Wilson", class: "Grade 11", medal: "Special Award", rank: "-", desc: "Most Improved Student" },
  ];

  const getMedalColor = (type: string) => {
    switch(type) {
      case 'Gold': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'Silver': return 'text-slate-500 bg-slate-50 border-slate-200';
      case 'Bronze': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'School Champion': return 'text-[#1D6A4A] bg-green-50 border-green-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  const getMedalIconColor = (type: string) => {
    switch(type) {
      case 'Gold': return 'text-yellow-500';
      case 'Silver': return 'text-slate-400';
      case 'Bronze': return 'text-amber-600';
      case 'School Champion': return 'text-[#1D6A4A]';
      default: return 'text-purple-500';
    }
  };

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      {/* Detail View Wrapper for Awards */}
      {expandedEventId ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => setExpandedEventId(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-[#1D6A4A] font-medium text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Awards
            </button>
            <button 
              onClick={() => triggerToast("Brochure PDF downloading...")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4" /> Download Brochure (PDF)
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-[#1D6A4A] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Award className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                {awardEvents.find(e => e.id === expandedEventId)?.status === 'Upcoming' ? 'Upcoming Ceremony' : 'Past Ceremony'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black mb-3">{awardEvents.find(e => e.id === expandedEventId)?.name}</h1>
              <p className="text-green-100 text-lg font-medium mb-6">Linked Exam: {awardEvents.find(e => e.id === expandedEventId)?.exam}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-green-300" />
                  {awardEvents.find(e => e.id === expandedEventId)?.date}
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-green-300" />
                  {awardEvents.find(e => e.id === expandedEventId)?.venue}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Medal Recipients from your school</h2>
                <p className="text-sm text-gray-500 mt-1">These awards were allocated centrally by the platform team.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {awardEvents.find(e => e.id === expandedEventId)?.status === 'Upcoming' ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <Medal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-gray-900">Medals are currently being finalized.</p>
                  <p className="text-sm mt-1">Recipients will be displayed here closer to the ceremony date.</p>
                </div>
              ) : (
                awardRecipients.map((rec, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:border-gray-300 transition-colors bg-white">
                    <div className="mt-1">
                      <Medal className={`w-8 h-8 ${getMedalIconColor(rec.medal)}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{rec.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{rec.class} • Exam Rank: {rec.rank}</p>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getMedalColor(rec.medal)}`}>
                        {rec.medal}
                      </span>
                      <p className="text-xs text-gray-500 font-medium mt-2 italic">{rec.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main View */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Certificates & Awards</h1>
            <p className="text-sm text-gray-500 mt-1">Download student certificates and view regional award allocations.</p>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-2">
            {[
              { id: "certificates", label: "Certificates" },
              { id: "awards", label: "Award Ceremonies" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "certificates" | "awards")}
                className={`relative px-6 py-3 text-sm font-bold whitespace-nowrap transition-all rounded-t-xl ${
                  activeTab === tab.id 
                    ? "bg-white text-[#1D6A4A] border-t border-x border-gray-200 -mb-px shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-t border-x border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-300">
            
            {/* TAB: Certificates */}
            {activeTab === "certificates" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">Select Exam:</span>
                    <select 
                      value={examFilter}
                      onChange={(e) => setExamFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] bg-white shadow-sm min-w-[250px]"
                    >
                      <option value="midterm">Term 1 Mathematics Olympiad</option>
                      <option value="pending">English Literature Qualifier (Pending)</option>
                    </select>
                  </div>
                  {examFilter !== "pending" && (
                    <button 
                      onClick={() => triggerToast("Zipping all ready certificates... Download starting soon.")}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1D6A4A] text-white rounded-xl hover:bg-green-800 text-sm font-bold shadow-md shadow-green-700/20 transition-colors"
                    >
                      <FileArchive className="w-4 h-4" /> Download All (ZIP)
                    </button>
                  )}
                </div>

                {examFilter === "pending" ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border-4 border-amber-100">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No results have been published yet.</h3>
                    <p className="text-sm text-gray-500 max-w-md">Certificates will be available here automatically after results are published and verified by the platform team.</p>
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-3 border-b border-gray-100 bg-white flex justify-between items-center text-sm">
                      <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search student..." 
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700/20"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4 text-center">Score</th>
                            <th className="px-6 py-4 text-center">Rank</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Certificate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {certificateData.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((student) => (
                            <tr key={student.id} className="hover:bg-green-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.class} • {student.id}</p>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-[#1D6A4A]">{student.score}</td>
                              <td className="px-6 py-4 text-center font-bold text-gray-700">#{student.rank}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${student.status === 'Ready' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {student.status === 'Ready' ? (
                                  <button onClick={() => triggerToast(`Downloading certificate for ${student.name}...`)} className="p-2 text-[#1D6A4A] hover:bg-green-100 rounded-lg transition-colors inline-flex items-center gap-2 border border-transparent hover:border-green-200" title="Download Certificate PDF">
                                    <span className="text-sm font-bold hidden sm:inline">Download</span> <Download className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 font-medium">Not Available</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB: Awards */}
            {activeTab === "awards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {awardEvents.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:border-[#1D6A4A] hover:shadow-md transition-all group cursor-pointer" onClick={() => setExpandedEventId(evt.id)}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${evt.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {evt.status}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1D6A4A] group-hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{evt.name}</h3>
                      <p className="text-sm text-gray-600 font-medium mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500"/> {evt.exam}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400"/> {evt.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </>
      )}

    </DashboardLayout>
  );
}
