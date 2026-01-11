import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const device_id = request.headers.get('x-device-id')
  if (!device_id) return NextResponse.json({ error: 'Missing Device ID' }, { status: 401 })

  const { data: user } = await supabase.from('ledger_users').select('id').eq('device_id', device_id).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await supabase
    .from('ledger_characters')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id) // Security check: ensure user owns the character

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
