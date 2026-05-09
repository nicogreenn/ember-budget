'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// ── OWNER ONLY ────────────────────────────────────────────────────────────────
const OWNER_EMAIL = 'nicogreenn@gmail.com' // change to your email

// ── THEME ─────────────────────────────────────────────────────────────────────
const FIRE = {
  bg: '#0a0a0a', card: '#141414', card2: '#1c1c1c', border: '#252525',
  primary: '#f97316', gold: '#facc15', text: '#f5f5f5', muted: '#9ca3af', dim: '#4b5563',
  green: '#4ade80', red: '#ef4444', accent: '#fb923c',
}
const T = FIRE

// ── CANVAS HELPERS ────────────────────────────────────────────────────────────
const CW = 1080, CH = 1920
const SAFE_TOP = 120, SAFE_BOTTOM = 350, SAFE_LEFT = 80, SAFE_RIGHT = 180

function drawBackground(ctx) {
  for (let y = 0; y < CH; y++) {
    const t = y / CH
    ctx.fillStyle = `rgb(${Math.floor(8+6*t)},${Math.floor(8+5*t)},${Math.floor(12+10*t)})`
    ctx.fillRect(0, y, CW, 1)
  }
}

function drawGlow(ctx, color = '249,115,22', cx = CW/2, cy = CH/2) {
  for (let r = 500; r > 0; r -= 10) {
    const a = Math.max(0, 0.055 * (1 - r / 500))
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, `rgba(${color},${a})`)
    g.addColorStop(1, `rgba(${color},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function roundedClip(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawBorder(ctx, x, y, w, h, r, color = '249,115,22') {
  for (let offset = 3; offset > 0; offset--) {
    ctx.strokeStyle = `rgba(${color},${(160/offset)/255})`
    ctx.lineWidth = 1.5
    roundedClip(ctx, x - offset, y - offset, w + offset*2, h + offset*2, r + offset)
    ctx.stroke()
  }
}

function drawImage(ctx, img, x, y, w, h, r = 28) {
  ctx.save()
  roundedClip(ctx, x, y, w, h, r)
  ctx.clip()
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
  drawBorder(ctx, x, y, w, h, r)
}

function fitImage(img, maxW, maxH) {
  const ratio = Math.min(maxW / img.width, maxH / img.height)
  return { w: Math.floor(img.width * ratio), h: Math.floor(img.height * ratio) }
}

function drawText(ctx, text, x, y, opts = {}) {
  const { size = 52, weight = 700, color = '#ffffff', align = 'center', shadow = true, maxWidth } = opts
  ctx.font = `${weight} ${size}px 'Outfit', sans-serif`
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.8)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 4
  }
  ctx.fillStyle = color
  if (maxWidth) {
    ctx.fillText(text, x, y, maxWidth)
  } else {
    ctx.fillText(text, x, y)
  }
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
}

function drawLabel(ctx, label, x, y, opts = {}) {
  const { size = 32, color = '#9ca3af' } = opts
  ctx.font = `400 ${size}px 'Jost', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(label, x, y)
}

function fmt(n) {
  if (!n && n !== 0) return '£0.00'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)
}

// ── TEMPLATES ─────────────────────────────────────────────────────────────────

