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
    // Exchange code for token with TrueLayer
    const tokenResponse = await fetch('https://auth.truelayer.com/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.TRUELAYER_CLIENT_ID,
        client_secret: process.env.TRUELAYER_CLIENT_SECRET,
        code,
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }),
    })

    const tokens = await tokenResponse.json()
    console.log('TrueLayer token response:', JSON.stringify(tokens))

    if (!tokens.access_token) {
      console.error('No access token received:', tokens)
      return NextResponse.redirect(new URL('/?error=no_token', request.url))
    }

    // Fetch accounts first
    const accountsResponse = await fetch('https://api.truelayer.com/data/v1/accounts', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const accountsData = await accountsResponse.json()
    console.log('Accounts:', JSON.stringify(accountsData))

    // Fetch transactions for each account
    const allTransactions = []
    if (accountsData.results) {
      for (const account of accountsData.results) {
        const txnResponse = await fetch(
          `https://api.truelayer.com/data/v1/accounts/${account.account_id}/transactions`,
          { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        )
        const txnData = await txnResponse.json()
        console.log(`Transactions for ${account.account_id}:`, JSON.stringify(txnData))
        if (txnData.results) {
          allTransactions.push(...txnData.results)
        }
      }
    }

    // Store token and transactions in URL params to pass back to client
    const redirectUrl = new URL('/', baseUrl)
    redirectUrl.searchParams.set('connected', 'true')
    redirectUrl.searchParams.se