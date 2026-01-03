import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CLASSES } from '../../../constants/game-data'

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
                return true;
            })
            .map(char => ({
                character_id: decodeURIComponent(char.characterId), // Decode URL-encoded IDs
                server_id: char.server_id,
                name: cleanName(char.name),
                level: char.level,
                class_name: (() => {
                    const rawClass = char.job;
                    if (/[가-힣]/.test(rawClass)) return rawClass;
                    const matched = CLASSES.find(c => c.id === rawClass);
                    return matched ? matched.name : rawClass;
                })(),
                race_name: char.race,
                profile_image: char.imageUrl,
                updated_at: new Date().toISOString()
            }))

        // Perform Bulk Upsert
        // We use 'character_id' as the unique key to detect conflicts
        const { error } = await supabase
            .from('characters')
            .upsert(rowsToUpsert, {
                onConflict: 'character_id',
                ignoreDuplicates: true // Skip existing rows
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
