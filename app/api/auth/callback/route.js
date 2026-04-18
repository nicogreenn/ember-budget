import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/?error=bank_connection_failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    // Exchange code for token with TrueLayer
    const tokenResponse = await fetch('https://auth.truelayer.com/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.TRUELAYER_CLIENT_ID,
        client_secret: process.env.TRUELAYER_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.access_token) {
      // Fetch transactions from TrueLayer
      const txnResponse = await fetch('https://api.truelayer.com/data/v1/transactions', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const txnData = await txnResponse.json()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (user && txnData.results) {
        // Save transactions to Supabase
        const transactions = txnData.results.map(t => ({
          user_id: user.id,
          name: t.description,
          amount: Math.abs(t.amount),
          category: 'Other',
          date: t.timestamp.slice(0, 10),
        }))

        await supabase.from('transactions').insert(transactions)
      }
    }

    return NextResponse.redirect(new URL('/?connected=true', request.url))
  } catch (err) {
    console.error('TrueLayer callback error:', err)
    return NextResponse.redirect(new URL('/?error=bank_connection_failed', request.url))
  }
}