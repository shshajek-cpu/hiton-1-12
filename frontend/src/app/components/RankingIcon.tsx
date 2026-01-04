interface RankingIconProps {
    type: 'abyss' | 'transcendence' | 'nightmare' | 'solitude' | 'cooperation' | 'conquest' | 'awakening'
    size?: number
}

export default function RankingIcon({ type, size = 24 }: RankingIconProps) {
    const icons = {
        // 어비스 - 보라색 크리스탈/별
        abyss: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9L12 2Z"
                    fill="url(#abyss-gradient)" stroke="#A855F7" strokeWidth="1.5" />
                <defs>
                    <linearGradient id="abyss-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 초월 - 빨간색 방패
        transcendence: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#trans-gradient)" stroke="#EF4444" strokeWidth="1.5" />
                <path d="M12 8V14M9 11L12 14L15 11" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                    <linearGradient id="trans-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#DC2626" />
                        <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 악몽 - 청록색 방패
        nightmare: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#night-gradient)" stroke="#06B6D4" strokeWidth="1.5" />
                <circle cx="12" cy="11" r="3" fill="#67E8F9" />
                <defs>
                    <linearGradient id="night-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 고독의 투기장 - 보라색 방패
        solitude: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#sol-gradient)" stroke="#8B5CF6" strokeWidth="1.5" />
                <path d="M12 7L14 11H10L12 7ZM12 13V15" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                    <linearGradient id="sol-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#6D28D9" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 협력의 투기장 - 파란색 방패
        cooperation: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#coop-gradient)" stroke="#3B82F6" strokeWidth="1.5" />
                <path d="M9 11L11 13L15 9" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="coop-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 토벌전 - 갈색 방패
        conquest: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#conq-gradient)" stroke="#D97706" strokeWidth="1.5" />
                <path d="M8 10L12 14L16 10M12 8V14" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                    <linearGradient id="conq-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        // 각성전 - 회색 방패
        awakening: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z"
                    fill="url(#awak-gradient)" stroke="#6B7280" strokeWidth="1.5" />
                <circle cx="12" cy="11" r="2" fill="#D1D5DB" />
                <defs>
                    <linearGradient id="awak-gradient" x1="12" y1="2" x2="12" y2="22">
                        <stop offset="0%" stopColor="#9CA3AF" />
                        <stop offset="100%" stopColor="#374151" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    }

    return icons[type] || null
}
