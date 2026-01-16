'use client'

import { useState, useEffect } from 'react'
import { useMyCharacters } from '@/hooks/useMyCharacters'
import type { PartySlot, PartyUserCharacter } from '@/types/party'
import { SERVERS } from '@/app/constants/servers'
import styles from './ApplyModal.module.css'

interface ApplyModalProps {
  slot: PartySlot
  minItemLevel?: number
  minBreakthrough?: number
  minCombatPower?: number
  onClose: () => void
  onApply: (data: {
    slot_id: string
    character_name: string
    character_class: string
    character_server_id: number
    character_level?: number
    character_item_level?: number
    character_breakthrough?: number
    character_combat_power?: number
    apply_message?: string
  }) => Promise<void>
}

export default function ApplyModal({
  slot,
  minItemLevel,
  minBreakthrough,
  minCombatPower,
  onClose,
  onApply
}: ApplyModalProps) {
  const { characters, loading } = useMyCharacters()
  const [selectedCharacter, setSelectedCharacter] = useState<PartyUserCharacter | null>(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 슬롯 직업에 맞는 캐릭터 필터링
  const eligibleCharacters = characters.filter(char => {
    // 직업 조건
    if (slot.required_class && char.character_class !== slot.required_class) {
      return false
    }
    // 스펙 조건
    if (minItemLevel && char.character_item_level && char.character_item_level < minItemLevel) {
      return false
    }
    if (minBreakthrough && char.character_breakthrough && char.character_breakthrough < minBreakthrough) {
      return false
    }
    if (minCombatPower && char.character_combat_power && char.character_combat_power < minCombatPower) {
      return false
    }
    return true
  })

  useEffect(() => {
    if (eligibleCharacters.length === 1) {
      setSelectedCharacter(eligibleCharacters[0])
    }
  }, [eligibleCharacters])

  const handleSubmit = async () => {
    if (!selectedCharacter) {
      setError('캐릭터를 선택해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await onApply({
        slot_id: slot.id,
        character_name: selectedCharacter.character_name,
        character_class: selectedCharacter.character_class,
        character_server_id: selectedCharacter.character_server_id,
        character_level: selectedCharacter.character_level,
        character_item_level: selectedCharacter.character_item_level,
        character_breakthrough: selectedCharacter.character_breakthrough,
        character_combat_power: selectedCharacter.character_combat_power,
        apply_message: applyMessage || undefined
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '신청에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>파티 신청</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.slotInfo}>
            <span className={styles.label}>신청 슬롯:</span>
            <span className={styles.value}>
              슬롯{slot.slot_number} [{slot.required_class || '자유'}]
            </span>
          </div>

          {(minItemLevel || minBreakthrough || minCombatPower) && (
            <div className={styles.requirements}>
              <span className={styles.label}>최소 조건:</span>
              <span className={styles.value}>
                {minItemLevel && `아이템${minItemLevel}+`}
                {minBreakthrough && ` 돌파${minBreakthrough}+`}
                {minCombatPower && ` 전투력${(minCombatPower / 10000).toFixed(0)}만+`}
              </span>
            </div>
          )}

          <div className={styles.characterSelect}>
            <label className={styles.label}>캐릭터 선택</label>
            {loading ? (
              <p className={styles.loading}>불러오는 중...</p>
            ) : eligibleCharacters.length === 0 ? (
              <p className={styles.noCharacter}>
                {characters.length === 0
                  ? '등록된 캐릭터가 없습니다. 먼저 캐릭터를 등록해주세요.'
                  : slot.required_class
                    ? `조건에 맞는 ${slot.required_class} 캐릭터가 없습니다.`
                    : '조건에 맞는 캐릭터가 없습니다.'
                }
              </p>
            ) : (
              <div className={styles.characterList}>
                {eligibleCharacters.map(char => {
                  const serverName = SERVERS.find(s => s.id === String(char.character_server_id))?.name || ''
                  return (
                    <button
                      key={char.id}
                      className={`${styles.characterOption} ${selectedCharacter?.id === char.id ? styles.selected : ''}`}
                      onClick={() => setSelectedCharacter(char)}
                    >
                      <div className={styles.charMain}>
                        {char.character_class} Lv{char.character_level} | {serverName} {char.character_name}
                      </div>
                      <div className={styles.charStats}>
                        {char.character_item_level && `아이템${char.character_item_level}`}
                        {char.character_breakthrough && ` 돌파${char.character_breakthrough}`}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className={styles.messageInput}>
            <label className={styles.label}>신청 메시지 (선택)</label>
            <textarea
              className={styles.textarea}
              placeholder="파티장에게 전달할 메시지를 입력하세요"
              value={applyMessage}
              onChange={e => setApplyMessage(e.target.value)}
              rows={2}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!selectedCharacter || submitting}
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