async function generateRateMyBudget(data, screenshots) {
  const slides = []

  // Slide 1 — Hook
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)

    // Ember logo area
    drawText(ctx, '🔥', CW/2, 280, { size: 120 })
    drawText(ctx, 'EMBER', CW/2, 420, { size: 80, color: '#f97316' })

    // Main hook
    drawText(ctx, 'rate my budget', CW/2, 680, { size: 88, weight: 800 })
    drawText(ctx, '👀', CW/2, 800, { size: 80 })

    // Stats preview
    const stats = [
      { label: 'INCOME', value: fmt(data.income), color: '#f97316' },
      { label: 'SPEND', value: fmt(data.totalSpend), color: '#fb923c' },
      { label: 'LEFT', value: fmt(data.remaining), color: '#4ade80' },
    ]
    stats.forEach((s, i) => {
      const bx = 90 + i * 300, by = 1000, bw = 260, bh = 180
      ctx.fillStyle = 'rgba(249,115,22,0.1)'
      roundedClip(ctx, bx, by, bw, bh, 20)
      ctx.fill()
      ctx.strokeStyle = 'rgba(249,115,22,0.3)'
      ctx.lineWidth = 1
      roundedClip(ctx, bx, by, bw, bh, 20)
      ctx.stroke()
      drawLabel(ctx, s.label, bx + bw/2, by + 55, { size: 26, color: '#9ca3af' })
      drawText(ctx, s.value, bx + bw/2, by + 120, { size: 34, color: s.color, shadow: false })
    })

    drawText(ctx, 'splitting bills with my partner 💑', CW/2, 1280, { size: 40, color: '#9ca3af', weight: 400 })
    drawText(ctx, 'built the app myself 🔥', CW/2, 1380, { size: 36, color: '#6b7280', weight: 400 })

    slides.push({ canvas, label: '1 — Hook' })
  }

  // Slide 2 — Home screenshot
  if (screenshots.home) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)

    const img = await loadImage(screenshots.home)
    const maxW = CW - SAFE_LEFT - SAFE_RIGHT
    const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 200
    const { w, h } = fitImage(img, maxW, maxH)
    const x = (CW - w) / 2, y = SAFE_TOP + 60
    drawImage(ctx, img, x, y, w, h)

    drawText(ctx, `${fmt(data.income)} take-home 💰`, CW/2, y + h + 80, { size: 44 })
    drawText(ctx, `${fmt(data.totalSpend)} spent · ${fmt(data.remaining)} left`, CW/2, y + h + 160, { size: 34, color: '#9ca3af', weight: 400 })

    slides.push({ canvas, label: '2 — Home' })
  }

  // Slide 3 — Bills screenshot
  if (screenshots.bills) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx, '251,146,60')

    const img = await loadImage(screenshots.bills)
    const maxW = CW - SAFE_LEFT - SAFE_RIGHT
    const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 200
    const { w, h } = fitImage(img, maxW, maxH)
    const x = (CW - w) / 2, y = SAFE_TOP + 60
    drawImage(ctx, img, x, y, w, h, 28)

    drawText(ctx, 'every bill. my exact share. 💸', CW/2, y + h + 80, { size: 44 })
    drawText(ctx, 'mortgage · council tax · utilities all split', CW/2, y + h + 160, { size: 32, color: '#9ca3af', weight: 400 })

    slides.push({ canvas, label: '3 — Bills' })
  }

  // Slide 4 — Savings screenshot
  if (screenshots.savings) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx, '74,222,128')

    const img = await loadImage(screenshots.savings)
    const maxW = CW - SAFE_LEFT - SAFE_RIGHT
    const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 200
    const { w, h } = fitImage(img, maxW, maxH)
    const x = (CW - w) / 2, y = SAFE_TOP + 60
    drawImage(ctx, img, x, y, w, h, 28)

    drawText(ctx, `saving ${fmt(data.savingsMonthly)}/mo 📈`, CW/2, y + h + 80, { size: 44 })
    drawText(ctx, 'compound interest · up to 20yr projection', CW/2, y + h + 160, { size: 32, color: '#9ca3af', weight: 400 })

    slides.push({ canvas, label: '4 — Savings' })
  }

  // Slide 5 — CTA
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)

    drawText(ctx, '🔥', CW/2, 500, { size: 180 })
    drawText(ctx, 'Ember', CW/2, 750, { size: 120, color: '#f97316', weight: 800 })
    drawText(ctx, 'UK budgeting for couples', CW/2, 880, { size: 44, color: '#9ca3af', weight: 400 })
    drawText(ctx, 'invite only · link in bio 👇', CW/2, 1080, { size: 52, weight: 700 })

    // Bottom features
    const feats = ['bill splitting', 'savings goals', 'take-home calc', '5 themes']
    feats.forEach((f, i) => {
      const bx = 60 + i * 240, by = 1280, bw = 210, bh = 90
      ctx.fillStyle = 'rgba(249,115,22,0.12)'
      roundedClip(ctx, bx, by, bw, bh, 45)
      ctx.fill()
      ctx.strokeStyle = 'rgba(249,115,22,0.25)'
      ctx.lineWidth = 1
      roundedClip(ctx, bx, by, bw, bh, 45)
      ctx.stroke()
      drawLabel(ctx, f, bx + bw/2, by + bh/2, { size: 26, color: '#f97316' })
    })

    slides.push({ canvas, label: '5 — CTA' })
  }

  return slides
}

