import React, { useState, useEffect } from 'react'

export default function ModalForm({ visible, onClose, onSubmit, initial }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Other')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setDescription(initial.description || '')
      setAmount(initial.amount != null ? String(initial.amount) : '')
      setType(initial.type || 'expense')
      setCategory(initial.category || 'Other')
      setDate(initial.date || new Date().toISOString().slice(0, 10))
    } else {
      setDescription('')
      setAmount('')
      setType('expense')
      setCategory('Other')
      setDate(new Date().toISOString().slice(0, 10))
    }
  }, [initial, visible])

  const submit = (e) => {
    e && e.preventDefault()
    setError('')
    if (!description.trim()) return setError('Description required')
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return setError('Amount must be > 0')
    onSubmit({ description: description.trim(), amount: val, type, category: type === 'expense' ? category : undefined, date })
    onClose()
  }

  if (!visible) return null

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{initial ? 'Edit Transaction' : 'Add Transaction'}</h3>
        <form onSubmit={submit} className="modal-form">
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Amount</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {type === 'expense' && (
            <>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Food</option>
                <option>Salary</option>
                <option>Travel</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Other</option>
              </select>
            </>
          )}

          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={submit}>{initial ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
