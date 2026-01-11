import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const { device_id } = await request.json()

    if (!device_id) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 })
    }

    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('ledger_users')
      .select('id')
      .eq('device_id', device_id)
      .single()

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is 'not found'
      throw findError
    }

    if (existingUser) {
      // Update last_seen_at
      await supabase
        .from('ledger_users')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', existingUser.id)
      
      return NextResponse.json({ success: true, user_id: existingUser.id })
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('ledger_users')
      .insert({ device_id })
      .select('id')
      .single()

    if (createError) throw createError

    return NextResponse.json({ success: true, user_id: newUser.id })
  } catch (error) {
    console.error('Init ledger user error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
