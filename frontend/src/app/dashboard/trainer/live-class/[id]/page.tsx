"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PhoneOff, MessageSquare, Users, Settings, UserCircle, Send } from "lucide-react";
import Link from "next/link";

export default function TrainerLiveClassPage() {
  const params = useParams();
  const router = useRouter();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Chat state
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{sender: string, text: string, time: string}[]>([
    { sender: "System", text: "Welcome to the live class chat.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  useEffect(() => {
    // Fetch class details
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`)
      .then(res => res.json())
      .then(data => {
        const found = data.data.find((c: any) => c.id === parseInt(params.id as string));
        setCls(found || { title: "Live Session", subject: "General", class: "All" });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChat([...chat, {
      sender: "Rahul Singh (Trainer)",
      text: message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    setMessage("");
  };

  const handleEndClass = () => {
    if (confirm("Are you sure you want to end this live class for all students?")) {
      // In a real app, send API call to update status to 'completed'
      router.push('/dashboard/trainer/classes');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-bold">Connecting...</div>;

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
            124 Students
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Stage */}
        <main className="flex-1 p-4 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden relative bg-gray-900 border border-gray-800 shadow-2xl flex items-center justify-center group">
            
            {/* Simulated Video Feed Placeholder */}
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">Your camera is off</p>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-brand-dark/20 flex flex-col items-center justify-center">
                 <div className="w-32 h-32 bg-gray-800/80 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-700 shadow-xl">
                  <UserCircle className="w-20 h-20 text-gray-400" />
                </div>
                <p className="text-gray-500 mt-4 text-sm font-medium bg-gray-900/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-800">Simulated Webcam Feed</p>
              </div>
            )}
            
            {/* Overlay Name */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
              Rahul Singh (Host)
              {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
            </div>

            {/* Simulated Students Grid (Mini) */}
            <div className="absolute top-4 right-4 flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-32 h-24 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500 overflow-hidden relative shadow-lg">
                  <UserCircle className="w-10 h-10 opacity-50" />
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white bg-black/60 px-1.5 rounded">Student {i}</div>
                </div>
              ))}
              <div className="w-32 h-24 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 text-xs font-semibold shadow-lg">
                + 121 more
              </div>
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
            <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isScreenSharing ? 'bg-brand/20 text-brand-light hover:bg-brand/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              <MonitorUp className="w-6 h-6" />
            </button>
            <div className="w-px h-10 bg-gray-700 mx-2"></div>
            <button onClick={handleEndClass} className="px-6 py-4 rounded-xl flex items-center justify-center transition-all bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-900/20">
              <PhoneOff className="w-5 h-5" />
              End Class
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
                  <span className={`text-xs font-semibold ${msg.sender.includes('Trainer') ? 'text-brand-light' : 'text-gray-300'}`}>{msg.sender}</span>
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
