// frontend/src/api/client.js
// CONSTRAINT 1: API key must NEVER appear in this file.
// The frontend calls YOUR backend. The backend calls OpenRouter.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function login(email) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Authentication failed')
  }

  return response.json()
}

export async function scoreEmail(emailText, token) {
  const response = await fetch(`${API_BASE}/api/score-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ emailText })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Analysis request failed')
  }

  return response.json()
}

