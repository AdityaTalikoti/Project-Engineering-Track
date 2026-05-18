import React from 'react'

export default function OrderRow({ order }) {
  const STATUS_CONFIG = {
    Delivered:  { color: 'var(--green)', bg: 'var(--green-dim)',  dot: 'var(--green)' },
    Shipped:    { color: 'var(--blue)', bg: 'var(--blue-dim)',   dot: 'var(--blue)' },
    Processing: { color: 'var(--accent)', bg: 'var(--accent-dim)', dot: 'var(--accent)' },
    Pending:    { color: 'var(--purple)', bg: 'var(--purple-dim)', dot: 'var(--purple)' },
    Cancelled:  { color: 'var(--red)', bg: 'var(--red-dim)',    dot: 'var(--red)' },
  }
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending

  // Dynamically compute the Priority Flag based on business rules:
  // - High: amount >= 10000 or status is Pending (needs immediate shipping/attention)
  // - Medium: amount >= 5000 and status is not Cancelled
  // - Normal: otherwise
  let priorityLabel = 'Normal'
  let priorityStyle = { color: 'var(--text-secondary)', bg: 'var(--border)' }

  if (order.amount >= 10000 || order.status === 'Pending') {
    priorityLabel = '⚡ High'
    priorityStyle = { color: 'var(--red)', bg: 'var(--red-dim)' }
  } else if (order.amount >= 5000 && order.status !== 'Cancelled') {
    priorityLabel = '✦ Medium'
    priorityStyle = { color: 'var(--blue)', bg: 'var(--blue-dim)' }
  }

  return (
    <tr
      className="table-row"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Order ID Column */}
      <td
        style={{
          padding: '15px 20px',
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--accent)',
          fontWeight: 600,
        }}
      >
        {order.id}
      </td>

      {/* Customer Name Column */}
      <td
        style={{
          padding: '15px 20px',
          color: 'var(--text-primary)',
          fontWeight: 500,
        }}
      >
        {order.customer}
      </td>

      {/* Product Column */}
      <td
        style={{
          padding: '15px 20px',
          color: 'var(--text-secondary)',
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {order.product}
      </td>

      {/* Total Amount Column */}
      <td
        style={{
          padding: '15px 20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--mono)',
          fontSize: 13,
        }}
      >
        ₹{order.amount.toLocaleString()}
      </td>

      {/* Status Badge Column */}
      <td style={{ padding: '15px 20px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: s.bg,
            color: s.color,
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
          {order.status}
        </span>
      </td>

      {/* Order Date Column */}
      <td
        style={{
          padding: '15px 20px',
          color: 'var(--text-secondary)',
          fontSize: 13,
        }}
      >
        {order.date}
      </td>

      {/* Priority Flag Column */}
      <td style={{ padding: '15px 20px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: priorityStyle.bg,
            color: priorityStyle.color,
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}
        >
          {priorityLabel}
        </span>
      </td>
    </tr>
  )
}
