import React, { useState, useEffect } from 'react'
import { login, scoreEmail } from './api/client'

const SAMPLE_EMAILS = {
  desperate: `Hi Mr. recruiter,
I'm desperately looking for any job. I will work for free, literally anything you have! I am really struggling right now and need this so bad. Please let me know if you can jump on a call right away to help me out. Please, I really need this opportunity.`,
  professional: `Hi Sarah,
I read your post about looking for a Senior Frontend Developer with React experience.
Over the last 4 years, I've built responsive web apps at scale using React and Vite. I'd love to discuss how I can help your team optimize its loading speeds.
Are you free for a brief 10-minute call next Tuesday at 10:00 AM?`,
  short: `Hey, hire me!`
}

function App() {
  const [emailText, setEmailText] = useState('')
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('jobseeker@example.com')
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  // Auto-login on mount for seamless UX
  useEffect(() => {
    handleLogin()
  }, [])

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await login(userEmail)
      setToken(data.token)
      setIsAuthed(true)
    } catch (err) {
      setError(`Authentication Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleScore = async (e) => {
    if (e) e.preventDefault()
    if (!emailText.trim()) return

    try {
      setLoading(true)
      setError(null)
      setResults(null)
      const response = await scoreEmail(emailText, token)
      
      if (response.fallback) {
        setError(response.message || 'Service is temporarily unavailable (Fallback active).')
      } else {
        setResults(response.result)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (type) => {
    setEmailText(SAMPLE_EMAILS[type])
  }

  // Calculate remaining characters and warnings
  const charCount = emailText.length
  const limitNear = charCount > 2500
  const limitExceeded = charCount > 3000

  // Helper to render metric rings
  const renderMetricCircle = (title, score, colorClass) => {
    const scoreVal = score !== undefined ? score : 0
    const percentage = scoreVal * 10
    const radius = 32
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="metric-box">
        <span className="metric-title">{title}</span>
        <div className="metric-circle">
          <svg className="circle-svg">
            <circle className="circle-bg" cx="40" cy="40" r={radius} />
            <circle
              className="circle-fill"
              cx="40"
              cy="40"
              r={radius}
              stroke={colorClass === 'violet' ? 'url(#violetGrad)' : 'url(#cyanGrad)'}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
            <defs>
              <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(263, 90%, 65%)" />
                <stop offset="100%" stopColor="hsl(263, 90%, 50%)" />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(190, 95%, 50%)" />
                <stop offset="100%" stopColor="hsl(190, 95%, 40%)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="metric-score-value">{scoreVal}/10</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-badge">
          <span>⚡ AI Outreach Auditor</span>
        </div>
        <h1>ToneScorer</h1>
        <p>Analyze cold emails sent to recruiters. Instantly spot desperate language, evaluate your call-to-action strength, and maximize your response rates.</p>
      </header>

      {/* Auth Control Card */}
      <section className="auth-card">
        <div className="auth-info">
          <span className="auth-title">Authentication Session</span>
          <span className="auth-desc">
            {isAuthed ? `Active User ID: ${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : 'Not Authenticated'}
          </span>
        </div>
        <div className="auth-form">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={loading}
            className="input-field"
            placeholder="enter.your@email.com"
          />
          <button onClick={handleLogin} disabled={loading} className="btn-secondary">
            {loading && !token ? 'Configuring...' : 'Renew Token'}
          </button>
        </div>
      </section>

      {/* Main Feature Grid */}
      <main className="main-grid">
        {/* Left Side: Composer */}
        <section className="card-glass">
          <div className="card-title-group">
            <span className="card-title">Compose Outreach Email</span>
            <div className="status-badge">
              {loading && <div className="loading-spinner"></div>}
            </div>
          </div>

          <form onSubmit={handleScore} className="desperate-phrases-card">
            <div className="textarea-wrapper">
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste your cold outreach email draft here..."
                className="email-textarea"
                disabled={loading}
              />
              <span className={`char-counter ${limitExceeded ? 'limit-exceeded' : limitNear ? 'limit-near' : ''}`}>
                {charCount} / 3000
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click to load an example:</span>
              <div className="example-chips">
                <button type="button" onClick={() => loadExample('desperate')} className="chip">
                  🚨 Desperate outreach
                </button>
                <button type="button" onClick={() => loadExample('professional')} className="chip">
                  ✨ Professional pitch
                </button>
                <button type="button" onClick={() => loadExample('short')} className="chip">
                  ⚠️ Too short
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || limitExceeded || !emailText.trim()}
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Analyzing Tone...' : 'Analyze Outreach Email'}
            </button>
          </form>
        </section>

        {/* Right Side: Scoreboard & Findings */}
        <section className="card-glass" style={{ justifyContent: 'flex-start' }}>
          <span className="card-title">Analysis & Feedback</span>

          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!results && !error && (
            <div className="alert alert-info">
              Enter email copy above and click <strong>Analyze Outreach Email</strong> to fetch recruiter insights and score metrics.
            </div>
          )}

          {results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Overall Tone Classification Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Overall Recruiter Confidence Rating:</span>
                <span className={`badge-overall ${results.confidence?.toLowerCase()}`}>
                  {results.confidence || 'Medium'}
                </span>
              </div>

              {/* Recruiter Metrics Gauges */}
              <div className="metrics-grid">
                {renderMetricCircle('Confidence', results.scores?.confidence, 'violet')}
                {renderMetricCircle('Clarity', results.scores?.clarity, 'cyan')}
                {renderMetricCircle('CTA Strength', results.scores?.cta, 'violet')}
              </div>

              {/* Recruiter Audit Log / Desperate Phrases */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '1.1rem' }}>
                  Recruiter Tone Audit
                </span>
                
                {results.desperatePhrases && results.desperatePhrases.length > 0 ? (
                  <div className="desperate-phrases-card">
                    {results.desperatePhrases.map((phrase, idx) => (
                      <div key={idx} className="desperate-phrase-item">
                        <span className="desperate-text">⚠️ Desperate / Submissive Tone Detected</span>
                        <p className="phrase-explanation">
                          "{phrase}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: 'hsla(142, 70%, 45%, 0.1)', color: 'var(--color-success)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid hsla(142, 70%, 45%, 0.2)' }}>
                    ✅ Perfect! No desperate or submissive phrasing detected. Your tone sounds confident and professional.
                  </div>
                )}
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