async function generateSpreadsheetVsApp(data, screenshots) {
  const slides = []

  // Slide 1 — Hook
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx, '239,68,68')
    drawText(ctx, 'me trying to track', CW/2, 600, { size: 72, weight: 800 })
    drawText(ctx, 'my bills on a', CW/2, 720, { size: 72, weight: 800 })
    drawText(ctx, 'spreadsheet 😭', CW/2, 840, { size: 72, weight: 800 })
    drawText(ctx, '2 hours every month', CW/2, 1050, { size: 44, color: '#9ca3af', weight: 400 })
    drawText(ctx, 'just to still have no idea', CW/2, 1130, { size: 44, color: '#9ca3af', weight: 400 })
    drawText(ctx, 'what i actually spent 💀', CW/2, 1210, { size: 44, color: '#9ca3af', weight: 400 })
    slides.push({ canvas, label: '1 — Hook' })
  }

  // Slide 2 — Spreadsheet
  if (screenshots.spreadsheet) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx, '239,68,68')
    const img = await loadImage(screenshots.spreadsheet)
    const maxW = CW - SAFE_LEFT - SAFE_RIGHT
    const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 220
    const { w, h } = fitImage(img, maxW, maxH)
    const x = (CW - w) / 2, y = SAFE_TOP + 60
    drawImage(ctx, img, x, y, w, h, 20)
    drawText(ctx, 'before 😬', CW/2, y + h + 90, { size: 56, weight: 800 })
    drawText(ctx, 'manual, messy, takes forever', CW/2, y + h + 180, { size: 36, color: '#9ca3af', weight: 400 })
    slides.push({ canvas, label: '2 — Spreadsheet' })
  }

  // Slide 3 — transition
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)
    drawText(ctx, 'so i just', CW/2, 700, { size: 80, weight: 800 })
    drawText(ctx, 'built my own', CW/2, 820, { size: 80, weight: 800 })
    drawText(ctx, 'app 🔥', CW/2, 940, { size: 80, weight: 800 })
    drawText(ctx, '6 months of evenings later...', CW/2, 1150, { size: 40, color: '#9ca3af', weight: 400 })
    slides.push({ canvas, label: '3 — Transition' })
  }

  // Slide 4 — App home
  if (screenshots.home) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)
    const img = await loadImage(screenshots.home)
    const maxW = CW - SAFE_LEFT - SAFE_RIGHT
    const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 220
    const { w, h } = fitImage(img, maxW, maxH)
    const x = (CW - w) / 2, y = SAFE_TOP + 60
    drawImage(ctx, img, x, y, w, h)
    drawText(ctx, 'after ✨', CW/2, y + h + 90, { size: 56, weight: 800 })
    drawText(ctx, '2 mins a month. looks like this.', CW/2, y + h + 180, { size: 36, color: '#9ca3af', weight: 400 })
    slides.push({ canvas, label: '4 — App' })
  }

  // Slide 5 — CTA
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)
    drawText(ctx, '🔥', CW/2, 500, { size: 180 })
    drawText(ctx, 'Ember', CW/2, 750, { size: 120, color: '#f97316', weight: 800 })
    drawText(ctx, 'invite only · link in bio 👇', CW/2, 950, { size: 52, weight: 700 })
    slides.push({ canvas, label: '5 — CTA' })
  }

  return slides
}

