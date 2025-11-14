import React, { useState, useEffect, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageNav from '../components/PageNav'
import { LoadingSpinner } from '../components/Loaders'
import api from '../lib/api'

const NotificationIcon = ({ type, priority }) => {
  const iconClass = `w-6 h-6 ${priority === 'urgent' ? 'text-red-400' : priority === 'high' ? 'text-orange-400' : 'text-amber-400'}`
  
  switch (type) {
    case 'tender_created':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      )
    case 'bid_submitted':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      )
    case 'bid_evaluated':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.25-4.5c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0117.25 18.75h-10.5A2.25 2.25 0 014.5 16.5V6.108c0-1.135.845-2.098 1.976-2.192.374-.03.748-.057 1.124-.08M15 12.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'tender_closed':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      )
  }
}

const NotificationItem = ({ notification, onMarkRead, onDelete, onNavigate }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleMarkRead = async () => {
    if (!notification.read) {
      await onMarkRead(notification._id)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(notification._id)
  }

  const handleClick = () => {
    handleMarkRead()
    if (notification.actionUrl) {
      onNavigate(notification.actionUrl)
    }
  }

  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.01] ${
        notification.read 
          ? 'bg-white/5 border-white/10' 
          : 'bg-amber-900/20 border-amber-500/30'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <NotificationIcon type={notification.type} priority={notification.priority} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold ${notification.read ? 'text-neutral-300' : 'text-amber-200'}`}>
              {notification.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {!notification.read && (
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                disabled={isDeleting}
                className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <p className={`text-sm mt-1 ${notification.read ? 'text-neutral-400' : 'text-neutral-300'}`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
            {notification.priority !== 'medium' && (
              <span className={`px-2 py-1 rounded-full ${
                notification.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                notification.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {notification.priority}
              </span>
            )}
          </div>
        </div>
      </div>
    </Motion.div>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'unread'
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/notifications?unread_only=${filter === 'unread'}`)
      if (res.data.success) {
        setNotifications(res.data.notifications)
        setUnreadCount(res.data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <PageNav title="Notifications" notifications={unreadCount} />

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg bg-white/10 text-neutral-300 hover:bg-white/20 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <h3 className="text-lg font-semibold text-neutral-400 mb-2">No notifications</h3>
              <p className="text-neutral-500">
                {filter === 'unread' ? 'All caught up!' : 'You don\'t have any notifications yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onDelete={deleteNotification}
                    onNavigate={navigate}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}