import { useState, useEffect } from 'react'
import { LedgerCharacter } from '@/types/ledger'
import { debugLogger } from '@/utils/debugLogger'

export type LedgerRecordItem = {
    id: string
    item_name: string
    price: number
    count: number
    category: string
    created_at: string
}

const MAIN_CHARACTER_KEY = 'aion2_main_character'

export function useLedger() {
    const [deviceId, setDeviceId] = useState<string>('')
    const [characters, setCharacters] = useState<LedgerCharacter[]>([])
    const [activeCharacterId, setActiveCharacterId] = useState<string>('')
    const [dailyRecords, setDailyRecords] = useState<LedgerRecordItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Initialize Device ID
    useEffect(() => {
        let id = localStorage.getItem('ledger_device_id')
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem('ledger_device_id', id)
        }
        setDeviceId(id)
        debugLogger.info('[useLedger] Device ID initialized', { deviceId: id })

        // Register user
        fetch('/api/ledger/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: id })
        }).then(async (res) => {
            if (res.ok) {
                debugLogger.info('[useLedger] Init successful')
                await fetchCharacters(id!)
            } else {
                debugLogger.error('[useLedger] Init failed', { status: res.status })
                setIsLoading(false)
            }
        }).catch(e => {
            debugLogger.error('[useLedger] Init error', e)
            setIsLoading(false)
        })
    }, [])

    const fetchCharacters = async (devId: string) => {
        debugLogger.info('[useLedger] Fetching characters', { devId })
        try {
            const res = await fetch('/api/ledger/characters', {
                headers: { 'x-device-id': devId }
            })
            if (res.ok) {
                const data = await res.json()
                debugLogger.info('[useLedger] Fetched characters data', data)
                
                if (Array.isArray(data)) {
                    // Map DB snake_case to Frontend types
                    const mapped: LedgerCharacter[] = data.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        job: c.class_name || 'Unknown',
                        income: c.income || 0,
                        server: c.server_name
                    }))
                    setCharacters(mapped)

                    if (mapped.length > 0) {
                        if (!activeCharacterId) setActiveCharacterId(mapped[0].id)
                    } else {
                        debugLogger.info('[useLedger] No characters found. Checking localStorage...')
                        // If no characters, try to import from Main Character
                        const savedMain = localStorage.getItem(MAIN_CHARACTER_KEY)
                        debugLogger.info('[useLedger] LocalStorage Main Character:', savedMain)

                        if (savedMain) {
                            try {
                                const mainChar = JSON.parse(savedMain)
                                if (mainChar && mainChar.name) {
                                    // Robust field extraction
                                    const payload = { 
                                        name: mainChar.name, 
                                        class_name: mainChar.className || mainChar.job || mainChar.class_name || 'Unknown',
                                        server_name: mainChar.server || mainChar.serverName || mainChar.server_name || 'Unknown',
                                        is_main: true 
                                    }
                                    
                                    debugLogger.info('[useLedger] Auto-registering payload', payload)

                                    const addRes = await fetch('/api/ledger/characters', {
                                        method: 'POST',
                                        headers: { 
                                            'x-device-id': devId,
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(payload)
                                    })

                                    if (addRes.ok) {
                                        debugLogger.info('[useLedger] Auto-register successful')
                                        // Refetch to update state
                                        const retryRes = await fetch('/api/ledger/characters', {
                                            headers: { 'x-device-id': devId }
                                        })
                                        if (retryRes.ok) {
                                            const retryData = await retryRes.json()
                                            if (Array.isArray(retryData)) {
                                                const retryMapped = retryData.map((c: any) => ({
                                                    id: c.id,
                                                    name: c.name,
                                                    job: c.class_name || 'Unknown',
                                                    income: c.income || 0,
                                                    server: c.server_name
                                                }))
                                                setCharacters(retryMapped)
                                                if (retryMapped.length > 0) setActiveCharacterId(retryMapped[0].id)
                                            }
                                        }
                                    } else {
                                        const errText = await addRes.text()
                                        debugLogger.error('[useLedger] Auto-register failed', { status: addRes.status, body: errText })
                                    }
                                }
                            } catch (e) {
                                debugLogger.error('[useLedger] Failed to parse/import main character', e)
                            }
                        }
                    }
                } else {
                    debugLogger.error('[useLedger] Data is not an array', data)
                }
            } else {
                debugLogger.error('[useLedger] Fetch characters failed', { status: res.status })
            }
        } catch (e) {
            debugLogger.error('[useLedger] Error in fetchCharacters', e)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch records when active character changes
    useEffect(() => {
        if (!activeCharacterId) return
        
        const date = new Date().toISOString().split('T')[0]
        fetch(`/api/ledger/records?characterId=${activeCharacterId}&date=${date}`)
            .then(res => res.json())
            .then(data => {
                setDailyRecords(data.ledger_record_items || [])
            })
    }, [activeCharacterId])

    const addCharacter = async (name: string, className: string) => {
        if (!deviceId) return
        const res = await fetch('/api/ledger/characters', {
            method: 'POST',
            headers: { 
                'x-device-id': deviceId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, class_name: className, is_main: characters.length === 0 })
        })
        if (res.ok) {
            fetchCharacters(deviceId)
        }
    }

    const addEntry = async (category: string, itemName: string, price: number, count: number = 1) => {
        if (!deviceId || !activeCharacterId) return

        const date = new Date().toISOString().split('T')[0]
        const res = await fetch('/api/ledger/records/entry', {
            method: 'POST',
            headers: { 
                'x-device-id': deviceId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characterId: activeCharacterId,
                date,
                category,
                itemName,
                price,
                count
            })
        })

        if (res.ok) {
            const newItem = await res.json()
            setDailyRecords(prev => [newItem, ...prev])
            // Update character income locally for immediate feedback
            setCharacters(prev => prev.map(c => {
                if (c.id === activeCharacterId) {
                    return { ...c, income: (c.income || 0) + (price * count) }
                }
                return c
            }))
        }
    }

    const deleteEntry = async (id: string, price: number) => {
        const res = await fetch(`/api/ledger/records/entry?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            setDailyRecords(prev => prev.filter(r => r.id !== id))
            setCharacters(prev => prev.map(c => {
                if (c.id === activeCharacterId) {
                    return { ...c, income: Math.max(0, (c.income || 0) - price) }
                }
                return c
            }))
        }
    }

    return {
        characters,
        activeCharacterId,
        setActiveCharacterId,
        dailyRecords,
        isLoading,
        addCharacter,
        addEntry,
        deleteEntry
    }
}
