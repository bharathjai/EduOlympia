"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PhoneOff, MessageSquare, Users, Settings, UserCircle, Send, Hand } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function TrainerLiveClassPage() {
  const params = useParams();
  const router = useRouter();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Real-time media states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<{ id: string; name: string; stream: MediaStream | null; handRaised: boolean }[]>([]);
  const [handRaiseNotice, setHandRaiseNotice] = useState<string | null>(null);

  // References for WebRTC
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ [studentId: string]: RTCPeerConnection }>({});
  const channelRef = useRef<BroadcastChannel | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  // Chat state
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{sender: string, text: string, time: string}[]>([
    { sender: "System", text: "Welcome to the live class chat. You are the host.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  // Fetch live class info
  useEffect(() => {
    const fetchClassDetails = async () => {
      const { data, error } = await supabase.from('live_classes').select('*').eq('id', params.id).single();
      let classData = { title: "Live Algebra Session", subject: "Mathematics", class: "Class 8" };
      if (data && !error) {
        classData = { title: data.title, subject: data.subject, class: data.class_grade };
      }
      setCls(classData);
      setLoading(false);
      
      // Update status to 'live' in Supabase database
      try {
        await supabase.from('live_classes').update({ status: 'live' }).eq('id', params.id);
      } catch (dbErr) {
        console.error("Error updating live class status to live in Supabase:", dbErr);
      }
      
      // Update localStorage that this class is active
      try {
        const activeClasses = JSON.parse(localStorage.getItem('eduolympia_live_classes') || '{}');
        activeClasses[params.id as string] = {
          startedAt: Date.now(),
          title: classData.title,
          subject: classData.subject + " • Rahul Singh"
        };
        localStorage.setItem('eduolympia_live_classes', JSON.stringify(activeClasses));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(e);
      }
    };
    fetchClassDetails();
  }, [params.id]);

  // Clean up active live class status on unmount
  useEffect(() => {
    return () => {
      try {
        const activeClasses = JSON.parse(localStorage.getItem('eduolympia_live_classes') || '{}');
        delete activeClasses[params.id as string];
        localStorage.setItem('eduolympia_live_classes', JSON.stringify(activeClasses));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(e);
      }
    };
  }, [params.id]);

  // Request media permissions and setup BroadcastChannel
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
        if (active) {
          setLocalStream(stream);
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing user media:", err);
      }
    }

    initMedia();

    // Signalling Channel setup
    const channel = new BroadcastChannel(`live-class-${params.id}`);
    channelRef.current = channel;

    channel.onmessage = async (event) => {
      const data = event.data;
      if (!data) return;

      switch (data.type) {
        case "student-join":
          // Create WebRTC peer connection for this new student
          handleNewStudent(data.studentId, data.studentName);
          break;

        case "student-leave":
          if (peerConnectionsRef.current[data.studentId]) {
            peerConnectionsRef.current[data.studentId].close();
            delete peerConnectionsRef.current[data.studentId];
          }
          setParticipants(prev => prev.filter(p => p.id !== data.studentId));
          break;

        case "answer":
          if (peerConnectionsRef.current[data.studentId]) {
            await peerConnectionsRef.current[data.studentId].setRemoteDescription(new RTCSessionDescription(data.answer));
          }
          break;

        case "student-candidate":
          if (peerConnectionsRef.current[data.studentId]) {
            try {
              await peerConnectionsRef.current[data.studentId].addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
              console.error("Error adding student ICE candidate:", e);
            }
          }
          break;

        case "chat-message":
          setChat(prev => [...prev, {
            sender: data.sender,
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          break;

        case "hand-raise":
          setParticipants(prev => prev.map(p => {
            if (p.id === data.studentId) {
              return { ...p, handRaised: data.isRaised };
            }
            return p;
          }));
          if (data.isRaised) {
            setHandRaiseNotice(`${data.studentName} raised their hand!`);
            setTimeout(() => setHandRaiseNotice(null), 4000);
          }
          break;
      }
    };

    // Broadcast periodic ping to let students know trainer is online
    const pingInterval = setInterval(() => {
      if (channelRef.current && localStreamRef.current) {
        channelRef.current.postMessage({
          type: "trainer-online",
          trainerStreamId: localStreamRef.current.id
        });
      }
    }, 2000);

    return () => {
      active = false;
      clearInterval(pingInterval);
      if (channelRef.current) {
        channelRef.current.close();
      }
      // Stop all tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      // Close peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    };
  }, [params.id]);

  const handleNewStudent = async (studentId: string, studentName: string) => {
    // Add student to participants list immediately on join signal
    setParticipants(prev => {
      const exists = prev.find(p => p.id === studentId);
      if (exists) return prev;
      return [...prev, { id: studentId, name: studentName, stream: null, handRaised: false }];
    });

    if (peerConnectionsRef.current[studentId]) {
      peerConnectionsRef.current[studentId].close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnectionsRef.current[studentId] = pc;

    // Add local stream tracks to PC
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    }

    // Set up candidate gathering
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.postMessage({
          type: "trainer-candidate",
          candidate: event.candidate.toJSON(),
          targetStudentId: studentId
        });
      }
    };

    // Track state (student webcam stream)
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setParticipants(prev => {
        return prev.map(p => (p.id === studentId ? { ...p, stream: remoteStream } : p));
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "closed" || pc.connectionState === "failed") {
        setParticipants(prev => prev.filter(p => p.id !== studentId));
        delete peerConnectionsRef.current[studentId];
      }
    };

    // Create SDP Offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "offer",
        offer: offer,
        targetStudentId: studentId,
        trainerStreamId: stream?.id
      });
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Camera toggle
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Screen Sharing
  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      // Stop Screen Share and restore camera
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      
      const cameraTrack = localStream?.getVideoTracks()[0];
      if (cameraTrack) {
        Object.values(peerConnectionsRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(cameraTrack);
          }
        });
      }
      setIsScreenSharing(false);
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    } else {
      // Start Screen Share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        Object.values(peerConnectionsRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          toggleScreenSharing(); // restore camera when screen share ends in browser bar
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChat(prev => [...prev, {
      sender: "Rahul Singh (Trainer)",
      text: message,
      time
    }]);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "chat-message",
        sender: "Rahul Singh (Trainer)",
        text: message
      });
    }

    setMessage("");
  };

  const handleEndClass = async () => {
    if (confirm("Are you sure you want to end this live class for all students?")) {
      // Update status to 'completed' in Supabase database
      try {
        await supabase.from('live_classes').update({ status: 'completed' }).eq('id', params.id);
      } catch (dbErr) {
        console.error("Error updating live class status to completed in Supabase:", dbErr);
      }

      if (channelRef.current) {
        channelRef.current.postMessage({ type: "class-ended" });
      }
      router.push('/dashboard/trainer/classes');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-bold">Connecting...</div>;

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden font-sans">
      
      {/* Hand Raise Overlay Notice */}
      {handRaiseNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <Hand className="w-5 h-5 animate-pulse" />
          <span>{handRaiseNotice}</span>
        </div>
      )}

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
            <Users className="w-4 h-4 text-purple-400" />
            {participants.length} Active Student{participants.length === 1 ? '' : 's'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Stage */}
        <main className="flex-1 p-4 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden relative bg-gray-900 border border-gray-800 shadow-2xl flex items-center justify-center group">
            
            {/* Real Webcam feed or avatar placeholder */}
            <video 
              ref={localVideoRef} 
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              autoPlay 
              playsInline 
              muted 
            />

            {isVideoOff && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center shadow-xl border border-gray-700">
                  <UserCircle className="w-20 h-20 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">Your camera is off</p>
              </div>
            )}
            
            {/* Overlay Name */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
              Rahul Singh (Host)
              {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
            </div>

            {/* Students Grid (Mini Remote Feeds) */}
            <div className="absolute top-4 right-4 flex gap-2">
              {participants.map(p => (
                <div key={p.id} className={`w-36 h-28 bg-gray-800 rounded-xl border-2 ${p.handRaised ? 'border-amber-500 animate-pulse' : 'border-gray-700'} flex items-center justify-center overflow-hidden relative shadow-lg`}>
                  {p.stream ? (
                    <video 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      playsInline 
                      ref={(el) => {
                        if (el && p.stream) el.srcObject = p.stream;
                      }}
                    />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-500 opacity-60" />
                  )}
                  {p.handRaised && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white p-1 rounded-full text-xs shadow-md">
                      ✋
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 text-[9px] text-white bg-black/60 px-1.5 py-0.5 rounded font-bold truncate max-w-[80%]">{p.name}</div>
                </div>
              ))}
              {participants.length === 0 && (
                <div className="px-4 py-2.5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 text-gray-400 text-xs font-semibold">
                  Waiting for students to join...
                </div>
              )}
            </div>
          </div>
          
          {/* Controls Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
            <button onClick={toggleMute} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button onClick={toggleVideo} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
            </button>
            <button onClick={toggleScreenSharing} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isScreenSharing ? 'bg-purple-600/30 text-purple-400 hover:bg-purple-600/40 border border-purple-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}>
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
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Class Chat
            </h2>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chat.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-semibold ${msg.sender.includes('Trainer') ? 'text-purple-400' : 'text-gray-300'}`}>{msg.sender}</span>
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
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-500"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 disabled:opacity-50 transition-colors"
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
