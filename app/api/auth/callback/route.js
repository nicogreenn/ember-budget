import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ember-budget.vercel.app'

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=bank_connection_failed', request.url))
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/callback`
    const clientId = process.env.TRUELAYER_CLIENT_ID
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET

    console.log('Attempting token exchange...')
    console.log('Client ID:', clientId)
    console.log('Redirect URI:', redirectUri)
    console.log('Code length:', code.length)

    const tokenResponse = await fetch('https://auth.truelayer.com/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenText = await tokenResponse.text()
    console.log('Token response status:', tokenResponse.status)
    console.log('Token response body:', tokenText)

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL(`/?error=token_failed&status=${tokenResponse.status}`, request.url))
    }

    const tokens = JSON.parse(tokenText)

    const accountsResponse = await fetch('https://api.truelayer.com/data/v1/accounts', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const accountsData = await accountsResponse.json()

    const allTransactions = []
    if (accountsData.results) {
      for (const account of accountsData.results) {
        const txnResponse = await fetch(
          `https://api.truelayer.com/data/v1/accounts/${account.account_id}/transactions`,
          { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        )
        const txnData = await txnResponse.json()
        if (txnData.results) {
          allTransactions.push(...txnData.results)
        }
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const tempToken = code.slice(0, 20)
    await supabase.from('pending_transactions').upsert({
      temp_token: tempToken,
      transactions: allTransactions,
      created_at: new Date().toISOString()
    })

    const redirectUrl = new URL('/', baseUrl)
    redirectUrl.searchParams.set('connected', 'true')
    redirectUrl.searchParams.set('token', tempToken)
    return NextResponse.redirect(redirectUrl)

  } catch (err) {
    console.error('TrueLayer callback error:', err.message)
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(err.message)}`, request.url))
  }
}