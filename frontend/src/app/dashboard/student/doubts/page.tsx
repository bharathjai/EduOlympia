"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User, Sparkles, Loader2, BookOpen, Trash2, ArrowRight, CornerDownRight, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { supabase } from "@/utils/supabase";

// --- MOCKS ---
const contextOptions = [
  { id: 'math-ch2', subject: 'Mathematics', chapter: 'Chapter 2: Algebra & Equations' },
  { id: 'math-ch3', subject: 'Mathematics', chapter: 'Chapter 3: Geometry Basics' },
  { id: 'sci-ch1', subject: 'Science', chapter: 'Chapter 1: Matter in Our Surroundings' },
  { id: 'gen', subject: 'General', chapter: 'No specific chapter' }
];

const suggestedQuestionsByContext: Record<string, string[]> = {
  'math-ch2': ['What is a quadratic equation?', 'How do I isolate variables?', 'Give me an example of a linear equation.'],
  'math-ch3': ['What are the properties of a triangle?', 'Explain Pythagorean theorem.', 'How do I calculate area of a circle?'],
  'sci-ch1': ['What are the 3 states of matter?', 'Explain sublimation.', 'How does temperature affect particles?'],
  'gen': ['How can I improve my study routine?', 'What is the format of the Olympiad?', 'Help me plan a revision schedule.']
};

type Message = {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  source?: string;
  escalateStatus?: 'idle' | 'escalated';
};

export default function DoubtsPage() {
  return (
    <DashboardLayout role="student" userName="Arjun Sharma" userDescription="Class 8 • Delhi Public School">
      <Suspense fallback={<div className="flex h-[calc(100vh-120px)] items-center justify-center text-gray-500">Loading AI Assistant...</div>}>
        <DoubtsChat />
      </Suspense>
    </DashboardLayout>
  );
}

