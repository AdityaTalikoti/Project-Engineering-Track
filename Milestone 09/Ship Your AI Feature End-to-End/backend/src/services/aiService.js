// backend/src/services/aiService.js
// CONSTRAINT 3: Token logging on every AI call — do not remove the [AI_USAGE] log.
// CONSTRAINT 5: Fallback response on LLM failure — do not remove the try/catch.

import fetch from 'node-fetch'
import { buildPrompt } from '../utils/promptBuilder.js'

const MODEL = 'openai/gpt-4o-mini'
const TIMEOUT_MS = 15000

export function validateEnv() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      'OPENROUTER_API_KEY is required. Add it to .env locally and to Render Environment in production.'
    )
  }
}

export async function callAI(emailText, userId) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const messages = buildPrompt(emailText)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jobscan.app',
        'X-Title': 'ToneScorer'
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 600,
        temperature: 0.2
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok || !data.choices || !data.choices[0]) {
      throw new Error(data.error?.message || `Invalid API response status ${response.status}`)
    }

    if (data.usage) {
      console.log('[AI_USAGE]', JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        model: MODEL,
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        endpoint: 'tone_scorer'
      }))
    }

    const content = data.choices[0].message.content

    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```(json)?/, '').replace(/```$/, '').trim()
      }
      return JSON.parse(cleanContent)
    } catch {
      return { rawOutput: content, parseError: true }
    }


  } catch (err) {
    clearTimeout(timeoutId)

    if (err.name === 'AbortError') {
      console.error('[AI_TIMEOUT]', { userId, endpoint: 'tone_scorer' })
    } else {
      console.error('[AI_ERROR]', { error: err.message, userId })
    }

    return {
      success: false,
      fallback: true,
      message: 'Analysis unavailable. Please try again shortly.'
    }
  }
}
