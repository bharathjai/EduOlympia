const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', async (req, res) => {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ status: 'error', message: 'Question is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format history for Gemini API
    let formattedHistory = [];
    
    // Always start with system instruction
    const systemPrompt = "You are EduOlympia AI, a helpful, encouraging, and knowledgeable AI tutor for students preparing for Olympiads (Math, Science, Logical Reasoning). Give clear, concise, and educational answers. Break down complex concepts.";
    formattedHistory.push({ role: 'user', parts: [{ text: "System prompt: " + systemPrompt }] });
    formattedHistory.push({ role: 'model', parts: [{ text: "Understood. I am EduOlympia AI and will act as a helpful tutor." }] });

    if (history && history.length > 0) {
      // Filter out the initial greeting if it's the first message without a user prompt
      const filteredHistory = history[0].role === 'ai' ? history.slice(1) : history;
      
      const mapped = filteredHistory.map(msg => ({
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

    res.json({
      status: 'success',
      answer: text
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get answer from AI' });
  }
});

module.exports = router;
