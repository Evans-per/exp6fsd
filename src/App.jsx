import React, { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import Summary from './components/Summary'
import TransactionList from './components/TransactionList'
import ModalForm from './components/ModalForm'
import Toast from './components/Toast'
import Charts from './components/Charts'

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem('txs')
      return raw ? JSON.parse(raw) : []
    } catch (e) { return [] }
  })
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('latest')

  useEffect(() => {
    localStorage.setItem('txs', JSON.stringify(transactions))
  }, [transactions])

  const addOrSave = (tx) => {
    if (editing) {
      setTransactions(prev => prev.map(t => t.id === editing.id ? { ...t, ...tx } : t))
      setToast('Transaction updated')
      setEditing(null)
    } else {
      const item = { id: Date.now(), ...tx }
      setTransactions(prev => [item, ...prev])
      setToast('Transaction added')
    }
  }

  const requestDelete = (t) => {
    const ok = window.confirm(`Delete "${t.description}"?`)
    if (!ok) return
    setTransactions(prev => prev.filter(x => x.id !== t.id))
    setToast('Transaction deleted')
  }

  const clearAll = () => {
    if (!transactions.length) return
    if (!window.confirm('Clear all transactions?')) return
    setTransactions([])
    setToast('All cleared')
  }

  const onEdit = (t) => {
    setEditing(t)
    setModalOpen(true)
  }

  const filtered = useMemo(() => {
    let list = transactions.slice()
    if (search) {
      list = list.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase()) || 
        (t.category || '').toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filter !== 'all') list = list.filter(t => t.type === filter)
    
    // Sort options
    if (sort === 'latest') list.sort((a, b) => b.id - a.id)
    if (sort === 'oldest') list.sort((a, b) => a.id - b.id)
    if (sort === 'amount-desc') list.sort((a, b) => b.amount - a.amount)
    if (sort === 'amount-asc') list.sort((a, b) => a.amount - b.amount)
    if (sort === 'date-desc') list.sort((a, b) => new Date(b.date) - new Date(a.date))
    if (sort === 'date-asc') list.sort((a, b) => new Date(a.date) - new Date(b.date))
    if (sort === 'month-desc') list.sort((a, b) => (b.date || '').slice(0, 7).localeCompare((a.date || '').slice(0, 7)))
    if (sort === 'month-asc') list.sort((a, b) => (a.date || '').slice(0, 7).localeCompare((b.date || '').slice(0, 7)))
    
    return list
  }, [transactions, search, filter, sort])

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  return (
    <div className="app-root">
      <div className="main-container">
        <Header 
          onOpen={() => { setModalOpen(true); setEditing(null) }}
        />

        <Summary totals={totals} />

        <div className="content-grid">
          <section className="transactions-section glass-card">
            <div className="section-header">
              <h3>Transactions</h3>
              <span className="count">{filtered.length} items</span>
            </div>
            
            <div className="tx-controls">
              <input 
                className="search" 
                placeholder="Search transactions..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div className="tx-scroll">
              <TransactionList
                transactions={filtered}
                onEdit={onEdit}
                onDelete={requestDelete}
              />
            </div>
          </section>

          <aside className="controls-section">
            <div className="glass-card control-card">
              <h4>Quick Actions</h4>
              <p className="muted">Add or edit your transactions quickly</p>
              <div className="actions-row">
                <button
                  className="btn primary"
                  onClick={() => { setModalOpen(true); setEditing(null) }}
                >
                  Add Transaction
                </button>
                {filtered.length > 0 && (
                  <button
                    className="btn secondary"
                    onClick={() => { setEditing(filtered[0]); setModalOpen(true) }}
                  >
                    Edit First
                  </button>
                )}
              </div>
            </div>

            <div className="glass-card control-card">
              <h4>Sort & Filter</h4>
              <div className="control-row">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="date-desc">Date: Newest</option>
                  <option value="date-asc">Date: Oldest</option>
                  <option value="month-desc">Month: Newest</option>
                  <option value="month-asc">Month: Oldest</option>
                  <option value="amount-desc">Amount: High → Low</option>
                  <option value="amount-asc">Amount: Low → High</option>
                </select>
              </div>
              <button className="btn secondary" onClick={clearAll} style={{ width: '100%', marginTop: '10px' }}>
                Clear All
              </button>
            </div>
          </aside>
        </div>

        <section className="charts-section">
          <div className="glass-card chart-card">
            <h4>Income vs Expense</h4>
            <div className="chart-container">
              <Charts transactions={transactions} type="pie" />
            </div>
          </div>
          <div className="glass-card chart-card">
            <h4>Monthly Overview</h4>
            <div className="chart-container">
              <Charts transactions={transactions} type="bar" />
            </div>
          </div>
        </section>
      </div>

      <ModalForm
        visible={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSubmit={addOrSave}
        initial={editing}
      />
      <Toast msg={toast} onDone={() => setToast('')} />
    </div>
  )
}
