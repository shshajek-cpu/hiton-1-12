'use client'

import { useState } from 'react'
import styles from './PartyDebugPanel.module.css'

interface DebugSection {
  title: string
  data: unknown
  collapsed?: boolean
}

interface PartyDebugPanelProps {
  sections: DebugSection[]
  position?: 'bottom-right' | 'bottom-left'
}

export default function PartyDebugPanel({ sections, position = 'bottom-right' }: PartyDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  const copyAll = () => {
    const allData = sections.reduce((acc, section) => {
      acc[section.title] = section.data
      return acc
    }, {} as Record<string, unknown>)
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2))
    alert('전체 데이터 복사됨!')
  }

  const copySection = (title: string, data: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    alert(`${title} 복사됨!`)
  }

  return (
    <>
      {/* 디버그 토글 버튼 */}
      <button
        className={`${styles.toggleButton} ${styles[position]}`}
        onClick={() => setIsOpen(!isOpen)}
        title="디버그 패널"
      >
        🔧
      </button>

      {/* 디버그 패널 */}
      {isOpen && (
        <div className={`${styles.panel} ${styles[position]}`}>
          <div className={styles.header}>
            <span>🔧 Party Debug</span>
            <div className={styles.headerActions}>
              <button onClick={copyAll} title="전체 복사">📋</button>
              <button onClick={() => setIsOpen(false)}>×</button>
            </div>
          </div>

          <div className={styles.content}>
            {sections.map((section) => (
              <div key={section.title} className={styles.section}>
                <div
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.title)}
                >
                  <span>{expandedSections.has(section.title) ? '▼' : '▶'} {section.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copySection(section.title, section.data)
                    }}
                    title="복사"
                  >
                    📋
                  </button>
                </div>
                {expandedSections.has(section.title) && (
                  <pre className={styles.sectionContent}>
                    {JSON.stringify(section.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <span className={styles.timestamp}>
              {new Date().toLocaleTimeString('ko-KR')}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
