'use client'

import { useState } from 'react'
import styles from './PartyGuide.module.css'

export default function PartyGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        ℹ️ 파티찾기란?
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.intro}>
              🎯 파티찾기는 원하는 시간에 던전을 함께 할 파티원을 미리 모집하는 기능입니다.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>✅ 이런 분들에게 추천!</h4>
            <ul className={styles.list}>
              <li>퇴근 후 정해진 시간에 던전을 돌고 싶은 직장인</li>
              <li>랜덤 매칭 대신 스펙이 검증된 파티원을 원하는 분</li>
              <li>여러 회차를 한번에 약속잡고 싶은 분</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📝 사용 방법</h4>
            <ol className={styles.orderedList}>
              <li>상단에서 모집에 사용할 캐릭터를 등록하세요</li>
              <li>[파티 모집하기]로 원하는 조건의 파티를 만드세요</li>
              <li>신청이 오면 스펙을 확인하고 승인/거절하세요</li>
              <li>약속 시간에 모여서 던전을 클리어하세요!</li>
            </ol>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>⚠️ 주의사항</h4>
            <ul className={styles.list}>
              <li>노쇼(불참)는 다른 파티원에게 피해를 줍니다</li>
              <li>참여가 어려우면 미리 취소해주세요</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
