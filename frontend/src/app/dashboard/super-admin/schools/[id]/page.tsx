"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Users, FileText, CreditCard, ArrowLeft, TrendingUp, Download, CheckCircle, Ban, Edit, MessageSquare, Key, Shield, AlertCircle, ChevronRight, Check, Search, Filter, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

export default function SchoolDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "overview");
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals / Drawers
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [modalState, setModalState] = useState<{ type: 'notification' | 'password' | 'plan' | 'suspend' | null }>({ type: null });

  const realId = parseInt((params.id as string).replace('SCH-', ''), 10);

  useEffect(() => {
    // Sync tab with URL
    const tab = searchParams?.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/super-admin/schools/${params.id}?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    const fetchSchool = async () => {
      if (!realId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('schools').select('*').eq('id', realId).single();
      if (data) {
        setSchool({
          ...data,
          status: data.status || 'Active',
          plan: data.plan || 'Starter',
          city: data.city || 'Mumbai',
          date: new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          code: `SCH-${String(data.id).padStart(4, '0')}`,
          adminName: 'Principal Admin',
          adminEmail: `admin@${data.name.toLowerCase().replace(/\s+/g, '')}.edu`,
          studentsCount: Math.floor(Math.random() * 500) + 100 // mock
        });
      }
      setLoading(false);
    };
    fetchSchool();
  }, [realId]);

  const toggleStatus = async () => {
    if (!school) return;
    const newStatus = school.status === 'Active' ? 'Suspended' : 'Active';
    await supabase.from('schools').update({ status: newStatus }).eq('id', school.id);
    setSchool({ ...school, status: newStatus });
    setModalState({ type: null });
  };

  if (loading) {
    return (
      <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div></div>
      </DashboardLayout>
    );
  }

  if (!school) {
    return (
      <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
        <div className="mb-6">
          <Link href="/dashboard/super-admin/schools" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#B45309] transition-colors w-max">
            <ArrowLeft className="w-4 h-4" /> Back to Schools
          </Link>
        </div>
        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
          <p className="text-gray-500">School not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <Link href="/dashboard/super-admin/schools" className="hover:text-[#B45309] transition-colors">Schools</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
        <span className="text-gray-900">{school.name}</span>
      </div>

      {/* Profile Card & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
          <button onClick={() => setIsEditDrawerOpen(true)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${school.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {school.status}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {school.plan} Plan
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{school.city} • Code: {school.code} • Active since {school.date}</p>
              
              <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Name</p>
                  <p className="text-sm font-medium text-gray-900">{school.adminName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Email</p>
                  <p className="text-sm font-medium text-gray-900">{school.adminEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Students Enrolled</p>
                  <p className="text-sm font-medium text-gray-900">{school.studentsCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => setModalState({ type: 'notification' })} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare className="w-4 h-4" /></div>
              Send Notification to School
            </button>
            <button onClick={() => setModalState({ type: 'password' })} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Key className="w-4 h-4" /></div>
              Reset Admin Password
            </button>
            <button onClick={() => setModalState({ type: 'plan' })} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Shield className="w-4 h-4" /></div>
              Change Plan
            </button>
            {school.status === 'Active' ? (
              <button onClick={() => setModalState({ type: 'suspend' })} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left">
                <div className="p-1.5 bg-white text-red-600 rounded-lg shadow-sm"><Ban className="w-4 h-4" /></div>
                Suspend School
              </button>
            ) : (
              <button onClick={toggleStatus} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
                <div className="p-1.5 bg-white text-green-600 rounded-lg shadow-sm"><CheckCircle className="w-4 h-4" /></div>
                Reactivate School
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "students", label: "Students", icon: Users },
          { id: "exams", label: "Exams & Results", icon: FileText },
          { id: "billing", label: "Billing", icon: CreditCard },
          { id: "communication", label: "Communication", icon: MessageCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { title: "Active Students", value: school.studentsCount.toString(), icon: Users },
                { title: "Exams Taken", value: "45", icon: FileText },
                { title: "Average Score", value: "82%", icon: TrendingUp },
                { title: "Participation Rate", value: "94%", icon: CheckCircle }, // students who attempted at least 1 exam / total enrolled
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white text-[#B45309] shadow-sm">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6">
               <h4 className="font-bold text-amber-900 mb-4">Regional Leaderboard Standing</h4>
               <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm w-max border border-amber-200">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold">#4</div>
                  <div>
                    <p className="font-bold text-gray-900">Ranked #4 in State Level</p>
                    <p className="text-sm text-gray-500">Top 5% of participating schools this month</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
              <div className="flex gap-3 flex-1">
                <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 shadow-sm" />
                </div>
                <select className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm outline-none shadow-sm cursor-pointer">
                  <option value="">All Classes</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>
            </div>
            
            {school.studentsCount > 0 ? (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white border-b border-gray-200">
                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                      <th className="px-6 py-0">Student Name</th>
                      <th className="px-6 py-0">Class</th>
                      <th className="px-6 py-0">Exams Taken</th>
                      <th className="px-6 py-0">Last Active</th>
                      <th className="px-6 py-0">Status</th>
                      <th className="px-6 py-0 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: "Aarav Sharma", grade: "Class 8", exams: 4, active: "2 hours ago", status: "Active" },
                      { name: "Priya Patel", grade: "Class 10", exams: 6, active: "1 day ago", status: "Active" },
                      { name: "Rohan Verma", grade: "Class 9", exams: 2, active: "1 week ago", status: "Inactive" },
                    ].map((s, i) => (
                      <tr key={i} className="h-[56px] hover:bg-gray-50 cursor-pointer" onClick={() => alert(`Showing details for ${s.name} (Read only)`)}>
                        <td className="px-6 py-0 text-sm font-bold text-gray-900">{s.name}</td>
                        <td className="px-6 py-0 text-sm text-gray-600">{s.grade}</td>
                        <td className="px-6 py-0 text-sm text-gray-600">{s.exams}</td>
                        <td className="px-6 py-0 text-sm text-gray-500">{s.active}</td>
                        <td className="px-6 py-0">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                        </td>
                        <td className="px-6 py-0 text-right">
                          <button className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors p-2" onClick={(e) => { e.stopPropagation(); alert(`Deactivated ${s.name}`); }}>
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">This school has not enrolled any students yet.</h3>
              </div>
            )}
          </div>
        )}

        {/* EXAMS TAB */}
        {activeTab === 'exams' && (
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                    <th className="px-6 py-0">Exam Name</th>
                    <th className="px-6 py-0">Date</th>
                    <th className="px-6 py-0">School Avg Score</th>
                    <th className="px-6 py-0">Rank vs All Schools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { title: "National Math Olympiad Qualifier", date: "Mar 15, 2024", avg: "86%", rank: "#4 of 142" },
                    { title: "Regional Science Contest", date: "Apr 02, 2024", avg: "74%", rank: "#12 of 142" },
                  ].map((e, i) => (
                    <tr key={i} className="h-[56px] hover:bg-amber-50 cursor-pointer transition-colors" onClick={() => alert(`Expanding detailed results table for ${e.title}`)}>
                      <td className="px-6 py-0 text-sm font-bold text-[#B45309]">{e.title}</td>
                      <td className="px-6 py-0 text-sm text-gray-500">{e.date}</td>
                      <td className="px-6 py-0 text-sm font-bold text-green-600">{e.avg}</td>
                      <td className="px-6 py-0 text-sm font-medium text-gray-700">{e.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Empty state simulation check */}
              {false && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">No exams have been taken by this school's students yet.</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="flex flex-col h-full min-h-[400px]">
            {/* Payment Failed Banner Mock */}
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold">Last payment on Apr 01, 2024 failed. Contact school admin.</span>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
                Send Payment Reminder
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                <p className="text-lg font-bold text-gray-900">{school.plan}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Billing Cycle</p>
                <p className="text-lg font-bold text-gray-900">Annual</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Last Payment</p>
                <p className="text-lg font-bold text-red-600">Failed (₹85,000)</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Next Payment</p>
                <p className="text-lg font-bold text-gray-900">Oct 24, 2024</p>
              </div>
            </div>

            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
              <button className="text-sm font-bold text-[#B45309] hover:underline">View All Invoices</button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-200">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                    <th className="px-6 py-0">Date</th>
                    <th className="px-6 py-0">Amount</th>
                    <th className="px-6 py-0">Status</th>
                    <th className="px-6 py-0 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: "Apr 01, 2024", amount: "₹85,000", status: "Failed" },
                    { date: "Oct 24, 2023", amount: "₹85,000", status: "Paid" },
                    { date: "Oct 24, 2022", amount: "₹80,000", status: "Paid" },
                  ].map((b, i) => (
                    <tr key={i} className="h-[56px] hover:bg-gray-50">
                      <td className="px-6 py-0 text-sm text-gray-900 font-medium">{b.date}</td>
                      <td className="px-6 py-0 text-sm font-bold text-gray-700">{b.amount}</td>
                      <td className="px-6 py-0">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${b.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status}</span>
                      </td>
                      <td className="px-6 py-0 text-right">
                        {b.status === 'Paid' && <button className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center gap-1 justify-end w-full"><Download className="w-4 h-4"/> Download</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMMUNICATION TAB */}
        {activeTab === 'communication' && (
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Communication Log</h3>
              <button onClick={() => setModalState({ type: 'notification' })} className="px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Send Custom Notification
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-[48px]">
                    <th className="px-6 py-0">Date</th>
                    <th className="px-6 py-0">Type</th>
                    <th className="px-6 py-0">Subject</th>
                    <th className="px-6 py-0">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: "Today, 10:30 AM", type: "Email", subject: "Payment Failed Reminder", status: "Delivered" },
                    { date: "Mar 10, 2024", type: "In-App", subject: "New Olympiad Schedule Published", status: "Read" },
                    { date: "Oct 24, 2023", type: "Email", subject: "Welcome to EduOlympia", status: "Delivered" },
                  ].map((log, i) => (
                    <tr key={i} className="h-[56px] hover:bg-gray-50">
                      <td className="px-6 py-0 text-sm text-gray-500">{log.date}</td>
                      <td className="px-6 py-0 text-sm font-medium text-gray-700">{log.type}</td>
                      <td className="px-6 py-0 text-sm font-bold text-gray-900">{log.subject}</td>
                      <td className="px-6 py-0">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${log.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals & Drawers */}

      {/* Edit Drawer */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isEditDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsEditDrawerOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isEditDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Edit School Profile</h2>
            <button onClick={() => setIsEditDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Editing details for {school.name}</p>
            {/* Form fields mocked */}
            <button onClick={() => { setIsEditDrawerOpen(false); alert('Profile updated'); }} className="w-full px-4 py-2.5 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors">Save Changes</button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {modalState.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-in-95 duration-200">
            
            {/* Notification Modal */}
            {modalState.type === 'notification' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Send Custom Notification</h2>
                <div className="space-y-4">
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm"><option>Email + In-App</option><option>Email Only</option><option>In-App Only</option></select>
                  <input type="text" placeholder="Subject" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm" />
                  <textarea rows={4} placeholder="Message body..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 outline-none text-sm"></textarea>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setModalState({ type: null })} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={() => { alert('Notification Sent'); setModalState({ type: null }); }} className="flex-1 px-4 py-2 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors">Send</button>
                  </div>
                </div>
              </div>
            )}

            {/* Suspend Modal */}
            {modalState.type === 'suspend' && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6" /></div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Suspend {school.name}?</h2>
                <p className="text-sm text-gray-500 mb-6">This will instantly revoke access for the school admin and all associated trainers and students.</p>
                <div className="flex gap-3">
                  <button onClick={() => setModalState({ type: null })} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={toggleStatus} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">Yes, Suspend</button>
                </div>
              </div>
            )}

            {/* Other Modals (Plan, Password) mocked similarly */}
            {(modalState.type === 'plan' || modalState.type === 'password') && (
              <div className="p-6 text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{modalState.type === 'plan' ? 'Change Plan' : 'Reset Password'}</h2>
                <p className="text-sm text-gray-500 mb-6">Mock implementation for {modalState.type}.</p>
                <button onClick={() => setModalState({ type: null })} className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}