import React, { useState, useEffect } from 'react'
import { fetchOrders } from '../mockApi'
import SkeletonRow from './SkeletonRow'
import OrderRow from './OrderRow'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  // Load orders from simulated API
  const loadOrders = () => {
    setLoading(true)
    setError(null)
    setOrders([])

    fetchOrders()
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to retrieve order manifests.')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Action: Clear all search and filter conditions
  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setPriorityFilter('All')
  }

  // Action: Create a sample order to test transitions from Empty State to Success State
  const handleCreateSampleOrder = () => {
    const sampleOrders = [
      { id: 'ORD-9901', customer: 'Aarav Mehta', product: 'Premium Ergo Stand', amount: 12499, status: 'Processing', date: new Date().toISOString().split('T')[0] },
      { id: 'ORD-9902', customer: 'Isha Sen', product: 'Thunderbolt 4 Docking Station', amount: 24999, status: 'Pending', date: new Date().toISOString().split('T')[0] },
      { id: 'ORD-9903', customer: 'Vihaan Joshi', product: 'Mechanical Keycaps Set', amount: 3499, status: 'Delivered', date: new Date().toISOString().split('T')[0] }
    ]
    setOrders(sampleOrders)
  }

  // Filter orders according to user query, status, and computed priority
  const getOrderPriority = (order) => {
    if (order.amount >= 10000 || order.status === 'Pending') {
      return 'High'
    } else if (order.amount >= 5000 && order.status !== 'Cancelled') {
      return 'Medium'
    }
    return 'Normal'
  }

  const filteredOrders = orders.filter(order => {
    // 1. Search term match (customer name, product, or order ID)
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    // 2. Status filter match
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter

    // 3. Priority filter match
    const priority = getOrderPriority(order)
    const matchesPriority = priorityFilter === 'All' || priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Metric computations (based on total retrieved orders to keep high-level status consistent)
  const totalOrders = orders.length
  const totalValue = orders.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.amount : 0), 0)
  
  // Status breakdown calculations
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc;
  }, { Delivered: 0, Shipped: 0, Processing: 0, Pending: 0, Cancelled: 0 })

  const STATUS_THEME = {
    Delivered: { label: 'Delivered', color: 'var(--green)', barColor: 'var(--green)' },
    Shipped: { label: 'Shipped', color: 'var(--blue)', barColor: 'var(--blue)' },
    Processing: { label: 'Processing', color: 'var(--accent)', barColor: 'var(--accent)' },
    Pending: { label: 'Pending', color: 'var(--purple)', barColor: 'var(--purple)' },
    Cancelled: { label: 'Cancelled', color: 'var(--red)', barColor: 'var(--red)' }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
      
      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Orders Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage, prioritize, and track all customer orders in real time.</p>
        </div>
        <button 
          onClick={loadOrders} 
          disabled={loading}
          style={{
            padding: '10px 20px', 
            background: loading ? 'var(--surface-2)' : 'var(--accent)', 
            color: loading ? 'var(--text-muted)' : '#000',
            border: 'none', 
            borderRadius: 'var(--radius)', 
            fontSize: 14,
            fontWeight: 600, 
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={e => { if(!loading) e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { if(!loading) e.currentTarget.style.opacity = '1' }}
        >
          {loading ? (
            <>
              {/* Spinner inside button */}
              <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>↻ Refresh Ledger</span>
            </>
          )}
        </button>
      </div>

      {/* ── STATS & METRICS PANEL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 32 }}>
        
        {/* Metric 1: Total Value */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Value</span>
            <span style={{ fontSize: 20 }}>💰</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--mono)', wordBreak: 'break-all' }}>
            {loading ? '—' : `₹${totalValue.toLocaleString()}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            Excluding cancelled B2B orders
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</span>
            <span style={{ fontSize: 20 }}>📦</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
            {loading ? '—' : totalOrders}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            {loading ? '—' : `${statusCounts.Delivered} delivered • ${statusCounts.Cancelled} cancelled`}
          </div>
        </div>

        {/* Metric 3: Status Breakdown Bar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Breakdown</span>
              <span style={{ fontSize: 18 }}>📊</span>
            </div>
            
            {/* Horizontal Segmented Progress Bar */}
            {loading || totalOrders === 0 ? (
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, margin: '14px 0 8px 0' }} />
            ) : (
              <div style={{ height: 8, display: 'flex', borderRadius: 4, overflow: 'hidden', background: 'var(--border)', margin: '14px 0 8px 0' }}>
                {Object.keys(STATUS_THEME).map(status => {
                  const count = statusCounts[status] || 0
                  if (count === 0) return null
                  const widthPct = (count / totalOrders) * 100
                  return (
                    <div 
                      key={status} 
                      style={{ 
                        width: `${widthPct}%`, 
                        background: STATUS_THEME[status].barColor, 
                        height: '100%',
                        transition: 'width 0.5s ease-in-out'
                      }}
                      title={`${status}: ${count} (${Math.round(widthPct)}%)`}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Color Indicators Legend */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 11 }}>
            {Object.keys(STATUS_THEME).map(status => {
              const count = statusCounts[status] || 0
              if (loading || count === 0) return null
              return (
                <span key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_THEME[status].color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{count}</span> {status.charAt(0)}
                </span>
              )
            })}
            {(!loading && totalOrders === 0) && (
              <span style={{ color: 'var(--text-muted)' }}>No data available</span>
            )}
            {loading && <span style={{ color: 'var(--text-muted)' }}>Calculating metrics...</span>}
          </div>
        </div>

      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      {!loading && !error && orders.length > 0 && (
        <div 
          className="animate-fade-in"
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: 16, 
            marginBottom: 20 
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 280, flex: '1 0 auto' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none', color: 'var(--text-muted)' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by Order ID, customer, product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: 14,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            
            {/* Status Select Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Select Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                style={{
                  padding: '8px 14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="All">All Priorities</option>
                <option value="High">⚡ High</option>
                <option value="Medium">✦ Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            {/* Clear filter indicator button */}
            {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                onClick={handleClearFilters}
                style={{
                  padding: '8px 16px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--accent)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
              >
                Clear Filters
              </button>
            )}

          </div>
        </div>
      )}

      {/* ── ORDERS TABLE CONTAINER ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        
        {/* Table Header Section */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Orders Ledger
            {!loading && !error && orders.length > 0 && (
              <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
            )}
          </h2>
          
          {/* Real-time sync indicator dot */}
          {!loading && !error && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)' }} />
              Live Sync Active
            </div>
          )}
        </div>

        {/* The Table Layout */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: 'Order ID', width: '12%' },
                  { label: 'Customer Name', width: '22%' },
                  { label: 'Product Manifest', width: '26%' },
                  { label: 'Total Amount', width: '12%' },
                  { label: 'Status', width: '12%' },
                  { label: 'Order Date', width: '14%' },
                  { label: 'Priority Flag', width: '12%' }
                ].map(col => (
                  <th 
                    key={col.label} 
                    style={{ 
                      textAlign: 'left', 
                      padding: '14px 20px', 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: 'var(--text-muted)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      width: col.width
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody style={{ transition: 'opacity 0.2s ease-in-out' }}>
              {/* LOADING STATE - Skeleton Rows */}
              {loading && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {/* ERROR STATE */}
              {!loading && error && (
                <ErrorState error={error} onRetry={loadOrders} />
              )}

              {/* EMPTY STATE - Completely empty ledger */}
              {!loading && !error && orders.length === 0 && (
                <EmptyState 
                  isFilterActive={false} 
                  onCreateOrder={handleCreateSampleOrder} 
                />
              )}

              {/* EMPTY STATE - No orders match filter conditions */}
              {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
                <EmptyState 
                  isFilterActive={true} 
                  onClearFilters={handleClearFilters} 
                />
              )}

              {/* SUCCESS STATE - Full orders table rendering */}
              {!loading && !error && filteredOrders.length > 0 && (
                filteredOrders.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Animations and Keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        @keyframes spin {
          0%   { transform: rotate(0deg) }
          100% { transform: rotate(360deg) }
        }
        .spin {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  )
}
