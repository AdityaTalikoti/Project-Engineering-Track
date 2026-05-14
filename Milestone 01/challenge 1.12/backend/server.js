const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Initialize dotenv at the top
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check route to verify server status
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

/**
 * AI Chat Route
 * This is where the magic happens.
 */
app.post('/chat', async (req, res) => {
  try {
    // 1. Extract messages from request body
    const { messages } = req.body;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages array is required',
      });
    }

    // 2. Read API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY is missing in environment variables',
      });
    }

    // 3. Send request to OpenRouter API
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: messages,
        }),
      }
    );

    // Parse API response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to fetch AI response',
      });
    }

    // 4. Extract AI reply
    const reply =
      data.choices?.[0]?.message?.content || 'No response from AI';

    // Send reply back to frontend
    res.json({ reply });

  } catch (error) {
    console.error('Chat route error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
