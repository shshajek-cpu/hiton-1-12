import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Define the structure of incoming data
interface SyncCharacter {
    characterId: string
    name: string
    server_id: number
    level: number
    job: string // class_name
    race: string // race_name
    imageUrl?: string
}

export async function POST(request: NextRequest) {
    try {
        const characters: SyncCharacter[] = await request.json()

        if (!characters || characters.length === 0) {
            return NextResponse.json({ message: 'No data provided' }, { status: 200 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase Credentials')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Helper to remove HTML tags (like <strong>)
        const cleanName = (name: string) => name.replace(/<\/?[^>]+(>|$)/g, "");

        // Map frontend data to DB schema with validation
        const rowsToUpsert = characters
            .filter(char => {
                // Validation: Skip characters with invalid data
                if (!char.level || char.level <= 0) {
                    console.warn(`Skipping character ${char.name}: invalid level (${char.level})`);
                    return false;
                }
                if (!char.characterId) {
                    console.warn(`Skipping character: missing characterId`);
                    return false;
                }
                if (char.job === 'Unknown' || char.job.startsWith('pcId:')) {
                    console.warn(`Skipping character ${char.name} due to invalid class: ${char.job}`);
                    return false;
                }
                return true;
            })
            .map(char => ({
                character_id: decodeURIComponent(char.characterId),
                server_id: char.server_id,
                name: cleanName(char.name),
                level: char.level,
                // class_name: supabaseApi.ts에서 이미 정확한 한글명으로 매핑해서 보냄
                class_name: char.job,
                race_name: char.race,
                profile_image: char.imageUrl,
                updated_at: new Date().toISOString()
            }))

        // Perform Bulk Upsert - only for NEW characters
        // Existing characters with class_name will not be overwritten
        const { error } = await supabase
            .from('characters')
            .upsert(rowsToUpsert, {
                onConflict: 'character_id',
                ignoreDuplicates: true // Skip existing rows entirely
            })

        if (error) {
            console.error('[Sync API] Upsert failed:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            count: rowsToUpsert.length,
            message: `Synced ${rowsToUpsert.length} characters`
        })

    } catch (err: any) {
        console.error('[Sync API] Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
