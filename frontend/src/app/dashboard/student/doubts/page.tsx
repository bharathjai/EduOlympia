"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User, Sparkles, Loader2 } from "lucide-react";

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function DoubtsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    } else if (messages.length === 0) {
      setMessages([{
        role: 'ai',
        text: "Hi there! I'm EduOlympia AI. I can help you with Math, Science, and Logical Reasoning concepts. What would you like to learn today?"
      }]);
    }
  }, [initialQuery]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text };
    
    // Create the updated history to send to API
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      // Send to our backend AI route
      const response = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          history: messages // Send previous history (excluding current user message, backend expects previous history)
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessages([...newHistory, { role: 'ai', text: data.answer }]);
      } else {
        setMessages([...newHistory, { role: 'ai', text: "Sorry, I ran into an error processing that. Could you try asking again?" }]);
      }
    } catch (error) {
      setMessages([...newHistory, { role: 'ai', text: "Network error: Unable to reach the AI assistant. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardLayout role="student" userName="Aarav Sharma" userDescription="Class 8 • Delhi Public School">
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-purple-50/50 p-6 border-b border-purple-100 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              EduOlympia AI Tutor
              <span className="bg-purple-200 text-purple-700 text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Beta</span>
            </h1>
            <p className="text-sm text-gray-500">Ask any doubt, get instant explanations</p>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={"flex gap-4 " + (msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={"w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + (msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600')}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={"max-w-[80%] rounded-2xl p-4 shadow-sm " + (msg.role === 'user' ? 'bg-brand text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm prose prose-sm')}>
                {/* Basic Markdown rendering simulation (split by newlines) */}
                {msg.text.split('\n').map((line, i) => (
                  <p 
                    key={i} 
                    className={line.trim() === '' ? 'h-2' : 'mb-1'}
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>').replace(/\$(.*?)\$/g, '<span class="font-mono text-brand bg-purple-50 px-1 rounded">$1</span>') }}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> EduOlympia AI is thinking...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-3 max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me to explain a concept or solve a problem..." 
              className="flex-1 text-base text-gray-900 px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50/50 transition-all pr-16"
              disabled={isTyping}
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:hover:bg-purple-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-wider">
            AI can make mistakes. Verify important answers.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
