'use client'

interface Skill {
    name?: string
    skillName?: string
    itemName?: string
    icon?: string
    image?: string
    skillIcon?: string
    level?: number
    skillLevel?: number
    lv?: number
    lvl?: number
    description?: string
    desc?: string
    cooldown?: number
    [key: string]: any
}

interface SkillTooltipProps {
    skill: Skill
}

export default function SkillTooltip({ skill }: SkillTooltipProps) {
    if (!skill) return null

    // Image URL logic
    const iconUrl = skill.icon || skill.image || skill.skillIcon || ''
    const finalIconUrl = iconUrl.startsWith('http')
        ? iconUrl
        : iconUrl ? `https://cms-static.plaync.com${iconUrl}` : ''

    // Skill name with fallbacks
    const skillName = skill.name || skill.skillName || skill.itemName || '알 수 없는 스킬'

    // Skill level with fallbacks
    const skillLevel = skill.level || skill.skillLevel || skill.lv || skill.lvl || null

    // Description
    const description = skill.description || skill.desc || '설명 정보가 없습니다.'

    return (
        <div style={{
            position: 'absolute',
            top: 'calc(100% + 10px)', // Below the icon
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            background: 'rgba(15, 17, 23, 0.98)',
            border: '1px solid #FCD34D80',
            borderRadius: '8px',
            padding: '12px',
            zIndex: 10000,
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            pointerEvents: 'none', // Prevent tooltip from capturing mouse events
            textAlign: 'left'
        }}>
            {/* Arrow - pointing upward */}
            <div style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '10px',
                height: '10px',
                background: 'rgba(15, 17, 23, 0.98)',
                borderLeft: '1px solid #FCD34D80',
                borderTop: '1px solid #FCD34D80',
            }}></div>

            {/* Header Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '1px solid #1F2433',
                paddingBottom: '10px',
                marginBottom: '10px'
            }}>
                {/* Skill Icon */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#000',
                    border: '2px solid #FCD34D',
                    flexShrink: 0,
                    position: 'relative'
                }}>
                    {finalIconUrl ? (
                        <img
                            src={finalIconUrl}
                            alt={skillName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23374151"%3E%3Crect width="24" height="24" /%3E%3C/svg%3E'
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#374151' }} />
                    )}

                    {/* Level Badge */}
                    {skillLevel && (
                        <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: 'rgba(0, 0, 0, 0.9)',
                            color: '#FCD34D',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            border: '1px solid #FCD34D',
                            lineHeight: '1'
                        }}>
                            {skillLevel}
                        </div>
                    )}
                </div>

                {/* Skill Name & Level */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        color: '#FCD34D',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        lineHeight: '1.4'
                    }}>
                        {skillName}
                    </div>
                    {skillLevel && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#9CA3AF',
                            marginTop: '2px'
                        }}>
                            레벨 {skillLevel}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div style={{
                color: '#E5E7EB',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                marginBottom: skill.cooldown ? '10px' : '0'
            }}>
                {description}
            </div>

            {/* Cooldown (if available) */}
            {skill.cooldown && (
                <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #374151',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                }}>
                    <span style={{ color: '#9CA3AF' }}>쿨타임</span>
                    <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{skill.cooldown}초</span>
                </div>
            )}
        </div>
    )
}
