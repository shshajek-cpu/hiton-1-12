'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PartyPost } from '@/types/party'

interface MyPartiesResponse {
  created: (PartyPost & { pending_count: number })[]
  joined: (PartyPost & { my_member: { id: string; slot_id: string; character_name: string; character_class: string; role: string } })[]
  pending: (PartyPost & { my_application: { id: string; slot_id: string; character_name: string; character_class: string; applied_at: string } })[]
  counts: {
    created: number
    joined: number
    pending: number
    total: number
  }
}

export function useMyParties() {
  const [data, setData] = useState<MyPartiesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMyParties = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // ledger_device_id 키 사용 (useMyCharacters와 동일)
      let deviceId = localStorage.getItem('ledger_device_id')
      if (!deviceId) {
        deviceId = crypto.randomUUID()
        localStorage.setItem('ledger_device_id', deviceId)
      }
      const response = await fetch('/api/party/my', {
        headers: {
          'X-Device-ID': deviceId
        }
      })

      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.error || 'Failed to fetch my parties')
      }

      const result: MyPartiesResponse = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMyParties()
  }, [fetchMyParties])

  return {
    created: data?.created || [],
    joined: data?.joined || [],
    pending: data?.pending || [],
    counts: data?.counts || { created: 0, joined: 0, pending: 0, total: 0 },
    loading,
    error,
    refresh: fetchMyParties
  }
}
