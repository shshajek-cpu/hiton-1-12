'use client'

import { useEffect } from 'react'
import DailyContentCard from './DailyContentCard'
import { useDailyContent } from '../hooks/useDailyContent'
import styles from './DailyContentSection.module.css'

interface DailyContentSectionProps {
  characterId: string | null
  selectedDate: string
  getAuthHeader: () => Record<string, string>
  baseTickets?: {
    daily_dungeon: number
    awakening: number
    nightmare: number
    dimension: number
    subjugation: number
  }
  bonusTickets?: {
    daily_dungeon: number
    awakening: number
    nightmare: number
    dimension: number
    subjugation: number
  }
  onBaseTicketsChange?: (updates: Record<string, number>) => void
  onBonusTicketsChange?: (updates: Record<string, number>) => void
}

export default function DailyContentSection({
  characterId,
  selectedDate,
  getAuthHeader,
  baseTickets = {
    daily_dungeon: 7,
    awakening: 3,
    nightmare: 14,
    dimension: 14,
    subjugation: 3
  },
  bonusTickets = {
    daily_dungeon: 0,
    awakening: 0,
    nightmare: 0,
    dimension: 0,
    subjugation: 0
  },
  onBaseTicketsChange,
  onBonusTicketsChange
}: DailyContentSectionProps) {
  const { contents, loading, error, handleIncrement, handleDecrement, updateRemainingCounts } = useDailyContent(characterId, selectedDate, getAuthHeader)

  // baseTickets = 잔여 횟수, 초기설정에서 받은 값으로 completionCount 동기화
  useEffect(() => {
    updateRemainingCounts({
      daily_dungeon: baseTickets.daily_dungeon,
      awakening_battle: baseTickets.awakening,
      nightmare: baseTickets.nightmare,
      dimension_invasion: baseTickets.dimension,
      subjugation: baseTickets.subjugation
    })
  }, [baseTickets, updateRemainingCounts])

  // 보너스 티켓이 적용된 컨텐츠 목록
  const contentsWithBonus = contents.map(content => {
    const bonusMap: Record<string, number> = {
      '일일던전': bonusTickets.daily_dungeon,
      '각성전': bonusTickets.awakening,
      '악몽': bonusTickets.nightmare,
      '차원침공': bonusTickets.dimension,
      '토벌전': bonusTickets.subjugation
    }

    return {
      ...content,
      bonusCount: bonusMap[content.name] || 0
    }
  })

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.loading}>주간 컨텐츠 정보를 불러오는 중...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.error}>{error}</div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {contentsWithBonus.map((content) => (
          <DailyContentCard
            key={content.id}
            content={content}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ))}
      </div>
    </section>
  )
}
