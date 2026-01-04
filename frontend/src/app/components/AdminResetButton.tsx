'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminResetButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        if (!confirm('정말로 모든 캐릭터 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/reset-data', {
                method: 'POST'
            })

            if (!res.ok) {
                const err = await res.text()
                throw new Error(err)
            }

            alert('모든 데이터가 삭제되었습니다.')
            router.refresh()
            window.location.reload() // Force reload to clear client states
        } catch (e: any) {
            console.error(e)
            alert('삭제 실패: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleReset}
            disabled={loading}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 9999,
                background: '#EF4444', // Red color for danger
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
            }}
        >
            <Trash2 size={18} />
            {loading ? '삭제 중...' : '전체 데이터 삭제'}
        </button>
    )
}
