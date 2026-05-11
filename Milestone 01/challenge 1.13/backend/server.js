const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

/**
 * AI Commit Message Generation Logic
 */
async function generateCommitMessage(req, res) {
  const { diff } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
  }

  if (!diff) {
    return res.status(400).json({ error: "Diff or description is required." });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://commitcraft.local',
        'X-Title': 'CommitCraft'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior software engineer who specializes in writing perfect Conventional Commits. Analyze the provided git diff or description and suggest exactly one concise, high-quality commit message. Format it as "type(scope): description".'
          },
          {
            role: 'user',
            content: `Generate a commit message for these changes:\n\n${diff}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("AI API Error:", data.error);
      return res.status(502).json({ error: "AI Service Error" });
    }

    const commitMessage = data.choices[0].message.content.trim();
    res.json({ commit: commitMessage });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

app.post('/generate-commit', generateCommitMessage);


app.listen(PORT, () => {
  console.log(`CommitCraft backend running on port ${PORT}`);
});
