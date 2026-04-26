"use client";

import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Menu,
  X,
  Building2,
  CheckCircle,
  Award,
  CreditCard,
  Settings,
  GraduationCap,
  AlertCircle
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badgeCount?: number;
}

export interface BannerProps {
  id: string;
  type: 'warning' | 'info';
  message: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "super_admin" | "school_admin" | "trainer" | "student";
  userName: string;
  userDescription: string;
  isTestActive?: boolean;
  banners?: BannerProps[];
  studentPendingPracticeCount?: number;
}

export default function DashboardLayout({ children, role, userName, userDescription, isTestActive = false, banners = [], studentPendingPracticeCount }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dismissedBannerIds, setDismissedBannerIds] = useState<Set<string>>(new Set());

  const visibleBanners = banners.filter(b => !dismissedBannerIds.has(b.id));

  const dismissBanner = (id: string) => {
    const newSet = new Set(dismissedBannerIds);
    newSet.add(id);
    setDismissedBannerIds(newSet);
  };

  const trainerMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/trainer", icon: LayoutDashboard },
    { name: "Study Material", href: "/dashboard/trainer/materials", icon: BookOpen },
    { name: "Question Bank", href: "/dashboard/trainer/questions", icon: ClipboardList },
    { name: "Practice Papers", href: "/dashboard/trainer/practice", icon: FileText },
    { name: "Live Classes", href: "/dashboard/trainer/classes", icon: Video },
    { name: "Students & Performance", href: "/dashboard/trainer/students", icon: Users },
    { name: "Exam Management", href: "/dashboard/trainer/exams", icon: Calendar },
    { name: "Analytics", href: "/dashboard/trainer/analytics", icon: BarChart },
    { name: "Doubt Queue", href: "/dashboard/trainer/doubts", icon: HelpCircle, badgeCount: 2 },
  ];

  const studentMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Study Material", href: "/dashboard/student/materials", icon: BookOpen },
    { name: "Practice Tests", href: "/dashboard/student/practice", icon: ClipboardList, badgeCount: studentPendingPracticeCount },
    { name: "Live Classes", href: "/dashboard/student/classes", icon: Video },
    { name: "Exams", href: "/dashboard/student/exams", icon: Calendar },
    { name: "Results", href: "/dashboard/student/results", icon: BarChart },
    { name: "Doubt Assistant", href: "/dashboard/student/doubts", icon: HelpCircle },
  ];

  const superAdminMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/super-admin", icon: LayoutDashboard },
    { name: "Schools", href: "/dashboard/super-admin/schools", icon: Building2 },
    { name: "Trainers", href: "/dashboard/super-admin/trainers", icon: Users },
    { name: "Content Approval", href: "/dashboard/super-admin/content-approval", icon: CheckCircle, badgeCount: 3 },
    { name: "Exam Approval", href: "/dashboard/super-admin/exam-approval", icon: Calendar, badgeCount: 1 },
    { name: "Results", href: "/dashboard/super-admin/results", icon: BarChart },
    { name: "Awards", href: "/dashboard/super-admin/awards", icon: Award },
    { name: "Analytics", href: "/dashboard/super-admin/analytics", icon: BarChart },
    { name: "Billing", href: "/dashboard/super-admin/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/super-admin/settings", icon: Settings },
  ];

  const schoolAdminMenu: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard/school-admin", icon: LayoutDashboard },
    { name: "Students", href: "/dashboard/school-admin/students", icon: GraduationCap },
    { name: "Exams", href: "/dashboard/school-admin/exams", icon: Calendar },
    { name: "Reports", href: "/dashboard/school-admin/reports", icon: BarChart },
    { name: "Certificates", href: "/dashboard/school-admin/certificates", icon: Award },
    { name: "Settings", href: "/dashboard/school-admin/settings", icon: Settings },
  ];

  const menu = role === "super_admin" ? superAdminMenu 
             : role === "school_admin" ? schoolAdminMenu 
             : role === "trainer" ? trainerMenu 
             : studentMenu;

  const getAccentColors = () => {
    switch (role) {
      case "super_admin":
        return {
          bgActive: "bg-[#B45309]",
          textActive: "text-white",
          textHover: "hover:text-[#B45309]",
          bgHoverLight: "hover:bg-amber-50",
          shadowActive: "shadow-md shadow-amber-600/20",
          textBrand: "text-[#B45309]",
          bgBrand: "bg-[#B45309]",
          bgBrandLight: "bg-amber-50"
        };
      case "school_admin":
        return {
          bgActive: "bg-[#1D6A4A]",
          textActive: "text-white",
          textHover: "hover:text-[#1D6A4A]",
          bgHoverLight: "hover:bg-green-50",
          shadowActive: "shadow-md shadow-green-700/20",
          textBrand: "text-[#1D6A4A]",
          bgBrand: "bg-[#1D6A4A]",
          bgBrandLight: "bg-green-50"
        };
      case "trainer":
        return {
          bgActive: "bg-[#5C3D99]",
          textActive: "text-white",
          textHover: "hover:text-[#5C3D99]",
          bgHoverLight: "hover:bg-purple-50",
          shadowActive: "shadow-md shadow-purple-900/20",
          textBrand: "text-[#5C3D99]",
          bgBrand: "bg-[#5C3D99]",
          bgBrandLight: "bg-purple-50"
        };
      case "student":
        return {
          bgActive: "bg-[#0D7377]",
          textActive: "text-white",
          textHover: "hover:text-[#0D7377]",
          bgHoverLight: "hover:bg-teal-50",
          shadowActive: "shadow-md shadow-teal-700/20",
          textBrand: "text-[#0D7377]",
          bgBrand: "bg-[#0D7377]",
          bgBrandLight: "bg-teal-50"
        };
      default:
        return {
          bgActive: "bg-[#B45309]",
          textActive: "text-white",
          textHover: "hover:text-[#B45309]",
          bgHoverLight: "hover:bg-amber-50",
          shadowActive: "shadow-md shadow-amber-600/20",
          textBrand: "text-[#B45309]",
          bgBrand: "bg-[#B45309]",
          bgBrandLight: "bg-amber-50"
        };
    }
  };

  const accent = getAccentColors();

  // Lockdown mode for active tests
  if (isTestActive) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] relative overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 md:w-20 xl:w-64 shrink-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Logo */}
        <div className="p-6 flex items-center justify-between md:justify-center xl:justify-between h-20">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${accent.bgBrand} flex items-center justify-center shrink-0`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${accent.textBrand} md:hidden xl:block`}>EduOlympia</span>
            </div>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Badge */}
          <div className="px-6 pb-4 md:hidden xl:block">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${role === 'super_admin' ? 'bg-gradient-to-tr from-amber-600 to-amber-400' : role === 'school_admin' ? 'bg-gradient-to-tr from-green-700 to-green-500' : role === 'trainer' ? 'bg-gradient-to-tr from-purple-800 to-purple-500' : 'bg-gradient-to-tr from-teal-700 to-teal-500'} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                <p className="text-[10px] text-gray-500 font-bold truncate uppercase tracking-wider">{role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

        <nav className="flex-1 px-3 xl:px-4 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 xl:px-4 py-3 rounded-xl transition-colors justify-center xl:justify-start ${
                  isActive
                    ? `${accent.bgActive} ${accent.textActive} ${accent.shadowActive}`
                    : `text-gray-600 hover:bg-gray-50 ${accent.textHover}`
                }`}
                title={item.name} // helpful tooltip on tablet
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium flex-1 md:hidden xl:block truncate">{item.name}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <>
                    <span className="md:hidden xl:inline-block bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ml-auto">
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </span>
                    <span className="hidden md:block xl:hidden absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </>
                )}
              </Link>
            );
          })}
          
          <div className="mt-8 mb-4 md:hidden xl:block">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Links
            </span>
            <div className="mt-2 space-y-1">
              {role === "super_admin" ? (
                 <>
                   <Link href="/dashboard/super-admin/schools" className={`flex items-center gap-3 px-4 py-2 text-gray-600 ${accent.textHover}`}>
                     <Building2 className="w-4 h-4" />
                     <span className="text-sm font-medium">Add School</span>
                   </Link>
                   <Link href="/dashboard/super-admin/analytics" className={`flex items-center gap-3 px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg`}>
                     <Sparkles className="w-4 h-4" />
                     <span className="text-sm">AI Insights</span>
                   </Link>
                 </>
              ) : role === "school_admin" ? (
                 <>
                   <Link href="/dashboard/school-admin/students" className={`flex items-center gap-3 px-4 py-2 text-gray-600 ${accent.textHover}`}>
                     <Users className="w-4 h-4" />
                     <span className="text-sm font-medium">Add Students</span>
                   </Link>
                   <Link href="/dashboard/school-admin/reports" className={`flex items-center gap-3 px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg`}>
                     <Sparkles className="w-4 h-4" />
                     <span className="text-sm">AI Report</span>
                   </Link>
                 </>
              ) : role === "trainer" ? (
                <>
                  <Link href="/dashboard/trainer/materials" className={`flex items-center gap-3 px-4 py-2 text-gray-600 ${accent.textHover}`}>
                    <UploadCloud className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Material</span>
                  </Link>
                  <Link href="/dashboard/trainer/questions" className={`flex items-center gap-3 px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg`}>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Generate Questions</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/student/practice" className={`flex items-center gap-3 px-4 py-2 text-gray-600 ${accent.textHover}`}>
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Take a Test</span>
                  </Link>
                  <Link href="/dashboard/student/doubts" className={`flex items-center gap-3 px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg`}>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Ask Doubt AI</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className={`p-3 m-3 xl:m-4 ${accent.bgBrandLight} rounded-xl flex justify-center xl:justify-start md:justify-center`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-white rounded-full ${accent.textBrand} shadow-sm shrink-0`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="md:hidden xl:block">
              <p className="text-sm font-semibold text-gray-900">Need Help?</p>
              <p className={`text-xs ${accent.textBrand} cursor-pointer hover:underline`}>Contact Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 xl:px-8 shrink-0">
          <div className="flex items-center gap-3 w-full">
            <button 
              className={`md:hidden p-2 -ml-2 text-gray-600 ${accent.textHover} transition-colors rounded-lg hover:bg-gray-50`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className={`w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-opacity-50`}
                style={{ 
                  '--tw-ring-color': role === 'super_admin' ? '#B45309' : role === 'school_admin' ? '#1D6A4A' : role === 'trainer' ? '#5C3D99' : '#0D7377',
                  '--tw-border-color': role === 'super_admin' ? '#B45309' : role === 'school_admin' ? '#1D6A4A' : role === 'trainer' ? '#5C3D99' : '#0D7377',
                } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className={`relative p-2 text-gray-400 ${accent.textHover} transition-colors`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div 
              className="relative flex items-center gap-2 sm:gap-3 pl-4 sm:pl-6 border-l border-gray-200 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${role === 'super_admin' ? 'bg-gradient-to-tr from-amber-600 to-amber-400' : role === 'school_admin' ? 'bg-gradient-to-tr from-green-700 to-green-500' : role === 'trainer' ? 'bg-gradient-to-tr from-purple-800 to-purple-500' : 'bg-gradient-to-tr from-teal-700 to-teal-500'} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
                {userName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left whitespace-nowrap">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userDescription}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 shrink-0 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
                  </div>
                  <Link 
                    href={role === 'super_admin' ? '/dashboard/super-admin/settings' : role === 'school_admin' ? '/dashboard/school-admin/settings' : `/dashboard/${role}/profile`} 
                    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${accent.textHover}`}
                  >
                    Profile Settings
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
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
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          
          {/* Global Banners */}
          {visibleBanners.length > 0 && (
            <div className="w-full flex flex-col">
              {visibleBanners.map(banner => (
                <div key={banner.id} className={`w-full px-4 sm:px-6 md:px-8 py-3 flex items-start sm:items-center justify-between gap-4 ${
                  banner.type === 'warning' ? 'bg-yellow-50 border-b border-yellow-200 text-yellow-800' : 'bg-blue-50 border-b border-blue-200 text-blue-800'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {banner.type === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0"/> : <Bell className="w-4 h-4 text-blue-600 shrink-0"/>}
                    {banner.message}
                  </div>
                  {banner.type === 'info' && (
                    <button onClick={() => dismissBanner(banner.id)} className="p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0">
                      <X className="w-4 h-4 opacity-70" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <main className="p-4 md:p-6 xl:p-8 flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

