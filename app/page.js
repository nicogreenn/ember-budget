'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const EmberApp = dynamic(() => import('@/components/EmberApp'), { ssr: false })

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [whitelistChecking, setWhitelistChecking] = useState(false)
  const [whitelisted, setWhitelisted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Check whitelist when user logs in
  useEffect(() => {
    if (!user) { setWhitelisted(false); return; }
    setWhitelistChecking(true)
    supabase
      .from('whitelist')
      .select('email')
      .eq('email', user.email)
      .single()
      .then(({ data }) => {
        setWhitelisted(!!data)
        setWhitelistChecking(false)
      })
  }, [user])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Check your email to confirm your account')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // Loading spinner
  if (loading || whitelistChecking) return (
    <div style={{ background: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#f97316', fontSize: 32, animation: 'pulse 1.5s ease-in-out infinite' }}>🔥</div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  )

  // Not logged in — show login
  if (!user) return (
    <div style={{ background: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 20, padding: 32, width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36 }}>🔥</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f5f5f5', marginTop: 8 }}>Ember</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Your personal budget app</div>
        </div>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', background: '#242424', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 14px', color: '#f5f5f5', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', background: '#242424', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 14px', color: '#f5f5f5', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
          {error && <div style={{ fontSize: 13, color: error.includes('Check') ? '#4ade80' : '#ef4444', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f97316, #facc15)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: 13 }}>
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )

  // Logged in but not whitelisted — waitlist screen
  if (!whitelisted) return (
    <div style={{ background: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔥</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f5', marginBottom: 12, fontFamily: 'Georgia, serif' }}>You're on the list</div>
        <div style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 32 }}>
          Ember is invite-only right now. We'll email <span style={{ color: '#f97316' }}>{user.email}</span> as soon as your spot is ready.
        </div>
        <div style={{ background: '#1c1c1c', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
          💑 Bill splitting for couples<br />
          📈 Savings projections up to 20 years<br />
          🧮 UK take-home pay calculator<br />
          🎨 5 premium themes
        </div>
        <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 10, color: '#6b7280', padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>
          Sign out
        </button>
      </div>
    </div>
  )

  // Whitelisted — show app
  return <EmberApp user={user} onSignOut={handleSignOut} />
}