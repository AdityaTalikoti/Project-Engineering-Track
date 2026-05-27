# JobScan AI — Production Guardrails

## Phase 1: Failures Observed

### Failure 1 — Unlimited Input Length
Observed: When sending a 5000-character input, the request succeeded with a 200 OK status code, indicating that the AI service was still executed despite the input exceeding standard limits.
AI service called: YES — token log appeared in terminal: `[AI_USAGE] {"timestamp":"2026-05-27T06:33:27.965Z","userId":"user-123","model":"openai/gpt-4o-mini","promptTokens":793,"completionTokens":59,"totalTokens":852,"endpoint":"analyze_job_description"}`

### Failure 2 — Indefinite Hang
Observed: When simulating a slow LLM response with a 60-second delay, the server held the connection open indefinitely, forcing the client to abort/time out after 10.01 seconds.
Duration: 60 seconds (artificial delay) before the server would have eventually completed or timed out at network level.

### Failure 3 — Server Crash on LLM Error
Observed: When using an invalid OpenRouter API key, the server process crashed completely with: `TypeError: Cannot read properties of undefined (reading '0') at analyzeJobDescription (file:///C:/Project-Engineering-main/Milestone%2009/Build%20the%20Guardrails/src/services/aiService.js:59:31)`.
Server state after crash: DEAD — connection refused when attempting to hit `/health` endpoint.

---

## Guardrail 1 — Input Length Validation

**What was added:** An empty check (`!text || text.trim().length === 0`) returning a `400` with `{ error: 'input_required', message: 'Job description text is required.' }`, and a length guard check (`text.length > 3000`) returning a `400` status with `{ error: 'input_too_long', limit: 3000, received: text.length }`.

**What it protects against:** Excessive API token consumption and high operational costs from processing unnecessarily large inputs, as well as server slowdowns.

**Production incident it prevents:** A single user pasting a multi-megabyte log file or document that consumes our entire daily OpenAI token quota in seconds, resulting in immediate service denial for all other users.

---

## Guardrail 2 — Request Timeout

**What was added:** An `AbortController` wrapping the OpenRouter `fetch` call with a 15-second timeout (`15000ms`), logging `[AI_TIMEOUT]` to the console, and returning a fallback object with `{ success: false, fallback: true, message: 'Analysis unavailable. Please try again shortly.' }`.

**What it protects against:** Indefinite connection hangs that lock up server threads, consume memory resources, and deplete the server's concurrent request connection pool.

**Production incident it prevents:** A downstream API latency spike or network degradation causes the Express backend to exhaust all its socket descriptors, causing the site to go completely unresponsive for all users.

---

## Guardrail 3 — LLM Failure Handling

**What was added:** A robust `try/catch` block wrapping the external API communication, logging `[AI_ERROR]` on failures, returning a fallback status object, and converting this fallback into an HTTP `503 Service Unavailable` status response in the controller.

**What it protects against:** Unhandled TypeErrors and other exceptions (e.g. trying to access `data.choices[0]` when the API key is invalid or the LLM is down) that crash the server process.

**Production incident it prevents:** An unexpected API key expiration or OpenRouter outage at 2 AM causes an uncaught error on the next user request, crashing the Node server process and keeping the service down until manual intervention occurs.
