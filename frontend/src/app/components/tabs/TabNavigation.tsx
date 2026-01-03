'use client'

import styles from './TabNavigation.module.css'

interface Tab {
    id: string
    label: string
    icon: string
}

interface TabNavigationProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const tabs: Tab[] = [
        { id: 'recent', label: '홈', icon: '🏠' },
        { id: 'ranking', label: '랭킹', icon: '🏆' },
        { id: 'statistics', label: '통계', icon: '📊' },
        { id: 'tier', label: '티어', icon: '⭐' }
    ]

    return (
        <div className={styles.tabNavigation}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabLabel}>{tab.label}</span>
                </button>
            ))}
        </div>
    )
}
