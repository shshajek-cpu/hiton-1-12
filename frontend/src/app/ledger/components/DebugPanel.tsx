'use client'

import { useState, useEffect, useRef } from 'react'

interface DebugPanelProps {
  baseTickets: Record<string, number>
  bonusTickets: Record<string, number>
  odEnergy: {
    timeEnergy: number
    ticketEnergy: number
  }
  characterId: string | null
}

export default function DebugPanel({
  baseTickets,
  bonusTickets,
  odEnergy,
  characterId
}: DebugPanelProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const logRef = useRef<string[]>([])

  // 로그 추가 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    logRef.current = [...logRef.current.slice(-50), logMessage]
    setLogs([...logRef.current])
  }

  // props 변경 감지
  useEffect(() => {
    addLog(`baseTickets: ${JSON.stringify(baseTickets)}`)
  }, [JSON.stringify(baseTickets)])

  useEffect(() => {
    addLog(`bonusTickets: ${JSON.stringify(bonusTickets)}`)
  }, [JSON.stringify(bonusTickets)])

  useEffect(() => {
    addLog(`odEnergy: time=${odEnergy.timeEnergy}, ticket=${odEnergy.ticketEnergy}`)
  }, [odEnergy.timeEnergy, odEnergy.ticketEnergy])

  useEffect(() => {
    addLog(`characterId: ${characterId}`)
  }, [characterId])

  // 복사 함수
  const handleCopy = async () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      characterId,
      baseTickets,
      bonusTickets,
      odEnergy,
      logs: logRef.current
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      alert('Copied!')
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '10px',
          padding: '8px 12px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '12px'
        }}
      >
        Debug
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '10px',
        width: '350px',
        maxHeight: '400px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        fontSize: '11px'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #333',
        background: '#222'
      }}>
        <span style={{ color: '#facc15', fontWeight: 'bold' }}>Debug Panel</span>
        <div>
          <button
            onClick={handleCopy}
            style={{
              padding: '4px 8px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px',
              fontSize: '11px'
            }}
          >
            Copy
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '4px 8px',
              background: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            X
          </button>
        </div>
      </div>

      <div style={{ padding: '8px 12px', borderBottom: '1px solid #333' }}>
        <div style={{ color: '#888', marginBottom: '4px' }}>State:</div>
        <div style={{ color: '#4ade80' }}>charId: {characterId || 'null'}</div>
        <div style={{ color: '#60a5fa' }}>
          od: {odEnergy.timeEnergy}/{odEnergy.ticketEnergy}
        </div>
        <div style={{ color: '#f472b6', fontSize: '10px', wordBreak: 'break-all' }}>
          base: {JSON.stringify(baseTickets)}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px 12px',
        maxHeight: '200px'
      }}>
        <div style={{ color: '#888', marginBottom: '4px' }}>Logs:</div>
        {logs.map((log, i) => (
          <div key={i} style={{ color: '#ccc', marginBottom: '2px', fontSize: '10px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
