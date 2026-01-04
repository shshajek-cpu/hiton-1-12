import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { characterId, serverId, job, level, race, name } = body

        if (!characterId || !serverId || !job || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase Credentials')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. Sync Job (Upsert Data)
        // Since we are here, we have the authoritative Class Name from the Live Detail Page.
        // We should SAVE this user to the DB so they appear in Local Search (Global Search).

        console.log(`[SyncJob] Upserting ${name} (${characterId}) with class: ${job}`)

        const upsertData: any = {
            character_id: characterId,
            server_id: serverId,
            name: name,
            class_name: job,
            level: level || 55, // Default if missing
            race_name: race || 'Unknown',
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('characters')
            .upsert(upsertData, {
                onConflict: 'character_id',
                // We overwrite to ensure class_name is updated
            })

        if (error) {
            console.error('[SyncJob] Upsert failed:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Character synced successfully' })

    } catch (err: any) {
        console.error('[SyncJob] Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
