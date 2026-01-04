'use client'
import { useEffect } from 'react'

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
    [key: string]: any
}

interface SkillDetailModalProps {
    skill: Skill | null
    onClose: () => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export default function SkillDetailModal({ skill, onClose, onMouseEnter, onMouseLeave }: SkillDetailModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

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
        <div
            onClick={onClose}
            onMouseLeave={onMouseLeave}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={onMouseEnter}
                style={{
                    background: '#111318',
                    border: '1px solid #1F2433',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        lineHeight: '1',
                        padding: '0.25rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#F3F4F6'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                    ×
                </button>

                {/* Skill Icon */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#000',
                        border: '2px solid #3B82F6',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
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
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(0, 0, 0, 0.9)',
                                color: '#FCD34D',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '2px solid #FCD34D',
                                lineHeight: '1'
                            }}>
                                Lv.{skillLevel}
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Name */}
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#E5E7EB',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    {skillName}
                </h3>

                {/* Skill Level (as text) */}
                {skillLevel && (
                    <div style={{
                        textAlign: 'center',
                        color: '#FCD34D',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem'
                    }}>
                        레벨 {skillLevel}
                    </div>
                )}

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: '#1F2433',
                    marginBottom: '1.5rem'
                }} />

                {/* Description */}
                <div style={{
                    color: '#9CA3AF',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                }}>
                    {description}
                </div>

                {/* Additional Info (if available) */}
                {skill.cooldown && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: '#1a1d24',
                        borderRadius: '8px',
                        border: '1px solid #2d3748'
                    }}>
                        <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                            쿨타임: <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{skill.cooldown}초</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
