import React, { useState } from 'react'

export default function ErrorState({ error, onRetry }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
  const is503 = error && error.includes('503')
  const isNetwork = error && (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch') || error.toLowerCase().includes('connect'))

  // Map to beautiful context-aware UI content based on actual error condition
  let errorTitle = 'Operational Outage Detected'
  let errorDescription = 'An unexpected server error occurred while retrieving order manifests.'
  let iconColor = 'var(--red)'
  
  if (is503) {
    errorTitle = 'Service Temporarily Unavailable (503)'
    errorDescription = 'Our order ledger database is undergoing maintenance or experiencing a heavy transaction peak. Rest assured, your data is safe and transactions will queue.'
    iconColor = 'var(--accent)'
  } else if (isNetwork) {
    errorTitle = 'Connection Interrupt / Network Issue'
    errorDescription = 'Unable to establish a secure link to the Orderly backend. Please check your internet connectivity, local firewall settings, or server routing.'
    iconColor = 'var(--blue)'
  } else if (error) {
    errorTitle = 'Application Error Raised'
    errorDescription = `A database or client error occurred: "${error}"`
  }

  return (
    <tr>
      <td colSpan={7}>
        <div
          className="animate-fade-in"
          style={{
            padding: '60px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Large Error Indicator */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${iconColor}`,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)',
            }}
          >
            {isNetwork ? (
              // Signal Disconnected SVG
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.66 8.66a15.42 15.42 0 0 1 3.34-.66M12 20h.01" />
              </svg>
            ) : is503 ? (
              // Database Maintenance/High Load SVG
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" width="20" height="8" rx="2" ry="2" y="2"></rect>
                <rect x="2" width="20" height="8" rx="2" ry="2" y="14"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            ) : (
              // Warning Triangle SVG
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
          </div>

          {/* Heading and details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              {errorTitle}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 460, fontSize: 14, lineHeight: 1.6 }}>
              {errorDescription}
            </p>
          </div>

          {/* Technical Details Expander */}
          {error && (
            <div style={{ width: '100%', maxWidth: 460 }}>
              <div 
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                <span>{showTechnicalDetails ? '▼ Hide technical diagnostics' : '► Show technical diagnostics'}</span>
              </div>
              
              {showTechnicalDetails && (
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--red)',
                    overflowX: 'auto',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: 'var(--text-secondary)' }}>System Trace:</strong>
                  <div style={{ marginTop: 4 }}>Error: {error}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 4 }}>
                    Timestamp: {new Date().toISOString()} | Code: {is503 ? 'HTTP_503_SERVICE_UNAVAILABLE' : 'API_FETCH_FAILURE'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={onRetry}
            style={{
              padding: '12px 28px',
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'none'
            }}
          >
            {/* Spin indicator refresh icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Retry Connection</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
