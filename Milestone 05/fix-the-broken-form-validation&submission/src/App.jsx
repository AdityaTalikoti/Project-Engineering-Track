// ============================================================
//  TrackFlow – Bug Report Form  (FIXED VERSION)
//  Your task: Find and fix all the bugs in this file.
//  Do NOT modify api.js or index.css.
// ============================================================

import { useState } from 'react'
import { submitBugReport } from './api'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const COMPONENTS = ['Authentication', 'Dashboard', 'Billing', 'API', 'Notifications', 'Settings']

const EMPTY_FORM = {
  title: '',
  severity: '',
  component: '',
  description: '',
  steps: '',
  stepsCount: '',
}

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM)

  // FIXED: errors state is now populated and displayed
  const [errors, setErrors] = useState({})

  // FIXED: loading and serverError are now handled and displayed
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const [submitted, setSubmitted] = useState([])
  const [successId, setSuccessId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    
    // FIXED: clear field-specific error as soon as the user starts correcting it
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // FIXED: Real validate() function checks required fields and step count constraints
  const validate = (data) => {
    const errs = {}
    
    if (!data.title || !data.title.trim()) {
      errs.title = 'Bug title is required'
    }
    
    if (!data.severity) {
      errs.severity = 'Severity level is required'
    }
    
    if (!data.component) {
      errs.component = 'Affected component is required'
    }
    
    if (!data.description || !data.description.trim()) {
      errs.description = 'Description is required'
    }
    
    if (data.stepsCount === '' || data.stepsCount === null || data.stepsCount === undefined) {
      errs.stepsCount = 'Number of steps is required'
    } else {
      const count = Number(data.stepsCount)
      if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
        errs.stepsCount = 'Number of steps must be a positive integer (at least 1)'
      }
    }
    
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous submission states
    setSuccessId(null)
    setServerError(null)

    // FIXED: Validate form fields first and block submission on any failure
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    // FIXED: Set loading to true before the API call starts
    setLoading(true)
    
    try {
      const result = await submitBugReport(form)
      
      // FIXED: Form successfully submitted – reset form fields and save result
      setSuccessId(result.id)
      setSubmitted((prev) => [result, ...prev])
      setForm(EMPTY_FORM)
      setErrors({})
    } catch (err) {
      // FIXED: Handle server-side field-level or general rejection errors
      if (err && err.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }))
      } else {
        setServerError(err?.message || 'An unexpected server error occurred.')
      }
    } finally {
      // FIXED: Ensure loading state is reset back to false in all conditions
      setLoading(false)
    }
  }

  const sevClass = (s) =>
    ({ Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium', Low: 'sev-low' }[s] ?? '')

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="badge">⬡ TrackFlow Internal Tools</div>
        <h1>Report a Bug</h1>
        <p>
          You're on the <strong>QA Engineering</strong> team at <strong>TrackFlow Inc.</strong> The
          team uses this form to log bugs before sprint planning every Monday. Help your teammates
          by making sure the form works correctly.
        </p>
      </header>

      <div className="card">
        <p className="section-label">New Bug Report</p>
        <form onSubmit={handleSubmit} noValidate>

          {/* SUCCESS BANNER — shown after a successful submit */}
          {successId && (
            <div style={{ background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#4caf7d' }}>
              ✓ Bug <strong>{successId}</strong> filed successfully!
            </div>
          )}

          {/* SERVER ERROR BANNER */}
          {serverError && (
            <div style={{ background: 'rgba(247,95,95,0.1)', border: '1px solid rgba(247,95,95,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#f75f5f' }}>
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label>Bug Title <span className="req">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Checkout button unresponsive on mobile Safari"
              style={{ borderColor: errors.title ? 'var(--danger)' : '' }}
            />
            {/* FIXED: error message for title is rendered */}
            {errors.title && (
              <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>
                {errors.title}
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity <span className="req">*</span></label>
              <select 
                name="severity" 
                value={form.severity} 
                onChange={handleChange}
                style={{ borderColor: errors.severity ? 'var(--danger)' : '' }}
              >
                <option value="">— Select —</option>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {/* FIXED: error message for severity is rendered */}
              {errors.severity && (
                <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>
                  {errors.severity}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Affected Component <span className="req">*</span></label>
              <select 
                name="component" 
                value={form.component} 
                onChange={handleChange}
                style={{ borderColor: errors.component ? 'var(--danger)' : '' }}
              >
                <option value="">— Select —</option>
                {COMPONENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {/* FIXED: error message for component is rendered */}
              {errors.component && (
                <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>
                  {errors.component}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description <span className="req">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what's happening and what the expected behaviour should be…"
              style={{ borderColor: errors.description ? 'var(--danger)' : '' }}
            />
            {/* FIXED: error message for description is rendered */}
            {errors.description && (
              <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>
                {errors.description}
              </div>
            )}
          </div>

          <hr className="divider" />

          <div className="form-row">
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea
                name="steps"
                value={form.steps}
                onChange={handleChange}
                style={{ minHeight: 72 }}
                placeholder="1. Go to…&#10;2. Click…&#10;3. Observe…"
              />
            </div>
            <div className="form-group">
              <label>No. of Steps <span className="req">*</span></label>
              <input
                type="number"
                name="stepsCount"
                value={form.stepsCount}
                onChange={handleChange}
                placeholder="e.g. 3"
                style={{ borderColor: errors.stepsCount ? 'var(--danger)' : '' }}
              />
              {/* FIXED: accepts only positive integers, validates errors cleanly */}
              {errors.stepsCount && (
                <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>
                  {errors.stepsCount}
                </div>
              )}
            </div>
          </div>

          {/* FIXED: button is now disabled during loading, text changes dynamically */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Bug Report'}
          </button>

        </form>
      </div>

      {/* Filed bugs list */}
      {submitted.length > 0 && (
        <div className="submitted-list">
          <p className="section-label" style={{ marginBottom: 8 }}>Filed This Session</p>
          {submitted.map((bug, i) => (
            <div key={i} className="submitted-item">
              <div>
                <div className="title">{bug.title}</div>
                <div className="meta">{bug.component} · {bug.stepsCount} steps</div>
              </div>
              <span className={`severity-badge ${sevClass(bug.severity)}`}>{bug.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
