'use client'
import { useState, useMemo } from 'react'
import { aggregateStats } from '../../lib/statsAggregator'
import StatTooltip from './StatTooltip'
import type { StatCategory } from '../../types/stats'

interface StatsSummaryViewProps {
  stats: any
  equipment: any[]
  daevanion: any
  titles: any
}

const CATEGORY_TABS: { id: StatCategory, label: string, icon: string }[] = [
  { id: 'all', label: '전체', icon: '📊' },
  { id: 'attack', label: '공격', icon: '⚔️' },
  { id: 'defense', label: '방어', icon: '🛡️' },
  { id: 'critical', label: '치명', icon: '⚡' },
  { id: 'utility', label: '유틸', icon: '✨' },
]

export default function StatsSummaryView({ stats, equipment, daevanion, titles }: StatsSummaryViewProps) {
  const [activeCategory, setActiveCategory] = useState<StatCategory>('all')

  // 스탯 집계
  const aggregatedStats = useMemo(() => {
    return aggregateStats(equipment, titles, daevanion, stats)
  }, [equipment, titles, daevanion, stats])

  // 카테고리별 필터링
  const filteredStats = useMemo(() => {
    if (activeCategory === 'all') {
      return aggregatedStats
    }
    return aggregatedStats.filter(stat => stat.category === activeCategory)
  }, [aggregatedStats, activeCategory])

  return (
    <div style={{
      background: '#111318',
      border: '1px solid #1F2433',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      height: 'auto', // 고정 높이 제거
      overflow: 'hidden'
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #1F2433',
        background: '#0B0D12',
        color: '#E5E7EB',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>📊 능력치 통합 뷰</span>
        <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 'normal' }}>
          총 {filteredStats.length}개
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.5rem',
        borderBottom: '1px solid #1F2433',
        background: '#0A0C10',
        flexShrink: 0,
        overflowX: 'auto'
      }}>
        {CATEGORY_TABS.map(tab => {
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              style={{
                padding: '0.35rem 0.75rem',
                background: isActive
                  ? 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)'
                  : 'transparent',
                color: isActive ? '#FFFFFF' : '#9CA3AF',
                border: isActive ? '1px solid #3B82F6' : '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: isActive ? '600' : 'normal',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#1F2433'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 스탯 리스트 - 3열 그리드 (컴팩트) */}
      <div style={{
        padding: '0.75rem',
        background: '#0F1116'
      }}>
        {filteredStats.length === 0 ? (
          <div style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            color: '#6B7280',
            fontSize: '0.85rem'
          }}>
            데이터 없음
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // 3열
            gap: '0.5rem',
            alignContent: 'start'
          }}>
            {filteredStats.map(stat => (
              <StatTooltip key={stat.name} stat={stat}>
                <div
                  style={{
                    background: '#1A1D26',
                    borderRadius: '4px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem',
                    border: '1px solid #2D3748',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#252936'
                    e.currentTarget.style.borderColor = '#4B5563'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1A1D26'
                    e.currentTarget.style.borderColor = '#2D3748'
                  }}
                >
                  {/* 라벨 */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <div style={{
                      width: '3px',
                      height: '10px',
                      background: stat.color,
                      borderRadius: '1px'
                    }} />
                    {stat.name}
                  </div>

                  {/* 값 */}
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#F3F4F6',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.25rem'
                  }}>
                    {stat.totalValue.toLocaleString()}
                    {stat.totalPercentage > 0 && (
                      <span style={{ fontSize: '0.7rem', color: stat.color }}>
                        (+{stat.totalPercentage.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              </StatTooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
