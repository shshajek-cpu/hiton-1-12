import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get('characterId')
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!characterId || !date) {
    return NextResponse.json({ error: 'Missing characterId or date' }, { status: 400 })
  }

  const { data: record, error } = await supabase
    .from('ledger_daily_records')
    .select(`
        id,
        character_id,
        date,
        ledger_record_items (
            id,
            item_name,
            count,
            price,
            category,
            created_at
        )
    `)
    .eq('character_id', characterId)
    .eq('date', date)
    .single()

  if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!record) {
      // Return empty structure if no record exists
      return NextResponse.json({
          id: null,
          character_id: characterId,
          date,
          ledger_record_items: []
      })
  }

  // Sort items by created_at desc
  if (record.ledger_record_items) {
      record.ledger_record_items.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }

  return NextResponse.json(record)
}
