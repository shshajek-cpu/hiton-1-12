import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing')
    }
    supabase = createClient(supabaseUrl, supabaseKey)
  }
  return supabase
}

export async function POST(request: NextRequest) {
  try {
    const db = getSupabase()
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await db.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nickname } = await request.json()

    if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
    }

    const trimmedNickname = nickname.trim()

    if (trimmedNickname.length > 20) {
      return NextResponse.json({ error: 'Nickname too long (max 20 characters)' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await db
      .from('ledger_users')
      .select('id, nickname')
      .eq('auth_user_id', user.id)
      .single()

    if (existingUser) {
      // Update existing user's nickname
      const { error: updateError } = await db
        .from('ledger_users')
        .update({
          nickname: trimmedNickname,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id)

      if (updateError) {
        console.error('Update nickname error:', updateError)
        return NextResponse.json({ error: 'Failed to update nickname' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        nickname: trimmedNickname,
        isNew: false
      })
    } else {
      // Create new user with nickname
      const { data: newUser, error: insertError } = await db
        .from('ledger_users')
        .insert({
          auth_user_id: user.id,
          nickname: trimmedNickname
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert user error:', insertError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        nickname: trimmedNickname,
        isNew: true,
        userId: newUser.id
      })
    }
  } catch (error: any) {
    console.error('Nickname API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getSupabase()
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await db.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's nickname
    const { data: ledgerUser } = await db
      .from('ledger_users')
      .select('nickname')
      .eq('auth_user_id', user.id)
      .single()

    return NextResponse.json({
      nickname: ledgerUser?.nickname || null
    })
  } catch (error: any) {
    console.error('Get nickname error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
