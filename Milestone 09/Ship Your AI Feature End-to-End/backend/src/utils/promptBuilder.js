// backend/src/utils/promptBuilder.js
// =====================================================================
// CONSTRAINT 2: ALL prompt logic must live in this file.
// Your routes and controllers must NOT contain system instructions,
// message arrays, or prompt templates. Only this file builds prompts.
// =====================================================================

const SYSTEM_PROMPT = `You are an expert recruiter and copywriter specializing in evaluating outreach emails.
Analyze the provided cold email and rate its effectiveness.
Return ONLY a JSON object with exactly these fields:
{
  "scores": {
    "confidence": 8, // integer 1-10 rating confidence (avoiding submissiveness/arrogance)
    "clarity": 7, // integer 1-10 rating readability and conciseness
    "cta": 6 // integer 1-10 rating call-to-action strength and directness
  },
  "desperatePhrases": [
    "phrase 1 with suggested alternative",
    "phrase 2 with suggested alternative"
  ],
  "confidence": "high OR medium OR low"
}
Return ONLY valid JSON. No markdown, no explanation.`

export function buildPrompt(userInput) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Cold Email Content:\n\n${userInput}` }
  ]
}

export { SYSTEM_PROMPT }
