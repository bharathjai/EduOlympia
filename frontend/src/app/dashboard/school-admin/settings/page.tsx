"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle2, AlertCircle, UploadCloud, CreditCard, Download, ShieldCheck, KeyRound, Bell, AlertTriangle, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function SchoolSettings() {
  const [showToast, setShowToast] = useState("");
  
  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  // Danger Zone
  const [transferEmail, setTransferEmail] = useState("");

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("School profile updated successfully.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) return;
    triggerToast("Password updated successfully.");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferEmail) return;
    triggerToast("Transfer request submitted. Platform admin will review and confirm.");
    setTransferEmail("");
  };

  // Mock Invoice Data
  const invoices = [
    { id: "INV-2023-11", date: "Nov 01, 2023", amount: "₹24,999", status: "Paid" },
    { id: "INV-2023-10", date: "Oct 01, 2023", amount: "₹24,999", status: "Paid" },
    { id: "INV-2023-09", date: "Sep 01, 2023", amount: "₹24,999", status: "Failed" },
  ];

  return (
    <DashboardLayout role="school_admin" userName="Springfield High" userDescription="School Admin">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl font-bold z-50 flex items-center gap-2 animate-in slide-in-from-right duration-300 bg-[#1D6A4A] text-white">
          <CheckCircle2 className="w-5 h-5 text-green-300" />
          {showToast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings & Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage school profile, active subscriptions, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* School Profile */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#1D6A4A]"/> School Profile</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6">
              
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#1D6A4A] hover:text-[#1D6A4A] cursor-pointer transition-colors shrink-0">
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Logo</span>
                </div>
                <div className="flex-1 text-sm text-gray-500">
                  <p className="font-bold text-gray-700 mb-1">System Uneditable Fields</p>
                  <ul className="space-y-1">
                    <li>School Code: <strong className="text-gray-900">SPR-4920</strong></li>
                    <li>Plan Type: <strong className="text-gray-900">Growth Tier</strong></li>
                    <li>Admin Email: <strong className="text-gray-900">admin@springfield.edu</strong></li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><HelpCircle className="w-3 h-3"/> Contact Super Admin to change these.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">School Name</label>
                  <input type="text" defaultValue="Springfield High" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input type="text" defaultValue="(555) 123-4567" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input type="text" defaultValue="Springfield" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                  <input type="text" defaultValue="IL" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between">School Website <span className="text-gray-400 font-normal">Optional</span></label>
                  <input type="text" defaultValue="https://springfield.edu" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#1D6A4A] text-white rounded-xl font-bold shadow-md hover:bg-green-800 transition-colors">
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Subscription & Billing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#1D6A4A]"/> Subscription & Billing</h2>
            </div>
            
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-gray-900">Growth Tier</h3>
                    <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </div>
                  <p className="text-sm text-gray-500">Billed ₹24,999 Monthly. Next payment on <strong className="text-gray-700">Dec 01, 2023</strong>.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-600 shrink-0">
                  <p className="font-bold mb-1">Need a different plan?</p>
                  <a href="#" className="text-[#1D6A4A] hover:underline font-bold">Contact support to upgrade or change.</a>
                </div>
              </div>
            </div>

            <div className="p-0">
              <h3 className="font-bold text-gray-900 px-6 py-4 border-b border-gray-100">Invoice History</h3>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{inv.date}</td>
                      <td className="px-6 py-4 text-gray-600">{inv.amount}</td>
                      <td className="px-6 py-4">
                        {inv.status === 'Paid' ? (
                          <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs border border-green-200">Paid</span>
                        ) : (
                          <span className="text-red-700 bg-red-50 px-2 py-1 rounded text-xs border border-red-200">Failed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {inv.status === 'Paid' ? (
                          <button onClick={() => triggerToast(`Downloading invoice ${inv.id}...`)} className="text-[#1D6A4A] hover:text-green-800 font-bold inline-flex items-center gap-1.5 transition-colors">
                            <Download className="w-4 h-4"/> PDF
                          </button>
                        ) : (
                          <a href="#" className="text-gray-500 hover:text-gray-900 underline text-xs">Contact support</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-500"/> Admin Security</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                <input type="password" required value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <input type="password" required minLength={8} value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A]" />
                <p className="text-[10px] text-gray-400 mt-1">Min 8 chars, 1 uppercase, 1 number.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${confirmPass && newPass !== confirmPass ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:ring-green-700/20 focus:border-[#1D6A4A]'}`} />
                {confirmPass && newPass !== confirmPass && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">Passwords do not match.</p>
                )}
              </div>
              <button disabled={!currentPass || !newPass || newPass !== confirmPass} type="submit" className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                Update Password
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500"/> Notification Preferences</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                "Email me when results are published.",
                "Email me when new exam is scheduled.",
                "Email me for student enrollment confirmations."
              ].map((label, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-start pt-0.5">
                    <input type="checkbox" defaultChecked onChange={() => triggerToast("Preference saved.")} className="w-4 h-4 rounded border-gray-300 text-[#1D6A4A] focus:ring-[#1D6A4A] cursor-pointer" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-red-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h2>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Transfer Admin Access</h3>
              <p className="text-xs text-gray-500 mb-4">Transferring ownership will instantly notify the platform Super Admin for manual approval. You will retain access until approved.</p>
              <form onSubmit={handleTransfer}>
                <input 
                  type="email" 
                  required
                  placeholder="New Admin Email" 
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
                />
                <button type="submit" disabled={!transferEmail} className="w-full py-2 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                  Request Transfer
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}
