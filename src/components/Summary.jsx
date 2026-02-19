import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'

export default function Summary({ totals }) {
  const [animBal, setAnimBal] = useState(0)
  const [animInc, setAnimInc] = useState(0)
  const [animExp, setAnimExp] = useState(0)

  useEffect(() => {
    let raf
    const dur = 600
    const start = performance.now()
    const from = { b: animBal, i: animInc, e: animExp }
    const to = { b: totals.balance, i: totals.income, e: totals.expense }
    
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setAnimBal(from.b + (to.b - from.b) * p)
      setAnimInc(from.i + (to.i - from.i) * p)
      setAnimExp(from.e + (to.e - from.e) * p)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [totals.balance, totals.income, totals.expense])

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [totals.income || 0, totals.expense || 0],
      backgroundColor: ['#22c55e', '#ff4444'],
      borderColor: ['#16a34a', '#cc0000'],
      borderWidth: 2,
    }]
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a0a0a0',
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': $' + context.raw.toFixed(2)
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }

  return (
    <section className="summary-section">
      <div className="glass-card summary-card">
        <div className="label">Balance</div>
        <div className={`value ${totals.balance < 0 ? 'neg' : 'pos'}`}>
          ${animBal.toFixed(2)}
        </div>
      </div>

      <div className="glass-card summary-card">
        <div className="label">Income</div>
        <div className="value pos">${animInc.toFixed(2)}</div>
      </div>

      <div className="glass-card summary-card">
        <div className="label">Expenses</div>
        <div className="value neg">${animExp.toFixed(2)}</div>
      </div>

      <div className="glass-card summary-card">
        <div className="label">Overview</div>
        <div className="summary-chart">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </section>
  )
}
