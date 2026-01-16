'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PartyNotification } from '@/types/party'

// device_id 헬퍼 (ledger_device_id 사용)
function getDeviceId(): string {
  let deviceId = localStorage.getItem('ledger_device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('ledger_device_id', deviceId)
  }
  return deviceId
}

export function useNotifications(autoFetch = true) {
  const [notifications, setNotifications] = useState<PartyNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (options?: { limit?: number; unreadOnly?: boolean }) => {
    setLoading(true)
    setError(null)

    try {
      const deviceId = getDeviceId()
      const params = new URLSearchParams()
      if (options?.limit) params.set('limit', String(options.limit))
      if (options?.unreadOnly) params.set('unread_only', 'true')

      const response = await fetch(`/api/notifications?${params.toString()}`, {
        headers: {
          'X-Device-ID': deviceId
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unread_count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications()
    }
  }, [autoFetch, fetchNotifications])

  // 읽음 처리
  const markAsRead = useCallback(async (notificationId: string) => {
    const deviceId = getDeviceId()
    const response = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId
      },
      body: JSON.stringify({ notification_id: notificationId })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to mark as read')
    }

    // 로컬 상태 업데이트
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    return response.json()
  }, [])

  // 모두 읽음 처리
  const markAllAsRead = useCallback(async () => {
    const deviceId = getDeviceId()
    const response = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId
      },
      body: JSON.stringify({ mark_all_read: true })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to mark all as read')
    }

    // 로컬 상태 업데이트
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)

    return response.json()
  }, [])

  // 알림 삭제
  const deleteNotification = useCallback(async (notificationId: string) => {
    const deviceId = getDeviceId()
    const response = await fetch(`/api/notifications?id=${notificationId}`, {
      method: 'DELETE',
      headers: {
        'X-Device-ID': deviceId
      }
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete notification')
    }

    // 로컬 상태 업데이트
    const deletedNotification = notifications.find(n => n.id === notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    if (deletedNotification && !deletedNotification.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }

    return response.json()
  }, [notifications])

  // 모든 알림 삭제
  const deleteAllNotifications = useCallback(async () => {
    const deviceId = getDeviceId()
    const response = await fetch('/api/notifications?all=true', {
      method: 'DELETE',
      headers: {
        'X-Device-ID': deviceId
      }
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete all notifications')
    }

    setNotifications([])
    setUnreadCount(0)

    return response.json()
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  }
}
