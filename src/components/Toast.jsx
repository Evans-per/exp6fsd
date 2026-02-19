import React, { useEffect } from 'react'

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  if (!msg) return null
  return (
    <div className="toast">{msg}</div>
  )
}
