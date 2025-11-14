import React from 'react'
import { motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ActionButton = ({ 
  title, 
  description, 
  icon, 
  href, 
  gradient = 'from-amber-500 to-orange-600',
  size = 'md',
  className = '' 
}) => {
  const navigate = useNavigate()
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }

  const IconComponent = ({ name }) => {
    const iconProps = { className: "w-8 h-8 text-white", strokeWidth: 2 }
    
    switch (name) {
      case 'create-tender':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )
      case 'view-tenders':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'submit-bid':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        )
      case 'evaluate-bids':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.25-4.5c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0117.25 18.75h-10.5A2.25 2.25 0 014.5 16.5V6.108c0-1.135.845-2.098 1.976-2.192.374-.03.748-.057 1.124-.08M15 12.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'reports':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        )
      case 'notifications':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        )
      default:
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        )
    }
  }

  const handleClick = () => {
    if (href) {
      navigate(href)
    }
  }

  return (
    <Motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${sizeClasses[size]} bg-linear-to-br ${gradient} rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-white/10 ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <IconComponent name={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0">
          <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Motion.div>
  )
}

export default ActionButton