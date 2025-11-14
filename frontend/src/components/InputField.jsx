import React from 'react'

export default function InputField({ label, id, name, type='text', value, onChange, placeholder, error }) {
  const fieldName = name || id

  function handleChange(e) {
    if (!onChange) return
    // Normalize the payload to an event-like object so callers can rely on e.target.name/value
    const val = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    const out = { target: { name: fieldName, value: val, type: type } }
    onChange(out)
  }

  return (
    <label className="block">
      <div className="text-sm text-amber-900 mb-1">{label}</div>
      <input id={id} name={fieldName} type={type} value={value} onChange={handleChange} placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-white/95 border ${error ? 'border-red-500' : 'border-gray-200'} text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200`} />
      {error && <div className="text-sm text-red-400 mt-1">{error}</div>}
    </label>
  )
}
