import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { CharacterSearchResponse } from '../_shared/types.ts'

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, serverId, race, page = 1 } = await req.json()

        if (!name) {
            return new Response(
                JSON.stringify({ error: 'Character name is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const url = new URL('https://aion2.plaync.com/ko-kr/api/search/aion2/search/v2/character')
        url.searchParams.append('keyword', name)
        url.searchParams.append('page', page.toString())
        url.searchParams.append('size', '30')

        if (serverId) url.searchParams.append('serverId', serverId.toString())
        if (race) url.searchParams.append('race', race.toString())

        const response = await fetch(url.toString())

        if (!response.ok) {
            throw new Error(`AION2 API error: ${response.statusText}`)
        }

        const data: CharacterSearchResponse = await response.json()

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
