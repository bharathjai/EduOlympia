"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Video, 
  Users, 
  Calendar, 
  BarChart, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  Clock, 
  HelpCircle,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "super_admin" | "school_admin" | "trainer" | "student";
  userName: string;
  userDescription: string;
}

export default function DashboardLayout({ children, role, userName, userDescription }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const trainerMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/trainer", icon: LayoutDashboard },
    { name: "Study Material", href: "/dashboard/trainer/materials", icon: BookOpen },
    { name: "Question Bank", href: "/dashboard/trainer/questions", icon: ClipboardList },
    { name: "Practice Papers", href: "/dashboard/trainer/practice", icon: FileText },
    { name: "Live Classes", href: "/dashboard/trainer/classes", icon: Video },
    { name: "Students & Performance", href: "/dashboard/trainer/students", icon: Users },
    { name: "Exam Management", href: "/dashboard/trainer/exams", icon: Calendar },
    { name: "Analytics", href: "/dashboard/trainer/analytics", icon: BarChart },
  ];

  const studentMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Study Material", href: "/dashboard/student/materials", icon: BookOpen },
    { name: "Practice Tests", href: "/dashboard/student/practice", icon: ClipboardList },
    { name: "Live Classes", href: "/dashboard/student/classes", icon: Video },
    { name: "Exams", href: "/dashboard/student/exams", icon: Calendar },
    { name: "Results", href: "/dashboard/student/results", icon: BarChart },
    { name: "Doubt Assistant", href: "/dashboard/student/doubts", icon: HelpCircle },
  ];

  const menu = role === "trainer" ? trainerMenu : studentMenu; // Defaulting to these two for MVP demo

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-brand">EduOlympia</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <div className="mt-8 mb-4">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Links
            </span>
            <div className="mt-2 space-y-1">
              <Link href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-brand">
                <UploadCloud className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Material</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 text-brand font-medium hover:bg-brand-light rounded-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Generate Questions</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 m-4 bg-brand-light rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-full text-brand shadow-sm">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Need Help?</p>
              <p className="text-xs text-brand cursor-pointer hover:underline">Contact Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students, content, tests..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-brand transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div 
              className="relative flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userDescription}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
                  </div>
                  <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand">
                    Profile Settings
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // In a real app, clear localStorage/cookies here
                      window.location.href = '/login';
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
