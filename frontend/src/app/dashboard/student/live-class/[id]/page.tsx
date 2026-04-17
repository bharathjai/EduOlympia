"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Users, UserCircle, Send, Hand, MonitorUp } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function StudentLiveClassPage() {
  const params = useParams();
  const router = useRouter();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Controls state
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  // Chat state
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{sender: string, text: string, time: string}[]>([
    { sender: "System", text: "Welcome to the live class. The trainer has muted all microphones.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
    { sender: "Rahul Singh (Trainer)", text: "Good morning everyone! We will start in 2 minutes.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      const { data, error } = await supabase.from('live_classes').select('*').eq('id', params.id).single();
      if (data && !error) {
        setCls({ title: data.title, subject: data.subject, class: data.class_grade });
      } else {
        setCls({ title: "Live Session", subject: "General", class: "All" });
      }
      setLoading(false);
    };
    fetchClassDetails();
  }, [params.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChat([...chat, {
      sender: "Aarav Sharma",
      text: message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    setMessage("");
  };

  const handleLeaveClass = () => {
    if (confirm("Are you sure you want to leave the class?")) {
      router.push('/dashboard/student/classes');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-bold">Joining Class...</div>;

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden font-sans">
      
      {/* Top Header */}
      <header className="h-16 px-6 bg-gray-900 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 tracking-wide uppercase">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Live
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">{cls?.title}</h1>
            <p className="text-gray-400 text-xs">{cls?.subject} • {cls?.class}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-light" />
            125 Students
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Stage */}
        <main className="flex-1 p-4 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden relative bg-gray-900 border border-gray-800 shadow-2xl flex items-center justify-center group">
            
            {/* Trainer's Screen Feed (Simulated) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-950 flex flex-col items-center justify-center">
              <div className="text-center">
                <MonitorUp className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 font-medium text-lg">Rahul Singh is sharing their screen</p>
                <p className="text-gray-500 text-sm mt-2">Waiting for presentation to start...</p>
              </div>
            </div>
            
            {/* Overlay Name */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              Rahul Singh's Screen
            </div>

            {/* Small Picture-in-Picture for Trainer's Face */}
            <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden shadow-2xl flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-gray-500" />
              <div className="absolute bottom-1 left-1 bg-black/60 text-[10px] text-white px-1.5 py-0.5 rounded">Trainer</div>
            </div>
          </div>
          
          {/* Controls Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
            <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
            </button>
            <div className="w-px h-10 bg-gray-700 mx-2"></div>
            <button onClick={() => setIsHandRaised(!isHandRaised)} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isHandRaised ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title="Raise Hand">
              <Hand className="w-6 h-6" />
            </button>
            <div className="w-px h-10 bg-gray-700 mx-2"></div>
            <button onClick={handleLeaveClass} className="px-6 py-4 rounded-xl flex items-center justify-center transition-all bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-900/20">
              <PhoneOff className="w-5 h-5" />
              Leave
            </button>
          </div>
        </main>

        {/* Right Sidebar (Chat) */}
        <aside className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
          <div className="h-14 border-b border-gray-800 flex items-center px-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-light" />
              Class Chat
            </h2>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chat.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-semibold ${msg.sender.includes('Trainer') ? 'text-brand-light' : msg.sender === 'System' ? 'text-gray-500' : 'text-gray-300'}`}>{msg.sender}</span>
                  <span className="text-[10px] text-gray-600">{msg.time}</span>
                </div>
                <div className={`text-sm p-3 rounded-xl rounded-tl-none inline-block ${msg.sender === 'System' ? 'bg-gray-800/50 text-gray-400 italic text-xs' : 'bg-gray-800 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light transition-all placeholder-gray-500"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-brand-light disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
