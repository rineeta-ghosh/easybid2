import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = ({ children, userRole = 'buyer' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Determine if we should show sidebar based on route
  const shouldShowSidebar = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/buyer') || 
                           location.pathname.startsWith('/supplier') || 
                           location.pathname.startsWith('/admin') ||
                           location.pathname.startsWith('/notifications')

  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar userRole={userRole} isOpen={true} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar 
        userRole={userRole} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-neutral-900/95 backdrop-blur-xl border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-neutral-300"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] p-1">
              <div className="bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">EB</div>
            </div>
            <span className="font-semibold text-amber-200">EasyBid</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout