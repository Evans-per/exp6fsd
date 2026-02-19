import React, { useMemo } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Charts({ transactions, type = 'pie' }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No data to display</p>
      </div>
    )
  }

  const income = transactions.filter(t => t.type === 'income')
  const expense = transactions.filter(t => t.type === 'expense')

  const totalIncome = income.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expense.reduce((s, t) => s + t.amount, 0)

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const byMonth = {}
    transactions.forEach(t => {
      const m = t.date ? t.date.slice(0, 7) : 'unknown'
      if (!byMonth[m]) {
        byMonth[m] = { income: 0, expense: 0 }
      }
      byMonth[m][t.type] += t.amount
    })
    return byMonth
  }, [transactions])

  const months = Object.keys(monthlyData).sort().slice(-6)

  const commonOptions = {
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
            return context.dataset.label + ': $' + context.raw.toFixed(2)
          }
        }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    }
  }

  if (type === 'pie') {
    const pieData = {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [totalIncome, totalExpense],
        backgroundColor: ['#22c55e', '#ff4444'],
        borderColor: ['#16a34a', '#cc0000'],
        borderWidth: 2,
      }]
    }

    return <Pie data={pieData} options={commonOptions} />
  }

  if (type === 'bar') {
    const barData = {
      labels: months.length ? months : ['No data'],
      datasets: [
        {
          label: 'Income',
          data: months.length ? months.map(m => monthlyData[m].income) : [0],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#22c55e',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Expense',
          data: months.length ? months.map(m => monthlyData[m].expense) : [0],
          backgroundColor: 'rgba(255, 68, 68, 0.8)',
          borderColor: '#ff4444',
          borderWidth: 1,
          borderRadius: 6,
        }
      ]
    }

    const barOptions = {
      ...commonOptions,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#a0a0a0' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { 
            color: '#a0a0a0',
            callback: function(value) {
              return '$' + value
            }
          }
        }
      }
    }

    return <Bar data={barData} options={barOptions} />
  }

  return null
}
