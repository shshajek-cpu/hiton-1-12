
const SUPABASE_PROJECT_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U'

export interface CharacterSearchResult {
    characterId: string
    name: string
    server: string
    server_id?: number // Added for detail fetch
    job: string
    level: number
    race: string
    imageUrl?: string
}

export const SERVER_NAME_TO_ID: Record<string, number> = {
    '시엘': 1,
    '이스라펠': 2,
    '트리니티': 3,
    '바이젤': 4,
    '네자칸': 1002, // Elyos server for Zikel group
    '지켈': 2002, // Asmodian server id (Zikel)
    '루미엘': 7, // Placeholder, need verification if possible but user only asked for Zikel fix primarily
    '유스티엘': 8,
    '마르쿠탄': 9,
    '카이시넬': 10,
    '에레슈키갈': 11,
    '셀렉트': 12,
    '윈드': 13
}

export interface CharacterDetail {
    character_id: string
    server_id: number
    name: string
    level: number
    class_name: string
    race_name: string
    combat_power: number
    profile_image: string
    stats: any
    equipment: any
    titles: any
    rankings: any
    daevanion: any
    created_at: string
    updated_at: string
}

export const supabaseApi = {
    /**
     * Search for a character by name.
     */
    async searchCharacter(name: string, serverId?: number, race?: string): Promise<CharacterSearchResult[]> {
        let allResults: CharacterSearchResult[] = []
        let page = 1

        while (true) {
            // Convert race string to ID if necessary
            let raceId: number | undefined
            if (race) {
                const r = race.toLowerCase()
                if (r === 'elyos' || r === '천족') raceId = 1
                else if (r === 'asmodian' || r === '마족') raceId = 2
                else if (!isNaN(Number(race))) raceId = Number(race)
            }

            const res = await fetch(`${SUPABASE_PROJECT_URL}/functions/v1/search-character`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, serverId, race: raceId, page })
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Search failed: ${errorText}`)
            }

            const data = await res.json()

            if (data && Array.isArray(data.list)) {
                const pageResults = data.list.map((item: any) => ({
                    characterId: item.characterId,
                    name: item.name,
                    server: item.serverName, // Map serverName to server
                    server_id: item.serverId, // Ensure this is passed
                    job: 'Unknown', // Search result might not have class
                    level: item.level,
                    race: item.race === 0 ? 'Elyos' : 'Asmodian',
                    imageUrl: item.profileImageUrl, // Include explicitly
                    // Store extra data that might be useful
                    raw: item
                }))
                allResults = [...allResults, ...pageResults]
            }

            // Check pagination
            if (data.pagination && data.pagination.page < data.pagination.endPage) {
                page++
            } else {
                break
            }

            // Safety break to prevent infinite loops if something goes wrong, though AION search results aren't usually massive for specific names
            if (page > 5) break
        }

        return allResults
    },

    /**
     * Get detailed character info.
     */
    async getCharacterDetail(characterId: string, serverId: number): Promise<CharacterDetail> {
        const res = await fetch(`${SUPABASE_PROJECT_URL}/functions/v1/get-character`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ characterId, serverId })
        })

        if (!res.ok) {
            // Handle cache miss or failures clearly
            const errorText = await res.text()
            throw new Error(`Get detail failed: ${errorText}`)
        }

        // Returns the DB row structure
        return await res.json()
    },

    /**
     * Force refresh character info.
     */
    async refreshCharacter(characterId: string, serverId: number): Promise<CharacterDetail> {
        const res = await fetch(`${SUPABASE_PROJECT_URL}/functions/v1/refresh-character`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ characterId, serverId })
        })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Refresh failed: ${errorText}`)
        }

        return await res.json()
    }
}
