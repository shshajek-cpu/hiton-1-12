import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { AionCharacterInfoResponse, AionCharacterEquipmentResponse, DbCharacter, normalizeRaceName } from '../_shared/types.ts'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { characterId, serverId } = await req.json()

        if (!characterId || !serverId) {
            throw new Error('characterId and serverId are required')
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Unconditional Fetch from External API
        console.log(`Refreshing AION2 API data for ${characterId}`)
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

        // Transform and Upsert to DB
        const dbCharacter: DbCharacter = {
            character_id: infoData.profile.characterId,
            server_id: infoData.profile.serverId,
            name: infoData.profile.characterName,
            level: infoData.profile.characterLevel,
            class_name: infoData.profile.className,
            race_name: normalizeRaceName(infoData.profile.raceId, infoData.profile.raceName),
            combat_power: 0,
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
