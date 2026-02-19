import React from 'react'

export default function TransactionItem({ t, onEdit, onDelete }) {
  return (
    <li className={`tx-item ${t.type}`}>
      <div className="left">
        <div className="title">{t.description}</div>
        <div className="meta">{t.date} {t.category ? `· ${t.category}` : ''}</div>
      </div>
      <div className="right">
        <div className="amount">{t.type === 'expense' ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}</div>
        <div className="actions">
          <button className="icon-btn" onClick={() => onEdit(t)} aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#cfe8f4"/></svg>
          </button>
          <button className="icon-btn" onClick={() => onDelete(t)} aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#ffb3af"/></svg>
          </button>
        </div>
      </div>
    </li>
  )
}
