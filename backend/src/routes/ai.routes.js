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

router.post('/scan-content', async (req, res) => {
  const { textContent, subject } = req.body;

  if (!textContent) {
    return res.status(400).json({ status: 'error', message: 'Content text is required for scanning.' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            flagged: { type: "boolean", description: "True if the content violates quality guidelines, is off-topic, or is inappropriate." },
            concern: { type: "string", description: "Detailed explanation of the concern. Null if not flagged." },
            readabilityScore: { type: "integer", description: "Estimated grade level for readability (e.g., 8)." }
          },
          required: ["flagged", "concern", "readabilityScore"]
        }
      }
    });

    const prompt = `
      You are an automated quality assurance AI for EduOlympia, an educational platform.
      Review the following extracted text from a trainer's uploaded study material.
      
      Checklist:
      1. Relevance to assigned subject: ${subject || 'General Educational Content'}
      2. Absence of inappropriate content
      3. Basic readability and structural coherence
      
      Content to scan:
      """
      ${textContent.substring(0, 5000)}
      """
    `;

    const result = await model.generateContent(prompt);
    const responseData = JSON.parse(result.response.text());

    res.json({
      status: 'success',
      analysis: responseData
    });

  } catch (error) {
    console.error('Error calling Gemini Content Scanner:', error);
    res.status(500).json({ status: 'error', message: 'Failed to scan content via AI.' });
  }
});

module.exports = router;