function DoubtsChat() {
  const searchParams = useSearchParams();
  const urlContext = searchParams.get('context'); // e.g. "Chapter 2: Algebra & Equations"
  const initialQuery = searchParams.get('subject'); // Backward compatibility if needed
  
  // Find matching context option based on URL, default to first math chapter
  const defaultContextId = contextOptions.find(c => c.chapter === urlContext || c.subject === initialQuery)?.id || 'math-ch2';

  const [activeContextId, setActiveContextId] = useState(defaultContextId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeContext = contextOptions.find(c => c.id === activeContextId);
  const suggestions = suggestedQuestionsByContext[activeContextId] || suggestedQuestionsByContext['gen'];

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'msg-0',
        role: 'ai',
        text: "Hi Arjun! Ask me anything about your subjects. I will answer based on your study material."
      }]);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  // Handle Typing Delay (500ms)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping) {
      timer = setTimeout(() => setShowTypingIndicator(true), 500);
    } else {
      setShowTypingIndicator(false);
    }
    return () => clearTimeout(timer);
  }, [isTyping]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Processing
    setTimeout(() => {
      let aiResponse: Message;

      // Mock Off-topic
      if (text.toLowerCase().includes('movie') || text.toLowerCase().includes('sports')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `I can only answer questions related to your enrolled subjects. Try asking about ${activeContext?.subject}.`
        };
      } 
      // Mock Cannot Answer
      else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('confused')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          text: "I am not sure about this from your current study material. I have flagged this for your trainer.",
        };
      }
      // Normal Response
      else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `Here is the explanation for your doubt regarding **${text}**.\n\nIn mathematics, solving this requires careful isolation of variables. Always remember the golden rule: whatever operation you perform on one side of the equation, you must perform exactly the same on the other side.`,
          source: `Based on ${activeContext?.chapter} notes`,
          escalateStatus: 'idle'
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Refocus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const escalateToTrainer = async (msgId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        return { ...msg, escalateStatus: 'escalated' };
      }
      return msg;
    }));
    
    // Find the message
    const msg = messages.find(m => m.id === msgId);
    // Find the user query that led to this
    const msgIndex = messages.findIndex(m => m.id === msgId);
    let question = "Unknown question";
    if (msgIndex > 0 && messages[msgIndex - 1].role === 'user') {
      question = messages[msgIndex - 1].text;
    }

    try {
      await supabase.from('doubts').insert({
        student_id: 1, // Mock student ID
        subject_id: null,
        chapter_id: null,
        question: question,
        ai_context: msg?.text || '',
        status: 'unanswered',
        is_flagged: false
      });
    } catch (e) {
      console.error(e);
    }
    
    // Add system notification
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        text: 'Your trainer has been notified and will reply to your doubt soon.'
      }]);
    }, 500);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'ai',
      text: "Chat cleared. What would you like to ask now?"
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 p-5 sm:p-6 border-b border-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-lg relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              AI Doubt Assistant
              <span className="bg-purple-500/40 text-purple-100 text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider border border-purple-400/30">Beta</span>
            </h1>
            <p className="text-sm text-purple-200 font-medium opacity-80">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          {/* Context Selector */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={activeContextId}
              onChange={(e) => setActiveContextId(e.target.value)}
              className="w-full sm:w-64 appearance-none bg-white/10 text-white text-sm font-bold border border-white/20 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm cursor-pointer"
            >
              {contextOptions.map(ctx => (
                <option key={ctx.id} value={ctx.id} className="text-gray-900">{ctx.subject} — {ctx.chapter}</option>
              ))}
            </select>
            <BookOpen className="w-4 h-4 text-purple-200 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          {/* Clear Chat */}
          <button 
            onClick={clearChat}
            className="p-2.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
            title="Clear conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Questions Area */}
      <div className="bg-purple-50/50 border-b border-purple-100 p-3 sm:p-4 shrink-0 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-xs font-bold text-purple-800 uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" /> Suggestions:
        </span>
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(suggestion)}
            disabled={isTyping}
            className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} ${msg.role === 'system' ? 'justify-center' : ''}`}>
            
            {/* System Message */}
            {msg.role === 'system' && (
               <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm my-2">
                 {msg.text.includes('notified') ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                 {msg.text}
               </div>
            )}

            {/* AI or User Avatar */}
            {msg.role !== 'system' && (
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200 text-purple-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
            )}

            {/* Message Bubble */}
            {msg.role !== 'system' && (
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                
                <div className={`rounded-3xl p-4 sm:p-5 shadow-sm text-sm sm:text-base ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                  {/* Markdown simulation */}
                  {msg.text.split('\n').map((line, i) => (
                    <p 
                      key={i} 
                      className={line.trim() === '' ? 'h-2' : 'mb-1 leading-relaxed'}
                      dangerouslySetInnerHTML={{ 
                        __html: line
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                          .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
                      }}
                    />
                  ))}
                </div>

                {/* AI Source & Escalation */}
                {msg.role === 'ai' && msg.source && (
                  <div className="mt-2 pl-2">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <BookOpen className="w-3 h-3" /> {msg.source}
                    </p>
                    
                    {msg.escalateStatus === 'idle' && (
                      <button 
                        onClick={() => escalateToTrainer(msg.id)}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors group"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        Still confused? Ask your trainer
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {showTypingIndicator && (
          <div className="flex gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl rounded-tl-sm p-4 sm:p-5 shadow-sm flex items-center gap-3 w-fit">
              <Loader2 className="w-5 h-5 text-purple-500 animate-spin" /> 
              <span className="text-sm font-bold text-gray-500">Generating response...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto relative flex gap-3 sm:gap-4 items-end">
          <textarea 
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your subject... (Shift+Enter for new line)" 
            className="flex-1 text-sm sm:text-base text-gray-900 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 bg-gray-50 transition-all resize-none shadow-inner custom-scrollbar"
            disabled={isTyping}
            rows={input.split('\\n').length > 1 ? Math.min(input.split('\\n').length, 5) : 1}
            style={{ minHeight: '56px', maxHeight: '150px' }}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 shrink-0 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:hover:bg-blue-600 disabled:shadow-none"
          >
            <Send className="w-6 h-6 ml-1" />
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-3 flex justify-between items-center text-[10px] sm:text-xs font-medium text-gray-400">
          <p>AI may display inaccurate info, so verify its answers.</p>
          <p className="hidden sm:block">Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 mx-0.5">Enter ↵</kbd> to send</p>
        </div>
      </div>
      
      {/* Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
    </div>
  );
}
