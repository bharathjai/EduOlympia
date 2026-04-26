"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { 
  FileText, Video, Download, UploadCloud, Trash2, X, Plus, 
  ChevronRight, ChevronDown, Search, Edit3, BookOpen, PenTool, Sparkles, Check, Loader2, Link2, MoreVertical
} from "lucide-react";

import { supabase } from "@/utils/supabase";
import { useEffect } from "react";

type Material = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  hasSummary: boolean;
  generatingSummary: boolean;
};

export default function ContentManagerPage() {
  const [library, setLibrary] = useState<Record<string, any[]>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [activeChapter, setActiveChapter] = useState<{subj: string, chapId: string, chapName: string} | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          name,
          chapters (
            id,
            name,
            topics (
              study_materials (
                id,
                title,
                type,
                status
              )
            )
          )
        `);
      
      if (data) {
        const newLibrary: Record<string, any[]> = {};
        data.forEach((subject: any) => {
          newLibrary[subject.name] = (subject.chapters || []).map((chap: any) => {
            const materials: Material[] = [];
            (chap.topics || []).forEach((top: any) => {
              (top.study_materials || []).forEach((mat: any) => {
                materials.push({
                  id: mat.id.toString(),
                  title: mat.title,
                  type: mat.type || 'PDF',
                  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                  status: mat.status === 'draft' ? 'Draft' : 'Published',
                  hasSummary: false,
                  generatingSummary: false
                });
              });
            });
            return {
              id: chap.id.toString(),
              name: chap.name,
              materials
            };
          });
        });

        // Add sample data for demo if empty
        let hasAnyChapters = false;
        Object.values(newLibrary).forEach((chaps) => {
          if (chaps && chaps.length > 0) hasAnyChapters = true;
        });

        if (!hasAnyChapters) {
          newLibrary['Mathematics'] = [
            {
              id: 'demo-chap-1',
              name: 'Chapter 1: Number Systems',
              materials: [
                {
                  id: 'demo-mat-1',
                  title: 'Introduction to Number Systems',
                  type: 'Video',
                  date: 'Apr 24, 2026',
                  status: 'Published',
                  hasSummary: false,
                  generatingSummary: false
                },
                {
                  id: 'demo-mat-2',
                  title: 'Rational and Irrational Numbers Notes',
                  type: 'Notes',
                  date: 'Apr 25, 2026',
                  status: 'Published',
                  hasSummary: true,
                  generatingSummary: false
                },
                {
                  id: 'demo-mat-3',
                  title: 'Chapter 1 Practice Worksheet',
                  type: 'PDF',
                  date: 'Apr 26, 2026',
                  status: 'Draft',
                  hasSummary: false,
                  generatingSummary: false
                }
              ]
            },
            {
              id: 'demo-chap-2',
              name: 'Chapter 2: Polynomials',
              materials: []
            }
          ];
          newLibrary['Science'] = [
            {
              id: 'demo-chap-3',
              name: 'Chapter 1: Matter in our Surroundings',
              materials: []
            }
          ];
        }
        
        setLibrary(newLibrary);
        const subjects = Object.keys(newLibrary);
        if (subjects.length > 0) {
          setExpandedSubjects([subjects[0]]);
          if (newLibrary[subjects[0]].length > 0) {
            setActiveChapter({
              subj: subjects[0],
              chapId: newLibrary[subjects[0]][0].id,
              chapName: newLibrary[subjects[0]][0].name
            });
          }
        }
      }
    };
    
    fetchLibrary();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isWriteNotesOpen, setIsWriteNotesOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (subject: string, chapterId: string, materialId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    
    setLibrary(prev => {
      const newLib = { ...prev };
      const chaps = newLib[subject as keyof typeof newLib];
      const chap = chaps.find(c => c.id === chapterId);
      if (chap) {
        const mat = chap.materials.find((m: any) => m.id === materialId);
        if (mat) mat.status = newStatus;
      }
      return newLib;
    });

    showToast(`Material moved to ${newStatus}`);
  };

  const handleDelete = (subject: string, chapterId: string, materialId: string) => {
    if (!confirm("Are you sure you want to delete this content? This cannot be undone.")) return;
    
    setLibrary(prev => {
      const newLib = { ...prev };
      const chaps = newLib[subject as keyof typeof newLib];
      const chapIndex = chaps.findIndex((c: any) => c.id === chapterId);
      if (chapIndex > -1) {
        chaps[chapIndex].materials = chaps[chapIndex].materials.filter((m: any) => m.id !== materialId);
      }
      return newLib;
    });

    showToast("Material deleted successfully");
  };

  const handleGenerateSummary = (subject: string, chapterId: string, materialId: string) => {
    // Set loading state
    setLibrary(prev => {
      const newLib = { ...prev };
      const chap = newLib[subject as keyof typeof newLib].find((c: any) => c.id === chapterId);
      if (chap) {
        const mat = chap.materials.find((m: any) => m.id === materialId);
        if (mat) mat.generatingSummary = true;
      }
      return newLib;
    });

    // Simulate Gemini API call (5-10s)
    setTimeout(() => {
      setLibrary(prev => {
        const newLib = { ...prev };
        const chap = newLib[subject as keyof typeof newLib].find((c: any) => c.id === chapterId);
        if (chap) {
          const mat = chap.materials.find((m: any) => m.id === materialId);
          if (mat) {
            mat.generatingSummary = false;
            mat.hasSummary = true;
          }
        }
        return newLib;
      });
      showToast("AI Summary generated successfully! Students can now view it.");
    }, 4000);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    setTimeout(() => {
      setIsUploading(false);
      setIsUploadOpen(false);
      showToast("Content uploaded successfully and saved as Draft.");
    }, 2000);
  };

  const handleSimulateWriteNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsWriteNotesOpen(false);
      showToast("Notes saved successfully as Draft.");
    }, 1500);
  };

  // Get materials for current active chapter
  let currentMaterials: Material[] = [];
  if (activeChapter) {
    const subjData = library[activeChapter.subj as keyof typeof library];
    if (subjData) {
      const chapData = subjData.find(c => c.id === activeChapter.chapId);
      if (chapData) currentMaterials = chapData.materials;
    }
  }

  // Filter
  if (searchQuery) {
    currentMaterials = currentMaterials.filter((m: any) => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <DashboardLayout role="trainer" userName="Rahul Singh" userDescription="Trainer - Mathematics">
      <div className="flex h-[calc(100vh-80px)] overflow-hidden font-sans">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        )}

        {/* --- LEFT SIDEBAR: TREE VIEW --- */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">Curriculum</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your course tree</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(library).map(([subject, chapters]) => (
              <div key={subject} className="mb-2">
                <button 
                  onClick={() => toggleSubject(subject)}
                  className="flex items-center w-full gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  {expandedSubjects.includes(subject) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <span className="font-bold text-gray-900">{subject}</span>
                </button>
                
                {expandedSubjects.includes(subject) && (
                  <div className="pl-6 mt-1 space-y-1 relative before:absolute before:left-[19px] before:top-0 before:bottom-4 before:w-px before:bg-gray-200">
                    {chapters.map(chap => (
                      <button 
                        key={chap.id}
                        onClick={() => setActiveChapter({subj: subject, chapId: chap.id, chapName: chap.name})}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${activeChapter?.chapId === chap.id ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200"></div>
                        {chap.name}
                      </button>
                    ))}
                    <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center gap-1 mt-2 relative">
                       <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200"></div>
                       <Plus className="w-3 h-3" /> Add Chapter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-xl text-sm font-bold text-gray-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          
          {/* Header */}
          <div className="bg-white p-6 md:p-8 border-b border-gray-200 shrink-0">
            {activeChapter ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
                    {activeChapter.subj} <ChevronRight className="w-3 h-3" />
                  </div>
                  <h1 className="text-3xl font-black text-gray-900">{activeChapter.chapName}</h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search content..." 
                      className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all w-64"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setIsWriteNotesOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm"
                  >
                    <PenTool className="w-4 h-4" /> Write Notes
                  </button>
                  <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/20"
                  >
                    <UploadCloud className="w-4 h-4" /> Upload Content
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <h1 className="text-2xl font-black text-gray-900">Select a chapter to manage content</h1>
              </div>
            )}
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            {activeChapter && (
              currentMaterials.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 pl-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest w-[40%]">Content Title</th>
                        <th className="p-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Type</th>
                        <th className="p-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Upload Date</th>
                        <th className="p-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="p-4 pr-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentMaterials.map(mat => (
                        <tr key={mat.id} className={`hover:bg-gray-50 transition-colors group ${mat.status === 'Published' ? 'bg-emerald-50/20' : ''}`}>
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mat.type === 'PDF' ? 'bg-orange-100 text-orange-600' : mat.type === 'Video' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                {mat.type === 'PDF' ? <FileText className="w-5 h-5" /> : mat.type === 'Video' ? <Video className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                              </div>
                              <span className="font-bold text-gray-900">{mat.title}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${mat.type === 'PDF' ? 'bg-orange-50 border-orange-200 text-orange-700' : mat.type === 'Video' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                              {mat.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-500">{mat.date}</td>
                          <td className="p-4">
                            {/* Status Toggle Button */}
                            <button 
                              onClick={() => handleToggleStatus(activeChapter.subj, activeChapter.chapId, mat.id, mat.status)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${mat.status === 'Published' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mat.status === 'Published' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className={`ml-2 text-xs font-bold ${mat.status === 'Published' ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {mat.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              
                              {/* AI Summary Action */}
                              {mat.status === 'Published' && (mat.type === 'PDF' || mat.type === 'Notes') && (
                                <button 
                                  onClick={() => handleGenerateSummary(activeChapter.subj, activeChapter.chapId, mat.id)}
                                  disabled={mat.generatingSummary || mat.hasSummary}
                                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${mat.hasSummary ? 'bg-purple-100 text-purple-600 cursor-not-allowed' : mat.generatingSummary ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white border border-gray-200 text-purple-600 hover:bg-purple-50 hover:border-purple-200'}`}
                                  title={mat.hasSummary ? "Summary already generated" : "Generate AI Summary"}
                                >
                                  {mat.generatingSummary ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                </button>
                              )}

                              <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors" title="Edit Content">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => handleDelete(activeChapter.subj, activeChapter.chapId, mat.id)}
                                className="p-2 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-600 rounded-lg transition-colors" title="Delete Content"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {/* Always visible mobile menu button */}
                            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border border-gray-200 border-dashed">
                   <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                     <FileText className="w-10 h-10 text-purple-300" />
                   </div>
                   <h2 className="text-2xl font-black text-gray-900 mb-2">No content in this chapter yet</h2>
                   <p className="text-gray-500 font-medium max-w-sm mb-8">Start building your curriculum by uploading files or writing rich-text notes directly.</p>
                   <div className="flex gap-4">
                     <button onClick={() => setIsUploadOpen(true)} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md">Upload Content</button>
                     <button onClick={() => setIsWriteNotesOpen(true)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm">Write Notes</button>
                   </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* --- MODALS / DRAWERS --- */}

        {/* Upload Content Drawer Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
               <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <UploadCloud className="w-6 h-6 text-purple-600" /> Upload Content
                 </h3>
                 <button onClick={() => !isUploading && setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50" disabled={isUploading}>
                   <X className="w-6 h-6" />
                 </button>
               </div>
               
               <form onSubmit={handleSimulateUpload} className="p-8">
                 <div className="space-y-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content Title</label>
                     <input type="text" required placeholder="e.g. Physics Chapter 1 PDF" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all font-semibold text-gray-900 shadow-sm" disabled={isUploading} />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                       <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none font-semibold text-gray-900 shadow-sm" disabled={isUploading}>
                         <option>Mathematics</option>
                         <option>Science</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chapter</label>
                       <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none font-semibold text-gray-900 shadow-sm" disabled={isUploading}>
                         <option>Chapter 3: Algebra</option>
                         <option>Chapter 4: Geometry</option>
                       </select>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content Type</label>
                       <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none font-semibold text-gray-900 shadow-sm" disabled={isUploading}>
                         <option value="PDF">PDF Document</option>
                         <option value="Video">Video / MP4</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">File Attachment</label>
                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                       <UploadCloud className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                       <p className="text-sm font-bold text-gray-700">Click to browse or drag and drop</p>
                       <p className="text-xs text-gray-500 mt-1">PDF, MP4, PPT (Max 50MB)</p>
                       <input type="file" className="hidden" required />
                     </div>
                   </div>
                 </div>

                 <div className="mt-8">
                   <button type="submit" disabled={isUploading} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                     {isUploading ? (
                       <><Loader2 className="w-5 h-5 animate-spin" /> Uploading (45%)...</>
                     ) : (
                       "Upload to Drafts"
                     )}
                   </button>
                 </div>
               </form>
               
               {isUploading && (
                 <div className="absolute bottom-0 left-0 h-1.5 bg-gray-200 w-full">
                   <div className="h-full bg-purple-600 w-[45%] transition-all duration-1000"></div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Write Notes Drawer Modal */}
        {isWriteNotesOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
               <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 bg-gray-50 shrink-0">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <PenTool className="w-6 h-6 text-purple-600" /> Write Notes
                 </h3>
                 <div className="flex items-center gap-4">
                   <button type="button" onClick={handleSimulateWriteNotes} disabled={isUploading} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md flex items-center gap-2 text-sm">
                     {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Draft
                   </button>
                   <button onClick={() => !isUploading && setIsWriteNotesOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors" disabled={isUploading}>
                     <X className="w-6 h-6" />
                   </button>
                 </div>
               </div>
               
               <div className="p-6 border-b border-gray-100 shrink-0 flex gap-4">
                 <input type="text" placeholder="Note Title (e.g. Newton's Laws Summary)" className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white rounded-xl focus:ring-0 outline-none font-black text-2xl text-gray-900 transition-all placeholder:text-gray-300" />
               </div>

               {/* Mock Toolbar */}
               <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
                 <button className="p-2 font-serif font-bold text-gray-700 hover:bg-gray-100 rounded">B</button>
                 <button className="p-2 font-serif italic text-gray-700 hover:bg-gray-100 rounded">I</button>
                 <button className="p-2 font-serif underline text-gray-700 hover:bg-gray-100 rounded">U</button>
                 <div className="w-px h-6 bg-gray-200 mx-2"></div>
                 <button className="px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded">H1</button>
                 <button className="px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded">H2</button>
                 <div className="w-px h-6 bg-gray-200 mx-2"></div>
                 <button className="p-2 text-gray-700 hover:bg-gray-100 rounded"><Link2 className="w-4 h-4"/></button>
               </div>
               
               <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                 <div className="max-w-3xl mx-auto min-h-full bg-white p-12 shadow-sm rounded-xl border border-gray-200 outline-none" contentEditable suppressContentEditableWarning>
                   <p className="text-gray-400 font-medium">Start typing your notes here...</p>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
