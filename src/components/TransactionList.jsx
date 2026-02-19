import React from 'react'
import TransactionItem from './TransactionItem'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) return <div className="empty-state">No transactions yet. Click + to add your first one.</div>

  return (
    <ul className="tx-list">
      {transactions.map(t => (
        <TransactionItem key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
