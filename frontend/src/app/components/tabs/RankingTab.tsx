'use client'

import { useRouter } from 'next/navigation'

export default function RankingTab() {
    const router = useRouter()

    const rankingTypes = [
        { id: 'noa', label: 'NOA 점수', icon: '⭐', path: '/ranking/noa' },
        { id: 'cp', label: '전투력', icon: '⚔️', path: '/ranking/cp' },
        { id: 'abyss', label: '어비스 포인트', icon: '🏆', path: '/ranking/content?type=abyss' }
    ]

    return (
        <div>
            <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '1.5rem'
            }}>
                🏆 랭킹 보기
            </h3>

            <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }}>
                {rankingTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => router.push(type.path)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '2rem 1.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'
                            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            {type.icon}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                            {type.label}
                        </div>
                    </button>
                ))}
            </div>

            <p style={{
                marginTop: '2rem',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '0.9rem'
            }}>
                원하는 랭킹을 선택하면 해당 페이지로 이동합니다
            </p>
        </div>
    )
}
