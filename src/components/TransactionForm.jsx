import React, { useState } from 'react'

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('income')
  const [category, setCategory] = useState('Other')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!description.trim()) return setError('Description is required')
    if (isNaN(value) || value <= 0) return setError('Amount must be a positive number')
    if (type === 'expense' && !category) return setError('Select an expense category')

    onAdd({ description: description.trim(), amount: value, type, category: type === 'expense' ? category : undefined })
    setDescription('')
    setAmount('')
    setType('income')
    setError('')
  }

  return (
    <form className="tx-form" onSubmit={submit}>
      <h2>Add Transaction</h2>

      <label>Transaction Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Salary, Groceries"
      />

      <label>Amount</label>
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />

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
            <option>Transport</option>
            <option>Utilities</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Other</option>
          </select>
        </>
      )}

      {error && <div className="error">{error}</div>}

      <button className="btn add">Add Transaction</button>
    </form>
  )
}
