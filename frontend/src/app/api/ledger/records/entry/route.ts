import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  const device_id = request.headers.get('x-device-id')
  if (!device_id) return NextResponse.json({ error: 'Missing Device ID' }, { status: 401 })
  
  try {
    const body = await request.json()
    const { characterId, date, category, itemName, price, count } = body

    if (!characterId || !date || !category || !itemName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Find or Create Daily Record
    let recordId: string

    const { data: existingRecord } = await supabase
        .from('ledger_daily_records')
        .select('id')
        .eq('character_id', characterId)
        .eq('date', date)
        .single()
    
    if (existingRecord) {
        recordId = existingRecord.id
    } else {
        const { data: newRecord, error: createError } = await supabase
            .from('ledger_daily_records')
            .insert({
                character_id: characterId,
                date
            })
            .select('id')
            .single()
        
        if (createError) throw createError
        recordId = newRecord.id
    }

    // 2. Add Item Entry
    const { data: newItem, error: itemError } = await supabase
        .from('ledger_record_items')
        .insert({
            record_id: recordId,
            category,
            item_name: itemName,
            price: price || 0,
            count: count || 1
        })
        .select()
        .single()

    if (itemError) throw itemError

    return NextResponse.json(newItem)

  } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    const { error } = await supabase
        .from('ledger_record_items')
        .delete()
        .eq('id', id)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
