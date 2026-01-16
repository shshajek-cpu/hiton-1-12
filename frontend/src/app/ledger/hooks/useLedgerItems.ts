'use client'

import { useState, useEffect, useCallback } from 'react'
import { LedgerItem, CreateItemRequest, ItemCategory } from '@/types/ledger'

// 한국 시간 기준 게임 날짜 계산 (새벽 5시 기준)
function getKoreanGameDateTime(): string {
  const now = new Date()
  // 한국 시간으로 변환 (UTC+9)
  const koreaOffset = 9 * 60 // 분 단위
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
  const koreaTime = new Date(utcTime + (koreaOffset * 60000))

  // 새벽 5시 이전이면 전날 날짜 사용
  if (koreaTime.getHours() < 5) {
    koreaTime.setDate(koreaTime.getDate() - 1)
  }

  // ISO 형식으로 반환하되, 날짜는 게임 날짜 기준
  const year = koreaTime.getFullYear()
  const month = String(koreaTime.getMonth() + 1).padStart(2, '0')
  const day = String(koreaTime.getDate()).padStart(2, '0')
  const hours = String(koreaTime.getHours()).padStart(2, '0')
  const minutes = String(koreaTime.getMinutes()).padStart(2, '0')
  const seconds = String(koreaTime.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

interface UseLedgerItemsProps {
  getAuthHeader: () => Record<string, string>
  isReady: boolean
  characterId: string | null
  selectedDate?: string  // 선택한 날짜 (판매 수입 필터용)
}

export function useLedgerItems({ getAuthHeader, isReady, characterId, selectedDate }: UseLedgerItemsProps) {
  const [items, setItems] = useState<LedgerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ItemCategory | 'all'>('all')

  const fetchItems = useCallback(async () => {
    if (!characterId) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({ characterId })
      if (filter !== 'all') {
        params.append('category', filter)
      }

      const res = await fetch(`/api/ledger/items?${params}`, {
        headers: getAuthHeader()
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [characterId, filter, getAuthHeader])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (item: CreateItemRequest) => {
    console.log('[useLedgerItems] addItem called', { isReady, characterId, item })

    if (!isReady || !characterId) {
      console.log('[useLedgerItems] addItem skipped - not ready or no characterId')
      return null
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
      const body = {
        ...item,
        characterId
      }
      console.log('[useLedgerItems] POST /api/ledger/items', { headers, body })

      const res = await fetch('/api/ledger/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      console.log('[useLedgerItems] Response status:', res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('[useLedgerItems] Error response:', errorText)
        throw new Error(`Failed to add item: ${errorText}`)
      }

      const newItem = await res.json()
      console.log('[useLedgerItems] Item added successfully:', newItem)
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (e: any) {
      console.error('[useLedgerItems] addItem error:', e)
      setError(e.message)
      return null
    }
  }

  const updateItem = async (id: string, data: Partial<LedgerItem>) => {
    if (!isReady) return null

    try {
      const res = await fetch('/api/ledger/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ id, ...data })
      })

      if (!res.ok) {
        throw new Error('Failed to update item')
      }

      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === id ? updated : i))
      return updated
    } catch (e: any) {
      setError(e.message)
      return null
    }
  }

  const sellItem = async (id: string, soldPrice?: number) => {
    if (!isReady) return null

    try {
      const res = await fetch('/api/ledger/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          id,
          sold_price: soldPrice,
          sold_date: getKoreanGameDateTime()
        })
      })

      if (!res.ok) {
        throw new Error('Failed to update item')
      }

      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === id ? updated : i))
      return updated
    } catch (e: any) {
      setError(e.message)
      return null
    }
  }

  const unsellItem = async (id: string) => {
    if (!isReady) return null

    try {
      const res = await fetch('/api/ledger/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          id,
          sold_price: null,
          sold_date: null
        })
      })

      if (!res.ok) {
        throw new Error('Failed to unsell item')
      }

      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === id ? updated : i))
      return updated
    } catch (e: any) {
      setError(e.message)
      return null
    }
  }

  const deleteItem = async (id: string) => {
    if (!isReady) return false

    try {
      const res = await fetch(`/api/ledger/items?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })

      if (!res.ok) {
        throw new Error('Failed to delete item')
      }

      setItems(prev => prev.filter(i => i.id !== id))
      return true
    } catch (e: any) {
      setError(e.message)
      return false
    }
  }

  // 미판매 아이템만 필터
  const unsoldItems = items.filter(i => i.sold_price === null)

  // 판매완료 아이템만 필터
  const soldItems = items.filter(i => i.sold_price !== null)

  // 전체 판매 수입 합계
  const totalSoldIncome = soldItems.reduce((sum, i) => sum + (i.sold_price || 0), 0)

  // 선택한 날짜의 판매 수입 (sold_date 기준)
  const selectedDateSoldIncome = selectedDate
    ? soldItems
        .filter(i => i.sold_date?.split('T')[0] === selectedDate)
        .reduce((sum, i) => sum + (i.sold_price || 0), 0)
    : 0

  return {
    items,
    unsoldItems,
    soldItems,
    isLoading,
    error,
    filter,
    setFilter,
    addItem,
    updateItem,
    sellItem,
    unsellItem,
    deleteItem,
    totalSoldIncome,
    selectedDateSoldIncome,
    refetch: fetchItems
  }
}
