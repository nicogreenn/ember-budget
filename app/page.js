'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const EmberApp = dynamic(() => import('@/components/EmberApp'), { ssr: false })

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
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

  if (loading) return (
    <div style={{ background: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#f97316', fontSize: 32 }}>🔥</div>
    </div>
  )

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

  return <EmberApp user={user} onSignOut={handleSignOut} />
}