import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { AionCharacterInfoResponse, AionCharacterEquipmentResponse, DbCharacter } from '../_shared/types.ts'

const CACHE_TTL_SECONDS = 300; // 5분

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { characterId, serverId, forceRefresh } = await req.json()

        if (!characterId || !serverId) {
            throw new Error('characterId and serverId are required')
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. Check cache (unless forceRefresh is true)
        if (!forceRefresh) {
            const { data: cachedData, error: cacheError } = await supabase
                .from('characters')
                .select('*')
                .eq('character_id', characterId)
                .single()

            if (cachedData) {
                const updatedAt = new Date(cachedData.scraped_at).getTime()
                const now = new Date().getTime()
                const diffSeconds = (now - updatedAt) / 1000

                if (diffSeconds < CACHE_TTL_SECONDS) {
                    console.log(`Cache hit for ${characterId}`)
                    return new Response(
                        JSON.stringify(cachedData),
                        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
                    )
                } else {
                    console.log(`Cache expired for ${characterId}`)
                }
            }
        }

        // 2. Fetch from External API
        console.log(`Fetching from AION2 API for ${characterId}`)
        const infoUrl = `https://aion2.plaync.com/api/character/info?lang=ko&characterId=${characterId}&serverId=${serverId}`
        const equipUrl = `https://aion2.plaync.com/api/character/equipment?lang=ko&characterId=${characterId}&serverId=${serverId}`

        const [infoRes, equipRes] = await Promise.all([
            fetch(infoUrl),
            fetch(equipUrl)
        ])

        if (!infoRes.ok || !equipRes.ok) {
            throw new Error('Failed to fetch character data from Aion server')
        }

        const infoData: AionCharacterInfoResponse = await infoRes.json()
        const equipData: AionCharacterEquipmentResponse = await equipRes.json()

        // 3. Transform and Upsert to DB
        const dbCharacter: DbCharacter = {
            character_id: infoData.profile.characterId,
            server_id: infoData.profile.serverId,
            name: infoData.profile.characterName,
            level: infoData.profile.characterLevel,
            class_name: infoData.profile.className,
            race_name: infoData.profile.raceName,
            combat_power: 0, // Calculate or extract if available, otherwise default
            profile_image: infoData.profile.profileImage,

            profile: infoData.profile,
            stats: infoData.stat,
            titles: infoData.title,
            rankings: infoData.ranking,
            daevanion: infoData.daevanion,
            equipment: equipData.equipment,
            skills: equipData.skill,
            pet_wing: equipData.petwing,

            scraped_at: new Date().toISOString()
        }

        const { data: savedData, error: upsertError } = await supabase
            .from('characters')
            .upsert(dbCharacter, { onConflict: 'character_id' })
            .select()
            .single()

        if (upsertError) {
            console.error('Upsert error:', upsertError)
            throw new Error('Failed to save character data')
        }

        return new Response(
            JSON.stringify(savedData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error(error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
