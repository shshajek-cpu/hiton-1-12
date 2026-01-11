'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock, Gem, UserPlus } from 'lucide-react'
import styles from './LedgerPage.module.css'
import RevenueInputForm from '../components/ledger/RevenueInputForm'
import ItemSalesSection from '../components/ledger/ItemSalesSection'
import { IncomeSection } from '@/types/ledger'
import { useLedger } from '@/hooks/useLedger'
import DebugPanel from '../components/DebugPanel'

const WEEKLY_TOTAL = 0 // Placeholder

const formatKina = (value: number) => value.toLocaleString('ko-KR')

const formatMan = (value: number) => `${Math.floor(value / 10000).toLocaleString('ko-KR')}만`

export default function LedgerPage() {
    const { 
        characters, 
        activeCharacterId, 
        setActiveCharacterId, 
        dailyRecords, 
        isLoading, 
        addCharacter, 
        addEntry, 
        deleteEntry 
    } = useLedger()
    
    const [displayedTotal, setDisplayedTotal] = useState(0)

    // Calculate totals
    const dailyTotal = useMemo(() => {
        return characters.reduce((sum, c) => sum + (c.income || 0), 0)
    }, [characters])

    useEffect(() => {
        setDisplayedTotal(dailyTotal)
    }, [dailyTotal])

    // Map dailyRecords to IncomeSection[]
    const incomeSections = useMemo(() => {
        const sections: IncomeSection[] = [
            { id: 'expedition', title: '원정대 수입', total: 0, records: [] },
            { id: 'transcend', title: '초월 콘텐츠', total: 0, records: [] },
            { id: 'etc', title: '기타 수입', total: 0, records: [] },
        ]
        
        dailyRecords.forEach(r => {
            if (r.category === 'item_sale') return
            const section = sections.find(s => s.id === r.category)
            if (section) {
                const amount = r.price * r.count
                section.total += amount
                section.records.push({
                    id: r.id,
                    label: r.item_name,
                    amount: amount,
                    timeAgo: '오늘'
                })
            }
        })
        return sections
    }, [dailyRecords])

    // Map dailyRecords to ItemSale[]
    const itemSales = useMemo(() => {
        return dailyRecords
            .filter(r => r.category === 'item_sale')
            .map(r => ({
                id: r.id,
                name: r.item_name,
                price: r.price * r.count,
                timeAgo: '오늘',
                date: r.created_at,
                icon: <Gem size={30} />
            }))
    }, [dailyRecords])
    
    const [filterQuery, setFilterQuery] = useState('')
    const filteredItemSales = useMemo(() => {
        if (!filterQuery) return itemSales
        return itemSales.filter(i => i.name.toLowerCase().includes(filterQuery.toLowerCase()))
    }, [itemSales, filterQuery])

    const handleAddRecord = (sectionId: string, amount: number, label: string) => {
        addEntry(sectionId, label, amount, 1)
    }

    const handleDeleteRecord = (sectionId: string, recordId: string) => {
        const rec = dailyRecords.find(r => r.id === recordId)
        if (rec) deleteEntry(recordId, rec.price * rec.count)
    }

    const handleAddItem = (name: string, price: number) => {
        addEntry('item_sale', name, price, 1)
    }

    const handleAddCharacter = () => {
        const name = prompt('추가할 캐릭터 이름을 입력하세요:')
        if (name) {
             const job = prompt('직업을 입력하세요 (예: 수호성, 살성):') || 'Unknown'
             addCharacter(name, job)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageInner}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.headerLabel}>일일 총 수입</span>
                        <div className={styles.headerTotal}>
                            <span className={styles.headerCurrency}>키나</span>
                            <span className={styles.headerValue}>{formatKina(displayedTotal)}</span>
                        </div>
                        <div className={styles.headerHint}>
                            오늘의 정산이 반영되었습니다
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.weeklyCard}>
                            <span className={styles.weeklyLabel}>주간 총 수입</span>
                            <span className={styles.weeklyValue}>{formatKina(WEEKLY_TOTAL)}</span>
                            <div className={styles.sparkline} />
                        </div>
                        <div className={styles.headerStatus}>
                            <Clock size={16} />
                            {isLoading ? '동기화 중...' : '동기화 완료'}
                        </div>
                    </div>
                </header>

                <div className={styles.contentGrid}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarTitle}>내 캐릭터 수입</div>
                        <div className={styles.sidebarList}>
                            {characters.map((character) => {
                                const isActive = activeCharacterId === character.id
                                return (
                                    <button
                                        key={character.id}
                                        className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''}`}
                                        onClick={() => setActiveCharacterId(character.id)}
                                        type="button"
                                    >
                                        <div className={styles.avatar}>
                                            <span>{character.name.slice(0, 1)}</span>
                                        </div>
                                        <div className={styles.sidebarInfo}>
                                            <div className={styles.sidebarName}>{character.name}</div>
                                            <div className={styles.sidebarJob}>{character.job}</div>
                                        </div>
                                        <div className={character.income > 0 ? styles.sidebarIncome : styles.sidebarIncomeMuted}>
                                            +{formatMan(character.income)}
                                        </div>
                                    </button>
                                )
                            })}
                            
                            <button 
                                className={`${styles.sidebarItem}`} 
                                onClick={handleAddCharacter}
                                style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}
                            >
                                <UserPlus size={18} />
                                <span>캐릭터 추가</span>
                            </button>
                        </div>
                    </aside>

                    <main className={styles.mainContent}>
                        {activeCharacterId ? (
                            <>
                                <RevenueInputForm
                                    sections={incomeSections}
                                    onAddRecord={handleAddRecord}
                                    onDeleteRecord={handleDeleteRecord}
                                />

                                <ItemSalesSection
                                    items={filteredItemSales}
                                    onSearchItem={setFilterQuery}
                                    onAddItem={handleAddItem}
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                <p>왼쪽 사이드바에서 캐릭터를 추가하여 가계부를 시작하세요.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <DebugPanel />
        </div>
    )
}