async function generateFeatureShowcase(data, screenshots) {
  const slides = []
  const features = [
    { title: 'bill splitting', sub: 'set your share per transaction', screenshot: screenshots.bills, glow: '251,146,60' },
    { title: 'savings goals', sub: `saving ${fmt(data.savingsMonthly)}/mo · up to 20yr projection`, screenshot: screenshots.savings, glow: '74,222,128' },
    { title: 'take-home calc', sub: '2025/26 uk tax rates built in', screenshot: screenshots.takehome, glow: '250,204,21' },
  ]

  // Hook
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)
    drawText(ctx, '🔥', CW/2, 480, { size: 160 })
    drawText(ctx, 'things my budgeting', CW/2, 720, { size: 72, weight: 800 })
    drawText(ctx, 'app can do that', CW/2, 840, { size: 72, weight: 800 })
    drawText(ctx, 'yours probably cant', CW/2, 960, { size: 72, weight: 800 })
    slides.push({ canvas, label: '1 — Hook' })
  }

  for (const feat of features) {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx, feat.glow)

    if (feat.screenshot) {
      const img = await loadImage(feat.screenshot)
      const maxW = CW - SAFE_LEFT - SAFE_RIGHT
      const maxH = CH - SAFE_TOP - SAFE_BOTTOM - 280
      const { w, h } = fitImage(img, maxW, maxH)
      const x = (CW - w) / 2, y = SAFE_TOP + 60
      drawImage(ctx, img, x, y, w, h, 28)
      drawText(ctx, feat.title, CW/2, y + h + 90, { size: 60, weight: 800 })
      drawText(ctx, feat.sub, CW/2, y + h + 180, { size: 36, color: '#9ca3af', weight: 400 })
    } else {
      drawText(ctx, feat.title, CW/2, CH/2, { size: 80, weight: 800 })
      drawText(ctx, feat.sub, CW/2, CH/2 + 100, { size: 40, color: '#9ca3af', weight: 400 })
    }
    slides.push({ canvas, label: feat.title })
  }

  // CTA
  {
    const canvas = document.createElement('canvas')
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')
    drawBackground(ctx)
    drawGlow(ctx)
    drawText(ctx, '🔥', CW/2, 500, { size: 180 })
    drawText(ctx, 'Ember', CW/2, 750, { size: 120, color: '#f97316', weight: 800 })
    drawText(ctx, 'invite only · link in bio 👇', CW/2, 950, { size: 52, weight: 700 })
    slides.push({ canvas, label: 'CTA' })
  }

  return slides
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new window.Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function TikTokGenerator() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [screenshots, setScreenshots] = useState({})
  const [slides, setSlides] = useState([])
  const [generating, setGenerating] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      setLoading(false)
      if (u && u.email === OWNER_EMAIL) loadData(u)
    })
  }, [])

  const loadData = async (u) => {
    const { data: s } = await supabase.from('settings').select('*').eq('user_id', u.id).single()
    const { data: txns } = await supabase.from('transactions').select('*').eq('user_id', u.id)
    const { data: sp } = await supabase.from('splits').select('*').eq('user_id', u.id)

    const splitsMap = {}
    if (sp) sp.forEach(s => { splitsMap[s.transaction_id] = s.my_share })

    const income = s?.income || 0
    const sideHustles = s?.side_hustles || []
    const toM = (a, f) => f === 'Weekly' ? a*52/12 : f === 'Fortnightly' ? a*26/12 : f === 'One-off' ? a/12 : a
    const totalIncome = income + sideHustles.reduce((sum, h) => sum + toM(h.amount, h.frequency), 0)

    const myShare = (t) => {
      const pct = splitsMap[t.id] ?? 100
      return t.amount * (pct / 100)
    }

    const totalSpend = (txns || []).reduce((sum, t) => sum + myShare(t), 0)
    const savingsGoals = s?.savings_goals || []
    const savingsMonthly = savingsGoals.reduce((sum, g) =>
      sum + (g.contributions || []).reduce((cs, c) => cs + toM(c.amount, c.frequency), 0), 0)
    const spendingBudget = s?.spending_budget || 0
    const remaining = totalIncome - totalSpend - (spendingBudget || 0) - savingsMonthly

    setData({ income: totalIncome, totalSpend, remaining, savingsMonthly, spendingBudget })
  }

  const handleScreenshot = (key, file) => {
    const reader = new FileReader()
    reader.onload = e => setScreenshots(p => ({ ...p, [key]: e.target.result }))
    reader.readAsDataURL(file)
  }

  const generate = async (template) => {
    setGenerating(true)
    setSlides([])
    setActiveTemplate(template)
    try {
      let result
      if (template === 'rate') result = await generateRateMyBudget(data, screenshots)
      if (template === 'vs') result = await generateSpreadsheetVsApp(data, screenshots)
      if (template === 'features') result = await generateFeatureShowcase(data, screenshots)
      setSlides(result)
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  const downloadAll = () => {
    slides.forEach((s, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = s.canvas.toDataURL('image/png', 0.97)
        a.download = `ember_tiktok_${activeTemplate}_${i+1}_${s.label.replace(/\s/g,'_')}.png`
        a.click()
      }, i * 300)
    })
  }

  const downloadOne = (slide, i) => {
    const a = document.createElement('a')
    a.href = slide.canvas.toDataURL('image/png', 0.97)
    a.download = `ember_tiktok_${i+1}_${slide.label.replace(/\s/g,'_')}.png`
    a.click()
  }

  // Auth checks
  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: T.primary, fontSize: 40 }}>🔥</div>
    </div>
  )

  if (!user) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ color: T.muted, fontSize: 16 }}>Please sign in first.</div>
    </div>
  )

  if (user.email !== OWNER_EMAIL) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ color: T.muted, fontSize: 16 }}>Not authorised.</div>
    </div>
  )

  const UploadBox = ({ label, id, icon }) => (
    <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 16px', background: screenshots[id] ? `${T.primary}18` : T.card2, border: `1px solid ${screenshots[id] ? T.primary : T.border}`, borderRadius: 14, cursor: 'pointer', transition: 'all .2s', flex: 1, minWidth: 120 }}>
      <span style={{ fontSize: 28 }}>{screenshots[id] ? '✅' : icon}</span>
      <span style={{ fontSize: 12, color: screenshots[id] ? T.primary : T.muted, textAlign: 'center', fontFamily: 'sans-serif' }}>{label}</span>
      <input id={id} type="file" accept="image/*,video/*" onChange={e => e.target.files[0] && handleScreenshot(id, e.target.files[0])} style={{ display: 'none' }} />
    </label>
  )

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Jost', sans-serif", color: T.text, padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;600;700;800&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${T.primary},${T.gold})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔥</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>TikTok Generator</div>
          <div style={{ fontSize: 13, color: T.muted }}>Owner only · Ember</div>
        </div>
      </div>

      {/* Data summary */}
      {data && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'Income', value: fmt(data.income), color: T.primary },
            { label: 'Spent', value: fmt(data.totalSpend), color: T.accent },
            { label: 'Remaining', value: fmt(data.remaining), color: T.green },
            { label: 'Savings/mo', value: fmt(data.savingsMonthly), color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 20px', textAlign: 'center', flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshots upload */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 24, marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Upload Screenshots</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <UploadBox label="Home" id="home" icon="🏠" />
          <UploadBox label="Bills" id="bills" icon="📋" />
          <UploadBox label="Savings" id="savings" icon="💰" />
          <UploadBox label="Take-Home" id="takehome" icon="🧮" />
          <UploadBox label="Spreadsheet" id="spreadsheet" icon="📊" />
        </div>
      </div>

      {/* Templates */}
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Choose Template</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { id: 'rate', emoji: '👀', title: 'Rate My Budget', desc: 'Hook + your real numbers + screenshots' },
          { id: 'vs', emoji: '📊', title: 'Spreadsheet vs App', desc: 'Before/after with your spreadsheet' },
          { id: 'features', emoji: '🔥', title: 'Feature Showcase', desc: 'What your app can do' },
        ].map(t => (
          <button key={t.id} onClick={() => generate(t.id)} disabled={generating}
            style={{ flex: 1, minWidth: 220, padding: '20px 20px', background: activeTemplate === t.id ? `${T.primary}18` : T.card, border: `1px solid ${activeTemplate === t.id ? T.primary : T.border}`, borderRadius: 16, cursor: generating ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all .2s', opacity: generating ? 0.6 : 1 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 13, color: T.muted }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Generating indicator */}
      {generating && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
          <div>Generating slides...</div>
        </div>
      )}

      {/* Slides output */}
      {slides.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{slides.length} slides ready</div>
            <button onClick={downloadAll} style={{ background: `linear-gradient(135deg,${T.primary},${T.gold}88)`, border: `1px solid ${T.primary}`, borderRadius: 12, color: '#000', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '12px 24px', cursor: 'pointer' }}>
              ⬇ Download All
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {slides.map((slide, i) => (
              <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <img src={slide.canvas.toDataURL()} style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{slide.label}</span>
                  <button onClick={() => downloadOne(slide, i)} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.primary, fontSize: 12, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>⬇</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}