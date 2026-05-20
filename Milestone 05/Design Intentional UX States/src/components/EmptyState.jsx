import React from 'react'

export default function EmptyState({ isFilterActive, onClearFilters, onCreateOrder }) {
  return (
    <tr>
      <td colSpan={7}>
        <div
          className="animate-fade-in"
          style={{
            padding: '70px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {isFilterActive ? (
            // Scenario 1: Filters are active but yielded zero results
            <>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                }}
              >
                {/* Custom SVG Search glass with cross */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11" stroke="var(--red)"></line>
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
                  No Orders Match Active Filters
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 440, fontSize: 14, lineHeight: 1.6 }}>
                  We couldn't find any orders matching your selected status filter or search query. 
                  Try clearing the filters to view the rest of the ledger.
                </p>
              </div>

              <button
                onClick={onClearFilters}
                className="glow-hover"
                style={{
                  marginTop: 10,
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--accent)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-dim)'
                  e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span>✕ Clear Filters</span>
              </button>
            </>
          ) : (
            // Scenario 2: No orders exist at all
            <>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed var(--border)',
                }}
              >
                {/* Beautiful open package/box SVG */}
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="M3.3 7 12 12l8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
                  No Orders on Record
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 440, fontSize: 14, lineHeight: 1.6 }}>
                  The Orderly ledger is completely empty. There are currently no customer or product shipments registered in the database.
                </p>
              </div>

              <button
                onClick={onCreateOrder}
                style={{
                  marginTop: 10,
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
                <span>➕ Create Your First Order</span>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
