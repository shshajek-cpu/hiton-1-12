'use client'

interface RankingItem {
    name: string
    rank: number
    value?: string | number
    extra?: string // Tier or Win Rate
}

interface RankingCardProps {
    rankings: {
        rankingList: any[]
    }
}

export default function RankingCard({ rankings }: RankingCardProps) {
    // Debug: Check the actual data structure
    // console.log('Ranking Data:', rankings)

    const list = rankings?.rankingList || []

    // Helper to find ranking by keywords
    const getRanking = (keywords: string[]): RankingItem | null => {
        const found = list.find(item => {
            const name = (item.categoryName || item.name || '').replace(/\s+/g, '')
            return keywords.some(k => name.includes(k))
        })

        if (!found) return null

        // Parse fields based on common API patterns
        // Note: Field names are guessed based on typical structure, might need adjustment
        const rank = found.rank || found.myRanking || 0

        let value = found.score || found.point || found.value
        if (typeof value === 'number') value = value.toLocaleString()

        // Construct extra info (Tier or Win Rate)
        let extra = ''
        if (found.tier || found.grade) {
            extra = found.tier || found.grade
        } else if (found.winCount !== undefined && found.playCount) {
            const rate = ((found.winCount / found.playCount) * 100).toFixed(1)
            extra = `${rate}%`
        }

        return {
            name: found.categoryName || found.name || keywords[0],
            rank,
            value,
            extra
        }
    }

    // Define the 7 requested rankings
    const rankingDefinitions = [
        { key: 'abyss', keywords: ['어비스', 'Abyss'], label: '어비스 포인트', iconColor: '#EF4444' },
        { key: 'transcendence', keywords: ['초월', 'Transcen'], label: '초월', iconColor: '#8B5CF6' },
        { key: 'nightmare', keywords: ['악몽', 'Nightmare'], label: '악몽', iconColor: '#6366F1' },
        { key: 'solitude', keywords: ['고독', 'Solitude'], label: '고독의 투기장', iconColor: '#F59E0B' },
        { key: 'cooperation', keywords: ['협력', 'Cooperation'], label: '협력의 투기장', iconColor: '#10B981' },
        { key: 'conquest', keywords: ['토벌', 'Conquest'], label: '토벌전', iconColor: '#EF4444' },
        { key: 'awakening', keywords: ['각성', 'Awaken'], label: '각성전', iconColor: '#3B82F6' },
    ]

    const dataToShow = rankingDefinitions.map(def => {
        const info = getRanking(def.keywords)
        return {
            ...def,
            info // can be null
        }
    })

    return (
        <div style={{
            background: '#111318',
            border: '1px solid #1F2433',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            width: '100%'
        }}>
            {/* Header */}
            <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#E5E7EB',
                margin: 0,
                marginBottom: '1.25rem'
            }}>
                랭킹 정보
            </h3>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dataToShow.map((item, idx) => (
                    <div key={item.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: '#0B0D12',
                        borderRadius: '8px',
                        border: '1px solid #1F2433'
                    }}>
                        {/* Wrapper for Left side */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* Icon Placeholder */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: `${item.iconColor}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${item.iconColor}40`
                            }}>
                                {/* Simple Dot for now, or replace with specific SVGs later */}
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.iconColor }}></div>
                            </div>

                            <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{item.label}</span>
                        </div>

                        {/* Right Side: Rank & Value */}
                        {item.info ? (
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#E5E7EB', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                    {item.info.rank > 0 ? `${item.info.rank}위` : '-'}
                                </div>
                                {(item.info.value || item.info.extra) && (
                                    <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '2px' }}>
                                        {item.info.value && <span>{item.info.value}</span>}
                                        {item.info.value && item.info.extra && <span style={{ margin: '0 4px' }}>|</span>}
                                        {item.info.extra && <span style={{ color: item.iconColor }}>{item.info.extra}</span>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span style={{ color: '#4B5563', fontSize: '0.85rem' }}>-</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
