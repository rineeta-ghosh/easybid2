import React from 'react'
import { motion as Motion } from 'framer-motion'

export default function AlertMessage({ type = 'info', message, onClose }) {
  if (!message) return null
  
  const typeClasses = {
    success: 'bg-green-900/20 border-green-500/30 text-green-300',
    error: 'bg-red-900/20 border-red-500/30 text-red-300', 
    warning: 'bg-amber-900/20 border-amber-500/30 text-amber-300',
    info: 'bg-blue-900/20 border-blue-500/30 text-blue-300'
  }
  
  return (
    <Motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-4 py-2 rounded-lg border backdrop-blur-sm ${typeClasses[type]} relative shadow-lg`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
      {message}
    </Motion.div>
  )
}
