'use client'

import { useState } from 'react'
import type { PartySlot, PartyMember } from '@/types/party'
import CharacterTooltip from './CharacterTooltip'
import styles from './SlotCard.module.css'

interface SlotCardProps {
  slot: PartySlot
  member?: PartyMember
  isLeader?: boolean
  canKick?: boolean
  canApply?: boolean
  onKick?: () => void
  onApply?: () => void
}

export default function SlotCard({
  slot,
  member,
  isLeader = false,
  canKick = false,
  canApply = false,
  onKick,
  onApply
}: SlotCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const classLabel = slot.required_class || '자유'
  const isFilled = slot.status === 'filled' && member

  return (
    <div className={`${styles.slot} ${isFilled ? styles.filled : styles.empty}`}>
      <div className={styles.header}>
        <span className={styles.slotNumber}>슬롯{slot.slot_number}</span>
        <span className={styles.classLabel}>[{classLabel}]</span>
      </div>

      {isFilled && member ? (
        <div
          className={styles.memberInfo}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className={styles.memberMain}>
            {member.role === 'leader' && <span className={styles.leaderBadge}>👑</span>}
            <span className={styles.memberClass}>{member.character_class}</span>
            <span className={styles.memberLevel}>Lv{member.character_level}</span>
            <span className={styles.memberName}>{member.character_name}</span>
          </div>

          <div className={styles.memberStats}>
            {member.character_item_level && (
              <span>아이템{member.character_item_level}</span>
            )}
            {member.character_breakthrough && (
              <span>돌파{member.character_breakthrough}</span>
            )}
            {member.character_combat_power && (
              <span>전투력{(member.character_combat_power / 10000).toFixed(1)}만</span>
            )}
          </div>

          {canKick && member.role !== 'leader' && (
            <button
              className={styles.kickButton}
              onClick={(e) => {
                e.preventDefault()
                onKick?.()
              }}
            >
              추방
            </button>
          )}

          {showTooltip && (
            <CharacterTooltip member={member} />
          )}
        </div>
      ) : (
        <div className={styles.emptySlot}>
          <span className={styles.emptyText}>빈자리</span>
          {canApply && (
            <button
              className={styles.applyButton}
              onClick={(e) => {
                e.preventDefault()
                onApply?.()
              }}
            >
              신청하기
            </button>
          )}
        </div>
      )}
    </div>
  )
}
