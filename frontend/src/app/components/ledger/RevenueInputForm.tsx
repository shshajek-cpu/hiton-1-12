'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles, Sword, Coins, Plus } from 'lucide-react'
import styles from '../../ledger/LedgerPage.module.css'
import SmartAmountInput from './SmartAmountInput'
import { IncomeSection } from '@/types/ledger'

interface RevenueInputFormProps {
    sections: IncomeSection[]
    onAddRecord: (sectionId: string, amount: number, label: string) => void
    onDeleteRecord: (sectionId: string, recordId: string) => void
}

export default function RevenueInputForm({ sections, onAddRecord, onDeleteRecord }: RevenueInputFormProps) {
    const [expandedSectionId, setExpandedSectionId] = useState<string>('')
    const [inputs, setInputs] = useState<Record<string, string>>({})

    const handleInputChange = (sectionId: string, value: string) => {
        setInputs(prev => ({ ...prev, [sectionId]: value }))
    }

    const handleSubmit = (sectionId: string) => {
        const value = inputs[sectionId]
        if (!value) return

        const amount = parseInt(value, 10) * 10000 // Convert '150' to 1,500,000 as per UX "150만"
        if (isNaN(amount) || amount <= 0) return

        // Default label logic can be improved later (e.g. ask user or auto-increment)
        const count = sections.find(s => s.id === sectionId)?.records.length || 0
        const label = `${count + 1}회차`

        onAddRecord(sectionId, amount, label)
        setInputs(prev => ({ ...prev, [sectionId]: '' }))
    }

    const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
        if (e.key === 'Enter') {
            handleSubmit(sectionId)
        }
    }

    const getIcon = (id: string) => {
        switch (id) {
            case 'expedition': return <Sparkles size={18} />
            case 'transcend': return <Sword size={18} />
            case 'etc': return <Coins size={18} />
            default: return <Coins size={18} />
        }
    }

    const formatKina = (value: number) => value.toLocaleString('ko-KR')
    const formatMan = (value: number) => `${Math.floor(value / 10000).toLocaleString('ko-KR')}만`

    return (
        <section className={styles.incomeSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2>콘텐츠 수입</h2>
                    <p>카테고리별로 오늘 수입을 바로 입력하세요.</p>
                </div>
                <div className={styles.sectionBadge}>
                    <Sparkles size={16} />
                    하이라이트
                </div>
            </div>

            <div className={styles.incomeCards}>
                {sections.map((section) => {
                    const isExpanded = expandedSectionId === section.id
                    const icon = getIcon(section.id)

                    return (
                        <div key={section.id} className={styles.incomeCard}>
                            <div className={styles.incomeCardHeader}>
                                <div className={styles.incomeSummary}>
                                    <div className={styles.incomeIcon}>{icon}</div>
                                    <div>
                                        <div className={styles.incomeTitle}>{section.title}</div>
                                        <div className={styles.incomeTotal}>키나 {formatKina(section.total)}</div>
                                    </div>
                                </div>
                                <div className={styles.incomeInputWrapper}>
                                    <div className={styles.incomeInput}>
                                        <SmartAmountInput
                                            value={inputs[section.id] || ''}
                                            onChange={(val) => handleInputChange(section.id, val)}
                                            placeholder="+ 금액"
                                        />
                                    </div>
                                    <button
                                        className={styles.btnAddRecord}
                                        onClick={() => handleSubmit(section.id)}
                                        disabled={!inputs[section.id]}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className={`${styles.expandButton} ${isExpanded ? styles.expandButtonActive : ''}`}
                                    onClick={() => setExpandedSectionId(isExpanded ? '' : section.id)}
                                    aria-label="수입 기록 펼치기"
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                            <div className={`${styles.incomeRecords} ${isExpanded ? styles.incomeRecordsOpen : ''}`}>
                                <div className={styles.recordList}>
                                    {section.records.length === 0 ? (
                                        <div className={styles.emptyRecord}>기록이 없습니다</div>
                                    ) : (
                                        section.records.map((record) => (
                                            <div key={record.id} className={styles.recordRow}>
                                                <div className={styles.recordLabel}>{record.label}</div>
                                                <div className={styles.recordAmount}>+{formatMan(record.amount)}</div>
                                                <div className={styles.recordTime}>{record.timeAgo}</div>
                                                <button
                                                    type="button"
                                                    className={styles.recordDelete}
                                                    onClick={() => onDeleteRecord(section.id, record.id)}
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
