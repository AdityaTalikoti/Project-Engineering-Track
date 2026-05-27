# ToneScorer

## What Problem This Solves (Required — Personal Statement)
I personally have this problem: I write cold emails to 10 recruiters every week and cannot tell if my tone sounds desperate. My AI feature solves it by scoring the email on confidence, clarity, and call-to-action strength.

## Live URL
Backend: https://tone-scorer-api.onrender.com
Frontend: https://tone-scorer-web.vercel.app

## Model Used and Why
Model: `openai/gpt-4o-mini`
Reason: Chosen for its high performance/cost ratio ($0.15/1M input, $0.60/1M output) and reliable output of structured JSON schemas for tone classification tasks.

## Where the API Call Lives
The AI API call is in [aiService.js](file:///c:/Project-Engineering-main/Milestone%2009/Ship%20Your%20AI%20Feature%20End-to-End/backend/src/services/aiService.js) in the `callAI()` function.
The prompt logic is in [promptBuilder.js](file:///c:/Project-Engineering-main/Milestone%2009/Ship%20Your%20AI%20Feature%20End-to-End/backend/src/utils/promptBuilder.js) in `buildPrompt()`.

## Rate Limit
20 requests per user per hour.
Reason: At $0.0000984/request, this limits a single user's maximum AI cost to $0.00197 per hour.

## Running Costs
See [COST_ESTIMATE.md](file:///c:/Project-Engineering-main/Milestone%2009/Ship%20Your%20AI%20Feature%20End-to-End/COST_ESTIMATE.md).
Short version: $1.48/month at 100 users × 5 calls/day.

## Setup
1. `cd backend && npm install`
2. `cp .env.example .env` — add `OPENROUTER_API_KEY` and `JWT_SECRET`
3. `npm start`
4. `cd frontend && npm install && npm run dev`
