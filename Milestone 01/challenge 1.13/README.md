# CommitCraft

## The Problem
I built this because I personally had the problem of struggling to write professional, concise commit messages that actually describe the *why* of the change, not just the *what*. After a long day of coding, I often end up with lazy commit messages like "update files" or "fix bug," which makes the git history useless for my team and my future self. I waste 5-10 minutes per commit trying to recall every change and format it according to conventional commit standards. This is a common friction point for developers who want to maintain high-quality repositories but face mental fatigue during the final stage of the workflow.

## What It Does
CommitCraft takes a raw git diff or a bulleted list of changes as input and transforms it into a high-quality, conventional commit message (e.g., `feat(ui): add loading state to generator`). It uses AI to analyze the technical intent of the code changes, saving the user from manual documentation effort. The user gets a ready-to-use commit message that they can copy and paste directly into their terminal, ensuring a clean and professional project history with zero friction.

## AI Integration
**API:** OpenRouter
**Model:** openai/gpt-4o-mini
**Location:** `backend/server.js` → `generateCommitMessage()` function
**What the AI does:** The AI analyzes the provided git diff or description to identify the primary technical change and summarizes it into a single, concise conventional commit message.

## What I Intentionally Excluded
1. **User Accounts:** I chose not to build an authentication system because the tool is intended for quick, transient use during the `git commit` process; adding auth would create unnecessary friction.
2. **Historical Persistence:** I excluded a database for storing past commit messages because the core value is the immediate generation of the current message, and persistence doesn't address the primary problem of "writing the message in the moment."
3. **Commit History Visualization:** Visualizing the git tree was excluded to keep the UI focused and clean, as existing tools like GitHub and VS Code already handle visualization well.

## Monthly Cost Calculation
Model: openai/gpt-4o-mini
Input: $0.15 per 1M tokens
Output: $0.60 per 1M tokens
Avg tokens per call: ~600 input + ~40 output
Cost per call: (600/1,000,000 * $0.15) + (40/1,000,000 * $0.60) = $0.000090 + $0.000024 = $0.000114
Expected calls/month: 400
**Monthly total: 400 × $0.000114 = $0.0456**

## Live Deployment
**Frontend:** https://commitcraft.netlify.app
**Backend:** https://commitcraft-backend.onrender.com
