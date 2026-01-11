'use client'

import { useState } from 'react'
import { Gem, Search, Plus } from 'lucide-react'
import styles from '../../ledger/LedgerPage.module.css'
import { ItemSale } from '@/types/ledger'
import SmartAmountInput from './SmartAmountInput'

interface ItemSalesSectionProps {
    items: ItemSale[]
    onSearchItem: (query: string) => void
    onAddItem: (name: string, price: number) => void
}

export default function ItemSalesSection({ items, onSearchItem, onAddItem }: ItemSalesSectionProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [priceInput, setPriceInput] = useState('')

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        onSearchItem(query)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsAdding(true)
        }
    }

    const handleAddConfirm = () => {
        if (!searchQuery.trim() || !priceInput) return
        
        const price = parseInt(priceInput, 10) * 10000
        if (price > 0) {
            onAddItem(searchQuery, price)
            setSearchQuery('')
            setPriceInput('')
            setIsAdding(false)
        }
    }

    const formatKina = (value: number) => value.toLocaleString('ko-KR')

    return (
        <section className={styles.salesSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2>아이템 판매</h2>
                    <p>아이템 이름을 검색하고 엔터를 눌러 판매를 기록하세요.</p>
                </div>
                <div className={styles.sectionBadgeAlt}>
                    <Gem size={16} />
                    인벤토리 뷰
                </div>
            </div>

            {/* Item Search Input */}
            <div className={styles.itemSearchWrapper}>
                <Search className={styles.itemSearchIcon} size={20} />
                <input
                    type="text"
                    className={styles.itemSearchInput}
                    placeholder="판매한 아이템 이름 입력 (엔터로 기록)..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    disabled={isAdding}
                />
                {isAdding && (
                    <div className={styles.priceInputPopup}>
                        <input
                            type="number"
                            placeholder="금액 (만 키나)"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className={styles.miniPriceInput}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddConfirm()
                                if (e.key === 'Escape') setIsAdding(false)
                            }}
                        />
                        <button onClick={handleAddConfirm} className={styles.btnConfirm}>추가</button>
                    </div>
                )}
            </div>

            <div className={styles.salesGrid}>
                {items.length === 0 ? (
                    <div className={styles.emptyRecord} style={{ gridColumn: '1 / -1' }}>
                        판매 기록이 없습니다.
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className={styles.saleCard}>
                            <div className={styles.saleIcon}>{item.icon || <Gem size={30} />}</div>
                            <div className={styles.saleInfo}>
                                <div className={styles.saleName} title={item.name}>{item.name}</div>
                                <div className={styles.salePrice}>키나 {formatKina(item.price)}</div>
                                <div className={styles.saleTime}>{item.timeAgo}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}