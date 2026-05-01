# Challenge 1.12 — Build and Deploy Your First AI Chatbot

## What This Is

This is a full-stack AI chatbot application built using:
- HTML, CSS, JavaScript
- Node.js and Express.js
- OpenRouter API

The chatbot maintains conversation context by sending the full message history to the AI model on every request.

---

## What Exists

| File | Status | What it does |
|---|---|---|
| backend/server.js | ✅ Completed | Express backend with working `/chat` route |
| frontend/index.html | ✅ Ready | Chat UI with input, button, and chat display |
| frontend/script.js | ✅ Completed | Handles fetch calls and conversation context |
| frontend/style.css | ✅ Ready | Dark themed chatbot UI |
| backend/.env.example | ✅ Ready | Environment variable template |

---

# Question 1 — API and Model

This project uses the OpenRouter API with the `openai/gpt-3.5-turbo` model.

The backend sends the full conversation history to the OpenRouter Chat Completions API and returns the assistant response to the frontend.

---

# Question 2 — Why the API Call Happens in the Backend

The API request is made from the backend instead of the frontend to protect the API key from being publicly exposed.

If the API key were stored in frontend JavaScript, any user could inspect the browser source code or network requests, steal the key, and misuse it to make unauthorized API requests or consume API credits.

Keeping the API key in backend environment variables prevents direct access from users.

---

# Question 3 — Fallback Provider

If OpenRouter runs out of credits, I would switch to Google's Gemini API.

Two things would change in the code:

1. The API endpoint URL would change from the OpenRouter endpoint to the Gemini API endpoint.

2. The request structure, authentication method, and model name would change to match Gemini’s API format.

Example:
- Current model:
  `openai/gpt-3.5-turbo`

- Gemini fallback model:
  `gemini-1.5-flash`

---

## Features

- AI chatbot interface
- Persistent conversation context
- Backend-secured API requests
- Full-stack architecture
- Enter key support
- Error handling
- Dark mode UI

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

Open `frontend/index.html` using:
- VS Code Live Server
- or directly in your browser

---

## Environment Variables

Create a `.env` file inside the `backend/` folder.

Example:

```env
OPENROUTER_API_KEY=your_api_key_here
```

---

## The Architecture

```text
User
  ↓
Frontend (index.html + script.js)
  ↓
Backend Express Server (/chat)
  ↓
OpenRouter API
```

The frontend never directly communicates with the AI provider.

---

## Deployment

### Backend
Deployed using Render.

Build Command:
```bash
cd backend && npm install
```

Start Command:
```bash
cd backend && npm start
```

### Frontend
Deployed using Netlify.

---

## Live Deployment

**Frontend URL:** https://your-frontend-url.netlify.app

**Backend URL:** https://your-backend-url.onrender.com

---

## Getting Your API Keys

### OpenRouter (Primary)
- Visit: https://openrouter.ai
- Create an account
- Generate an API key

### Gemini (Fallback)
- Visit: https://aistudio.google.com
- Generate a Gemini API key

---

## Project Structure

```text
backend/
 ├── server.js
 ├── package.json
 └── .env

frontend/
 ├── index.html
 ├── style.css
 └── script.js
```

---

## What to Submit

1. GitHub PR link  
   Branch name: `feature/ai-chatbot`

2. Google Drive video link  
   Make sure "Anyone with the link can view" is enabled.