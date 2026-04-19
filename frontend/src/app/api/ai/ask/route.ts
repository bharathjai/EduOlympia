import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK inside the route handler or outside.
// We must ensure process.env.GEMINI_API_KEY is available in Vercel.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { question, history } = await req.json();

    if (!question) {
      return NextResponse.json({ status: 'error', message: 'Question is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ status: 'error', message: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format history for Gemini API
    let formattedHistory: any[] = [];
    
    // Always start with system instruction
    const systemPrompt = "You are EduOlympia AI, a helpful, encouraging, and knowledgeable AI tutor for students preparing for Olympiads (Math, Science, Logical Reasoning). Give clear, concise, and educational answers. Break down complex concepts.";
    formattedHistory.push({ role: 'user', parts: [{ text: "System prompt: " + systemPrompt }] });
    formattedHistory.push({ role: 'model', parts: [{ text: "Understood. I am EduOlympia AI and will act as a helpful tutor." }] });

    if (history && history.length > 0) {
      // Filter out the initial greeting if it's the first message without a user prompt
      const filteredHistory = history[0].role === 'ai' ? history.slice(1) : history;
      
      const mapped = filteredHistory.map((msg: any) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      formattedHistory = formattedHistory.concat(mapped);
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      status: 'success',
      answer: text
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to get answer from AI' }, { status: 500 });
  }
}
