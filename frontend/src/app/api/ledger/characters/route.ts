import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the service role key to bypass RLS
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceKey
)

export async function GET(request: Request) {
  const device_id = request.headers.get('x-device-id')
  if (!device_id) return NextResponse.json({ error: 'Missing Device ID' }, { status: 401 })

  const { data: user } = await supabase.from('ledger_users').select('id').eq('device_id', device_id).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: characters, error } = await supabase
    .from('ledger_characters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Calculate today's income
  const today = new Date().toISOString().split('T')[0]
  
  const characterIds = characters.map(c => c.id)
  if (characterIds.length > 0) {
      const { data: records } = await supabase
        .from('ledger_daily_records')
        .select(`
            character_id,
            ledger_record_items ( price, count )
        `)
        .in('character_id', characterIds)
        .eq('date', today)
      
      const incomeMap = new Map<string, number>()
      if (records) {
        records.forEach((rec: any) => {
            const total = rec.ledger_record_items?.reduce((sum: number, item: any) => sum + ((item.price || 0) * (item.count || 1)), 0) || 0
            incomeMap.set(rec.character_id, total)
        })
      }

      const result = characters.map(c => ({
          ...c,
          income: incomeMap.get(c.id) || 0
      }))
      return NextResponse.json(result)
  }

  return NextResponse.json(characters)
}

export async function POST(request: Request) {
  console.log('[API] POST characters - Checking Service Role Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  
  const device_id = request.headers.get('x-device-id')
  if (!device_id) return NextResponse.json({ error: 'Missing Device ID' }, { status: 401 })
  
  try {
    const body = await request.json()
    const { name, class_name, server_name, is_main } = body

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data: user } = await supabase.from('ledger_users').select('id').eq('device_id', device_id).single()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Use supabaseAdmin to bypass RLS during insert
    const { data, error } = await supabaseAdmin
        .from('ledger_characters')
        .insert({
            user_id: user.id,
            name,
            class_name: class_name || 'Unknown',
            server_name: server_name || 'Unknown', // Default to Unknown if not provided
            is_main: is_main || false
        })
        .select()
        .single()

    if (error) {
        console.error('[API] Insert failed:', error)
        throw error
    }
    return NextResponse.json(data)
  } catch (e: any) {
      console.error('[API] Create character error:', e)
      return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
