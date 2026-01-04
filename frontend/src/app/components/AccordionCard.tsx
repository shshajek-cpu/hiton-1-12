'use client'
import { useState } from 'react'

interface AccordionCardProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    icon?: React.ReactNode
}

export default function AccordionCard({ title, children, defaultOpen = false, icon }: AccordionCardProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div style={{
            background: '#111318',
            border: '1px solid #1F2433',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header / Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isOpen ? '#161B22' : 'transparent',
                    borderBottom: isOpen ? '1px solid #1F2433' : 'none',
                    transition: 'background 0.2s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {icon && <span style={{ color: '#9CA3AF' }}>{icon}</span>}
                    <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        color: '#E5E7EB',
                        margin: 0
                    }}>
                        {title}
                    </h3>
                </div>

                {/* Arrow Icon */}
                <div style={{
                    color: '#9CA3AF',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>

            {/* Content Body */}
            <div style={{
                maxHeight: isOpen ? '2000px' : '0px',
                opacity: isOpen ? 1 : 0,
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
