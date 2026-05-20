import React from 'react'

export default function SkeletonRow() {
  // 7 columns to match: ID, Customer Name, Product, Total Amount, Status, Order Date, Priority
  const columnWidths = [70, 140, 180, 80, 100, 95, 90]

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {columnWidths.map((width, idx) => (
        <td key={idx} style={{ padding: '16px 20px' }}>
          <div
            style={{
              width: width,
              height: 14,
              borderRadius: 6,
              background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite linear',
            }}
          />
        </td>
      ))}
    </tr>
  )
}
