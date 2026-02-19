import React from 'react'

export default function Header({ onOpen }) {
  return (
    <header className="app-header glass-card">
      <div className="brand">
        Expense<span>Tracker</span>
      </div>

      <div className="header-actions">
        <button className="btn primary" onClick={onOpen}>+ Add New</button>
      </div>
    </header>
  )
}
