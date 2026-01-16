'use client'

import { useState } from 'react'
import type { DungeonType, PartyStatus } from '@/types/party'
import styles from './PartyFilter.module.css'

interface PartyFilterProps {
  selectedType: DungeonType | 'all'
  selectedStatus: PartyStatus | 'all'
  onTypeChange: (type: DungeonType | 'all') => void
  onStatusChange: (status: PartyStatus | 'all') => void
}

const DUNGEON_TYPES: { value: DungeonType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'transcend', label: '초월' },
  { value: 'expedition', label: '원정' },
  { value: 'sanctuary', label: '성역' },
  { value: 'subjugation', label: '토벌전' },
  { value: 'pvp', label: 'PVP' }
]

export default function PartyFilter({
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange
}: PartyFilterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        {DUNGEON_TYPES.map(type => (
          <button
            key={type.value}
            className={`${styles.filterButton} ${selectedType === type.value ? styles.active : ''} ${type.value === 'pvp' ? styles.pvp : ''}`}
            onClick={() => onTypeChange(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
}
