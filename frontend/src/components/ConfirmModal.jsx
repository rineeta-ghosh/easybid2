import React from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

export default function ConfirmModal({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm, 
  onCancel,
  type = 'default' // 'default', 'danger', 'success'
}) {
  if (!isOpen) return null

  const typeStyles = {
    default: 'bg-amber-600 hover:bg-amber-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  }

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-neutral-300 text-sm">{message}</p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${typeStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}