"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Users, UserCircle, Send, Hand, MonitorUp, Play } from "lucide-react";
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
  const [isTrainerOnline, setIsTrainerOnline] = useState(false);

  // Real-time media states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [trainerStream, setTrainerStream] = useState<MediaStream | null>(null);
  const [studentId] = useState(() => `student-${Math.random().toString(36).substring(2, 9)}`);

  // References for WebRTC
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const trainerVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  
  // Voice Equalizer Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Chat state
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{sender: string, text: string, time: string}[]>([
    { sender: "System", text: "Welcome to the live class. The trainer has muted all microphones.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
    { sender: "Rahul Singh (Trainer)", text: "Good morning everyone! We will start in 2 minutes.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  // Fetch live class details
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

  // Initialize Media Stream & Signaling
  useEffect(() => {
    // Open BroadcastChannel for signalling
    const channel = new BroadcastChannel(`live-class-${params.id}`);
    channelRef.current = channel;

    // Send Join request to trainer immediately
    channel.postMessage({
      type: "student-join",
      studentId,
      studentName: "Aarav Sharma"
    });

    channel.onmessage = async (event) => {
      const data = event.data;
      if (!data) return;

      switch (data.type) {
        case "trainer-online":
          setIsTrainerOnline(true);
          break;

        case "offer":
          if (data.targetStudentId === studentId) {
            handleOffer(data.offer);
          }
          break;

        case "trainer-candidate":
          if (data.targetStudentId === studentId && peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
              console.error("Error adding trainer candidate:", e);
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

        case "class-ended":
          alert("The host has ended this live class.");
          router.push('/dashboard/student/classes');
          break;
      }
    };

    // Periodically re-send join request if trainer is not online yet
    const joinInterval = setInterval(() => {
      if (!isTrainerOnline && channelRef.current) {
        channelRef.current.postMessage({
          type: "student-join",
          studentId,
          studentName: "Aarav Sharma"
        });
      }
    }, 3000);

    return () => {
      clearInterval(joinInterval);
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "student-leave",
          studentId
        });
        channelRef.current.close();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      stopVoiceVisualizer();
    };
  }, [params.id, isTrainerOnline, studentId]);

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    peerConnectionRef.current = pc;

    // Add local tracks if they exist
    const localStream = localStreamRef.current;
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.postMessage({
          type: "student-candidate",
          candidate: event.candidate.toJSON(),
          studentId
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setTrainerStream(remoteStream);
      if (trainerVideoRef.current) {
        trainerVideoRef.current.srcObject = remoteStream;
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setTrainerStream(null);
        setIsTrainerOnline(false);
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "answer",
        answer,
        studentId
      });
    }
  };

  // Lazy initialize local webcam and audio
  const requestLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      
      setLocalStream(stream);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to active PC if connection exists
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }

      return stream;
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
      return null;
    }
  };

  // Toggle local mute track
  const toggleMute = async () => {
    let stream = localStream;
    if (!stream) {
      stream = await requestLocalMedia();
    }
    
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted; // enable if it was muted
        setIsMuted(!audioTrack.enabled);
        if (audioTrack.enabled) {
          startVoiceVisualizer(stream);
        } else {
          stopVoiceVisualizer();
        }
      }
    }
  };

  // Toggle local camera track
  const toggleVideo = async () => {
    let stream = localStream;
    if (!stream) {
      stream = await requestLocalMedia();
    }

    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff; // enable if it was off
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Raise hand and send signal to trainer
  const toggleHandRaised = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "hand-raise",
        studentId,
        studentName: "Aarav Sharma",
        isRaised: nextState
      });
    }
  };

  // Setup visual equalizer using Web Audio API
  const startVoiceVisualizer = (stream: MediaStream) => {
    if (!canvasRef.current) return;
    
    stopVoiceVisualizer();

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;
    source.connect(analyser);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2.5;
        // Bouncing blue-teal colors
        ctx.fillStyle = `rgb(13, ${Math.min(255, 115 + barHeight * 2)}, ${Math.min(255, 119 + barHeight * 3)})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    draw();
  };

  const stopVoiceVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    
    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChat(prev => [...prev, {
      sender: "Aarav Sharma",
      text: message,
      time
    }]);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "chat-message",
        sender: "Aarav Sharma",
        text: message
      });
    }

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
          {isTrainerOnline ? (
            <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 tracking-wide uppercase">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live
            </div>
          ) : (
            <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 tracking-wide uppercase">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              Connecting
            </div>
          )}
          <div className="h-6 w-px bg-gray-700"></div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">{cls?.title}</h1>
            <p className="text-gray-400 text-xs">{cls?.subject} • {cls?.class}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            {isTrainerOnline ? 'Rahul Singh + 124 others' : 'Waiting for Trainer...'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Stage */}
        <main className="flex-1 p-4 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden relative bg-gray-900 border border-gray-800 shadow-2xl flex items-center justify-center group">
            
            {/* Trainer's Screen Feed (P2P WebRTC Stream) */}
            {isTrainerOnline && trainerStream ? (
              <video 
                ref={trainerVideoRef}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-950 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 animate-pulse">
                  <MonitorUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Waiting for Trainer</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">The WebRTC room will load automatically as soon as the Trainer starts the broadcast.</p>
              </div>
            )}
            
            {/* Overlay Name */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {isTrainerOnline ? "Trainer Presentation Feed" : "Classroom Stage"}
            </div>

            {/* Small Self Picture-in-Picture Box */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden shadow-2xl flex items-center justify-center">
              {!isVideoOff && localStream ? (
                <video 
                  ref={localVideoRef} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  playsInline 
                  muted 
                />
              ) : (
                <UserCircle className="w-12 h-12 text-gray-500" />
              )}
              
              {/* Dynamic Equalizer Canvas overlaid on webcam */}
              {!isMuted && (
                <canvas 
                  ref={canvasRef} 
                  width={192} 
                  height={30} 
                  className="absolute bottom-6 left-0 right-0 h-6 px-3 pointer-events-none"
                />
              )}
              
              <div className="absolute bottom-1 left-1 bg-black/60 text-[10px] text-white px-1.5 py-0.5 rounded font-bold">
                Aarav Sharma (You)
              </div>
            </div>
          </div>
          
          {/* Controls Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
            <button onClick={toggleMute} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title={isMuted ? "Unmute Mic" : "Mute Mic"}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button onClick={toggleVideo} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}>
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
            </button>
            <div className="w-px h-10 bg-gray-700 mx-2"></div>
            <button onClick={toggleHandRaised} className={`p-4 rounded-xl flex items-center justify-center transition-all ${isHandRaised ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title={isHandRaised ? "Lower Hand" : "Raise Hand"}>
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
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Class Chat
            </h2>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chat.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-semibold ${msg.sender.includes('Trainer') ? 'text-purple-400' : msg.sender === 'System' ? 'text-gray-500' : 'text-gray-300'}`}>{msg.sender}</span>
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
