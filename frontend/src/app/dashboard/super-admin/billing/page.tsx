"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { CreditCard, Search, Download, FileText, Activity, MoreVertical, CheckCircle, AlertTriangle, Send, ShieldAlert, ArrowUpCircle, ExternalLink, Plus, X, Clock, IndianRupee } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";

export default function SubscriptionBilling() {
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Trial" | "Overdue" | "Cancelled">("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Data state
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  
  // Modals
  const [upgradeModal, setUpgradeModal] = useState<any | null>(null);
  const [invoiceDrawer, setInvoiceDrawer] = useState<any | null>(null);
  const [reminderModal, setReminderModal] = useState<any | null>(null);
  const [manualPaymentModal, setManualPaymentModal] = useState<any | null>(null);
  const [cancelModal, setCancelModal] = useState<any | null>(null);

  useEffect(() => {
    // Mocking robust subscription data
    setTimeout(() => {
      setSubscriptions([
        { id: 'sub_1', school: "Greenfield Academy", plan: "Elite", cycle: "Annual", amount: 120000, lastPayment: "Jan 12, 2023", nextPayment: "Jan 12, 2024", status: "Active" },
        { id: 'sub_2', school: "Riverside High", plan: "Growth", cycle: "Monthly", amount: 5000, lastPayment: "Sep 01, 2023", nextPayment: "Oct 01, 2023", status: "Active" },
        { id: 'sub_3', school: "Eastside Tech", plan: "Starter", cycle: "Monthly", amount: 2000, lastPayment: "Aug 15, 2023", nextPayment: "Sep 15, 2023", status: "Overdue" },
        { id: 'sub_4', school: "Pinnacle International", plan: "Elite", cycle: "Annual", amount: 120000, lastPayment: "-", nextPayment: "Oct 10, 2023", status: "Trial", trialEndsIn: 14 },
        { id: 'sub_5', school: "Springfield Elementary", plan: "Growth", cycle: "Monthly", amount: 5000, lastPayment: "May 01, 2023", nextPayment: "-", status: "Cancelled" },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredSubs = useMemo(() => {
    let filtered = subscriptions;
    if (activeTab !== "All") {
      filtered = filtered.filter(s => s.status === activeTab);
    }
    if (search.trim()) {
      filtered = filtered.filter(s => s.school.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered.sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime());
  }, [subscriptions, activeTab, search]);

  const overdueCount = subscriptions.filter(s => s.status === "Overdue").length;

  const handleAction = (action: string, sub: any) => {
    if (action === 'upgrade') setUpgradeModal(sub);
    else if (action === 'invoices') setInvoiceDrawer(sub);
    else if (action === 'reminder') setReminderModal({ ...sub, message: `Dear ${sub.school} Admin,\n\nThis is a reminder that your payment of ₹${sub.amount.toLocaleString()} is due on ${sub.nextPayment}. Please process it to avoid service interruption.\n\nThanks,\nEduOlympia Team` });
    else if (action === 'manual') setManualPaymentModal({ ...sub, date: new Date().toISOString().split('T')[0], method: "Bank Transfer", ref: "" });
    else if (action === 'cancel') setCancelModal(sub);
  };

  const handleConfirmAction = (modalType: string) => {
    if (modalType === 'upgrade') {
      alert(`Plan successfully upgraded for ${upgradeModal.school}.`);
      setUpgradeModal(null);
    } else if (modalType === 'reminder') {
      alert(`Payment reminder sent to ${reminderModal.school} and logged in communications.`);
      setReminderModal(null);
    } else if (modalType === 'manual') {
      alert(`Manual payment of ₹${manualPaymentModal.amount} recorded successfully.`);
      setSubscriptions(subscriptions.map(s => s.id === manualPaymentModal.id ? { ...s, status: "Active" } : s));
      setManualPaymentModal(null);
    } else if (modalType === 'cancel') {
      alert(`Subscription cancelled for ${cancelModal.school}. Access ends at billing period.`);
      setSubscriptions(subscriptions.map(s => s.id === cancelModal.id ? { ...s, status: "Cancelled", nextPayment: "-" } : s));
      setCancelModal(null);
    }
  };

  return (
    <DashboardLayout role="super_admin" userName="System Admin" userDescription="Super Admin">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage school subscriptions, handle invoices, and monitor revenue streams.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><IndianRupee className="w-16 h-16"/></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">MRR</p>
          <p className="text-3xl font-black text-gray-900">₹62,000</p>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><ArrowUpCircle className="w-3 h-3"/> +12% vs last month</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><CreditCard className="w-16 h-16"/></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ARR</p>
          <p className="text-3xl font-black text-gray-900">₹7.4M</p>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><ArrowUpCircle className="w-3 h-3"/> +8% vs last year</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Subscriptions</p>
          <p className="text-3xl font-black text-gray-900">142</p>
          <p className="text-xs text-gray-500 mt-2">Across all tiers</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100 bg-red-50/30">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Overdue Payments</p>
          <p className="text-3xl font-black text-red-600">{overdueCount}</p>
          <p className="text-xs text-red-500 mt-2 font-medium">Requires immediate action</p>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tabs & Search */}
        <div className="border-b border-gray-100 flex flex-col md:flex-row justify-between items-end bg-gray-50/50">
          <div className="flex px-4 pt-4 overflow-x-auto w-full md:w-auto">
            {["All", "Active", "Trial", "Overdue", "Cancelled"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-[#B45309] text-[#B45309]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
                {tab === 'Overdue' && overdueCount > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px]">{overdueCount}</span>}
              </button>
            ))}
          </div>
          <div className="p-3 w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search school..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B45309]" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">School & Plan</th>
                <th className="px-6 py-4">Amount & Cycle</th>
                <th className="px-6 py-4">Billing Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 font-medium animate-pulse">Loading subscriptions...</td></tr>
              ) : filteredSubs.length > 0 ? (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className={`hover:bg-gray-50 transition-colors ${sub.status === 'Overdue' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{sub.school}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">{sub.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">₹{sub.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">{sub.cycle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500"/> Last: {sub.lastPayment}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1"><Clock className="w-3 h-3 text-amber-500"/> Next: <b className="text-gray-800">{sub.nextPayment}</b></p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : sub.status === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' : sub.status === 'Trial' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {sub.status}
                      </span>
                      {sub.status === 'Trial' && <p className="text-[10px] text-amber-700 mt-1">Ends in {sub.trialEndsIn} days</p>}
                      {sub.status === 'Overdue' && <p className="text-[10px] text-red-600 mt-1">Payment Failed</p>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleAction('invoices', sub)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Invoices"><FileText className="w-4 h-4"/></button>
                        
                        <div className="relative group">
                          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4"/></button>
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                            <button onClick={() => handleAction('upgrade', sub)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50">Change Plan</button>
                            {(sub.status === 'Overdue' || sub.status === 'Active') && (
                              <button onClick={() => handleAction('manual', sub)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50">Record Manual Payment</button>
                            )}
                            {(sub.status === 'Overdue' || sub.status === 'Trial') && (
                              <button onClick={() => handleAction('reminder', sub)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 border-b border-gray-50">Send Reminder</button>
                            )}
                            {sub.status !== 'Cancelled' && (
                              <button onClick={() => handleAction('cancel', sub)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50">Cancel Subscription</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 font-medium">No subscriptions found matching criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Upgrade Modal */}
      {upgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Change Plan</h2>
              <button onClick={() => setUpgradeModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Current Plan: <span className="font-bold text-gray-900">{upgradeModal.plan} ({upgradeModal.cycle})</span></p>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select New Plan</label>
                <select className="w-full p-3 border rounded-xl outline-none focus:border-[#B45309]">
                  <option value="Starter">Starter - ₹2,000/mo</option>
                  <option value="Growth">Growth - ₹5,000/mo</option>
                  <option value="Elite">Elite - ₹120,000/yr</option>
                </select>
              </div>
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start border border-blue-100">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Proration Notice:</strong> The school will be automatically charged/credited the prorated difference for the remaining billing period.</p>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setUpgradeModal(null)} className="px-4 py-2 bg-white border rounded-lg text-sm font-bold text-gray-700">Cancel</button>
              <button onClick={() => handleConfirmAction('upgrade')} className="px-4 py-2 bg-[#B45309] text-white rounded-lg text-sm font-bold hover:bg-amber-700">Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Drawer */}
      {invoiceDrawer && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setInvoiceDrawer(null)}></div>
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Invoices</h2>
              <button onClick={() => setInvoiceDrawer(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="font-bold text-gray-900 text-lg">{invoiceDrawer.school}</p>
              <p className="text-sm text-gray-500">Plan: {invoiceDrawer.plan}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">INV-2023-00{i}</h4>
                    <p className="text-xs text-gray-500">Issued: Aug {i*10}, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">₹{invoiceDrawer.amount.toLocaleString()}</p>
                    <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 ml-auto mt-1"><Download className="w-3 h-3"/> PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {reminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 flex flex-col">
            <div className="p-6 border-b bg-amber-50 rounded-t-2xl flex justify-between items-center">
              <h2 className="font-bold text-amber-900 flex items-center gap-2"><Send className="w-5 h-5"/> Send Payment Reminder</h2>
              <button onClick={() => setReminderModal(null)} className="text-amber-500 hover:text-amber-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To</label>
                <input type="text" disabled value={`admin@${reminderModal.school.toLowerCase().replace(' ', '')}.edu`} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                <textarea rows={6} value={reminderModal.message} onChange={e => setReminderModal({...reminderModal, message: e.target.value})} className="w-full p-3 border rounded-lg text-sm outline-none focus:border-[#B45309]"></textarea>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setReminderModal(null)} className="px-4 py-2 border rounded-lg font-bold text-sm">Cancel</button>
              <button onClick={() => handleConfirmAction('reminder')} className="px-4 py-2 bg-[#B45309] text-white rounded-lg font-bold text-sm flex items-center gap-2">Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Record Manual Payment Modal */}
      {manualPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95">
            <div className="p-6 border-b bg-gray-50 rounded-t-2xl flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Record Manual Payment</h2>
              <button onClick={() => setManualPaymentModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Amount Received (₹)</label>
                <input type="number" value={manualPaymentModal.amount} className="w-full p-2.5 border rounded-lg text-sm outline-none" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Payment Date</label>
                  <input type="date" value={manualPaymentModal.date} onChange={e => setManualPaymentModal({...manualPaymentModal, date: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Method</label>
                  <select value={manualPaymentModal.method} onChange={e => setManualPaymentModal({...manualPaymentModal, method: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm outline-none bg-white">
                    <option>Bank Transfer</option>
                    <option>Check</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reference Number</label>
                <input type="text" placeholder="e.g. UTR / Check No." value={manualPaymentModal.ref} onChange={e => setManualPaymentModal({...manualPaymentModal, ref: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#B45309]" />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setManualPaymentModal(null)} className="px-4 py-2 border rounded-lg font-bold text-sm">Cancel</button>
              <button onClick={() => handleConfirmAction('manual')} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold text-sm">Record Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 overflow-hidden">
            <div className="p-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
              <h2 className="font-bold text-red-900 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Cancel Subscription</h2>
              <button onClick={() => setCancelModal(null)} className="text-red-400 hover:text-red-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              <p className="text-gray-800 font-medium mb-2">Are you sure you want to cancel the subscription for <strong>{cancelModal.school}</strong>?</p>
              <p className="text-sm text-gray-500 mb-4">This action will stop future billing. The school will retain platform access until the end of their current billing cycle.</p>
              <input type="text" placeholder="Reason for cancellation (optional)" className="w-full p-3 border border-red-100 bg-red-50/30 rounded-lg text-sm outline-none focus:border-red-500" />
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setCancelModal(null)} className="flex-1 py-2.5 border rounded-xl font-bold text-sm text-gray-700">Go Back</button>
              <button onClick={() => handleConfirmAction('cancel')} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}