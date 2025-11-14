import React from 'react'
import { motion as Motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <Motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} border-2 border-amber-200/30 border-t-amber-400 rounded-full ${className}`}
    />
  )
}

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <Motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          className="bg-white/10 rounded-lg h-12 backdrop-blur-sm"
        />
      ))}
    </div>
  )
}

const DotLoader = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <Motion.div
          key={i}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
          className="w-2 h-2 bg-amber-400 rounded-full"
        />
      ))}
    </div>
  )
}

export { LoadingSpinner, SkeletonLoader, DotLoader }