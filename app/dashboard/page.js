'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthNavbar from '@/components/AuthNavbar'
import Footer from '@/components/Footer'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [scores, setScores] = useState([])
  const [charities, setCharities] = useState([])
  const [winners, setWinners] = useState([])
  const [draws, setDraws] = useState([])
  const [newScore, setNewScore] = useState({ score: '', played_on: '' })
  const [loading, setLoading] = useState(true)
  const [scoreMsg, setScoreMsg] = useState('')
  const [charityPct, setCharityPct] = useState(10)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
    const [profileRes, scoresRes, charitiesRes, winnersRes, drawsRes] = await Promise.all([
      supabase.from('profiles').select('*, charities(name)').eq('id', user.id).single(),
      supabase.from('scores').select('*').eq('user_id', user.id).order('played_on', { ascending: false }),
      supabase.from('charities').select('*').eq('is_active', true),
      supabase.from('winners').select('*, draws(draw_date)').eq('user_id', user.id),
      supabase.from('draws').select('*').eq('status', 'published').order('draw_date', { ascending: false }).limit(3),
    ])
    setProfile(profileRes.data)
    setScores(scoresRes.data || [])
    setCharities(charitiesRes.data || [])
    setWinners(winnersRes.data || [])
    setDraws(drawsRes.data || [])
    setCharityPct(profileRes.data?.charity_percentage || 10)
    setLoading(false)
  }

  const handleAddScore = async (e) => {
    e.preventDefault()
    setScoreMsg('')
    const scoreVal = parseInt(newScore.score)
    if (scoreVal < 1 || scoreVal > 45) { setScoreMsg('Score must be between 1 and 45'); return }
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }
    const { error } = await supabase.from('scores').insert({
      user_id: user.id, score: scoreVal, played_on: newScore.played_on,
    })
    if (error) { setScoreMsg('Error saving score'); return }
    setScoreMsg('Score added!')
    setNewScore({ score: '', played_on: '' })
    loadAll()
  }

  const handleCharityUpdate = async (charityId) => {
    await supabase.from('profiles').update({
      charity_id: charityId, charity_percentage: charityPct,
    }).eq('id', user.id)
    loadAll()
  }

  const handleCharityPctUpdate = async () => {
    await supabase.from('profiles').update({ charity_percentage: charityPct }).eq('id', user.id)
    setScoreMsg('Charity percentage updated!')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060a06', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(34,197,94,0.2)',
          borderTopColor: '#22c55e', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#4ade80', fontFamily: 'sans-serif', fontSize: '0.9rem', opacity: 0.7 }}>Loading your dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const isActive = profile?.subscription_status === 'active'
  const totalWon = winners.reduce((sum, w) => sum + (w.prize_amount || 0), 0)
  const firstName = profile?.full_name?.split(' ')[0] || 'Golfer'
  const avgScore = scores.length ? (scores.reduce((s, r) => s + r.score, 0) / scores.length).toFixed(1) : '—'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .db-root {
          min-height: 100vh; background: #060a06;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow-x: hidden;
          display: flex; flex-direction: column;
        }
        .db-bg-top {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 1100px; height: 600px;
          background: radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.13) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .db-bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.028) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 50% at 50% 10%, black 10%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .db-main { flex: 1; }
        .db-body {
          position: relative; z-index: 1;
          max-width: 1160px; margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem;
        }
        .db-welcome { margin-bottom: 2.25rem; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .db-welcome-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #fff; letter-spacing: -0.03em; margin-bottom: 0.3rem;
        }
        .db-welcome-title span { color: #4ade80; }
        .db-welcome-sub { font-size: 0.88rem; color: rgba(255,255,255,0.28); font-weight: 300; }
        .db-banner {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(234,179,8,0.07); border: 1px solid rgba(234,179,8,0.18);
          border-radius: 18px; padding: 1.1rem 1.4rem; margin-bottom: 2rem; gap: 1rem;
          animation: fadeUp 0.5s 0.05s cubic-bezier(0.16,1,0.3,1) both;
        }
        .db-banner-text p:first-child {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; color: #fbbf24; margin-bottom: 0.2rem;
        }
        .db-banner-text p:last-child { font-size: 0.82rem; color: rgba(255,255,255,0.3); }
        .db-banner-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a); border: none; border-radius: 11px;
          padding: 0.55rem 1.2rem; white-space: nowrap;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; color: #000; text-decoration: none;
          box-shadow: 0 4px 16px rgba(34,197,94,0.3); transition: transform 0.15s; display: inline-block;
        }
        .db-banner-btn:hover { transform: translateY(-1px); }
        .db-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;
          animation: fadeUp 0.5s 0.08s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 768px) { .db-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 440px) { .db-stats { grid-template-columns: 1fr; } }
        .stat-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 1.3rem 1.4rem; position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover { border-color: rgba(34,197,94,0.2); transform: translateY(-2px); }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }
        .stat-icon { font-size: 1.1rem; margin-bottom: 0.7rem; display: block; }
        .stat-label { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
        .stat-value { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.6rem; color: #fff; letter-spacing: -0.02em; line-height: 1; margin-bottom: 0.3rem; }
        .stat-value.green { color: #4ade80; }
        .stat-value.yellow { color: #fbbf24; }
        .stat-sub { font-size: 0.72rem; color: rgba(255,255,255,0.22); font-weight: 300; }
        .db-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
          animation: fadeUp 0.5s 0.14s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 768px) { .db-grid { grid-template-columns: 1fr; } }
        .panel {
          background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; overflow: hidden; backdrop-filter: blur(14px);
        }
        .panel-header {
          padding: 1.5rem 1.6rem 1.1rem;
          border-bottom: 1px solid rgba(255,255,255,0.045);
        }
        .panel-title {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: #fff;
          display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;
        }
        .panel-title-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.18);
          display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;
        }
        .panel-sub { font-size: 0.8rem; color: rgba(255,255,255,0.28); font-weight: 300; }
        .panel-body { padding: 1.4rem 1.6rem 1.6rem; }
        .score-form { display: flex; gap: 0.6rem; margin-bottom: 1.1rem; }
        .db-input {
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 0.65rem 0.9rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #fff; outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; -webkit-appearance: none;
        }
        .db-input::placeholder { color: rgba(255,255,255,0.2); }
        .db-input:focus {
          border-color: rgba(34,197,94,0.45); background: rgba(34,197,94,0.04);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.09);
        }
        .db-input[type="date"] { color-scheme: dark; }
        .score-input-num { width: 80px; }
        .score-input-date { flex: 1; }
        .db-btn-primary {
          background: linear-gradient(135deg, #4ade80, #16a34a); border: none; border-radius: 12px;
          padding: 0.65rem 1.1rem; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.85rem; color: #000; cursor: pointer;
          box-shadow: 0 4px 14px rgba(34,197,94,0.3); transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .db-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); }
        .db-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(34,197,94,0.4); }
        .db-btn-secondary {
          width: 100%; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 12px; padding: 0.7rem; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.85rem; color: #4ade80; cursor: pointer; transition: background 0.18s, border-color 0.18s;
        }
        .db-btn-secondary:hover { background: rgba(34,197,94,0.14); border-color: rgba(34,197,94,0.35); }
        .score-msg-ok  { font-size: 0.8rem; color: #4ade80; margin-bottom: 0.8rem; }
        .score-msg-err { font-size: 0.8rem; color: #f87171; margin-bottom: 0.8rem; }
        .score-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .score-row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; padding: 0.7rem 1rem; transition: border-color 0.18s;
        }
        .score-row:hover { border-color: rgba(34,197,94,0.15); }
        .score-row-left { display: flex; align-items: center; gap: 0.8rem; }
        .score-rank { font-size: 0.65rem; color: rgba(255,255,255,0.2); font-family: 'Syne', sans-serif; font-weight: 700; width: 18px; text-align: center; }
        .score-bar-wrap { width: 60px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .score-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #22c55e, #4ade80); }
        .score-num { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.25rem; color: #fff; line-height: 1; }
        .score-pts { font-size: 0.68rem; color: rgba(255,255,255,0.25); }
        .score-date { font-size: 0.72rem; color: rgba(255,255,255,0.22); }
        .score-empty { font-size: 0.85rem; color: rgba(255,255,255,0.22); text-align: center; padding: 1.5rem 0; }
        .score-warn {
          font-size: 0.72rem; color: #fbbf24; margin-top: 0.75rem; padding: 0.5rem 0.75rem;
          background: rgba(234,179,8,0.07); border: 1px solid rgba(234,179,8,0.15); border-radius: 8px;
        }
        .charity-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; max-height: 180px; overflow-y: auto; }
        .charity-list::-webkit-scrollbar { width: 3px; }
        .charity-list::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 99px; }
        .charity-btn {
          width: 100%; text-align: left; background: rgba(255,255,255,0.025);
          border: 1.5px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0.75rem 1rem;
          cursor: pointer; transition: all 0.18s;
        }
        .charity-btn:hover { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.2); }
        .charity-btn.selected { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.35); }
        .charity-btn-top { display: flex; align-items: center; justify-content: space-between; }
        .charity-name { font-size: 0.88rem; color: #fff; font-weight: 500; }
        .charity-selected-tag {
          font-size: 0.65rem; font-weight: 700; color: #4ade80;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 99px; padding: 0.1rem 0.5rem;
        }
        .charity-desc { font-size: 0.75rem; color: rgba(255,255,255,0.28); margin-top: 0.25rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .slider-label {
          font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 0.6rem; display: flex; align-items: center; justify-content: space-between;
        }
        .slider-val { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.05rem; color: #4ade80; }
        input[type="range"] { width: 100%; accent-color: #22c55e; margin-bottom: 0.9rem; height: 4px; }
        .draw-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; padding: 1rem 1.1rem; margin-bottom: 0.75rem; transition: border-color 0.18s;
        }
        .draw-card:hover { border-color: rgba(34,197,94,0.18); }
        .draw-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
        .draw-date { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem; color: rgba(255,255,255,0.75); }
        .draw-badge {
          font-size: 0.65rem; font-weight: 700; color: #4ade80;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 99px; padding: 0.15rem 0.55rem; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .draw-numbers { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .draw-num {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.88rem; color: #000;
          background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 3px 10px rgba(34,197,94,0.3);
        }
        .draw-empty { font-size: 0.85rem; color: rgba(255,255,255,0.22); text-align: center; padding: 1.5rem 0; }
        .win-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; padding: 1rem 1.1rem; margin-bottom: 0.75rem;
          display: flex; align-items: center; justify-content: space-between; transition: border-color 0.18s;
        }
        .win-card:hover { border-color: rgba(34,197,94,0.2); }
        .win-type { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; color: #fff; margin-bottom: 0.2rem; }
        .win-date { font-size: 0.72rem; color: rgba(255,255,255,0.25); }
        .win-amount { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.3rem; color: #4ade80; text-align: right; margin-bottom: 0.25rem; }
        .win-status { font-size: 0.65rem; font-weight: 600; border-radius: 99px; padding: 0.12rem 0.5rem; text-align: right; display: inline-block; margin-left: auto; }
        .win-status.paid { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; }
        .win-status.pending { background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.2); color: #fbbf24; }
        .win-empty { text-align: center; padding: 2.5rem 0; }
        .win-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .win-empty-text { font-size: 0.85rem; color: rgba(255,255,255,0.22); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="db-root">
        <div className="db-bg-top" />
        <div className="db-bg-grid" />

        {/* ── Auth Navbar (handles sign out internally) ── */}
        <AuthNavbar />

        <main className="db-main">
          <div className="db-body">
            <div className="db-welcome">
              <h1 className="db-welcome-title">Welcome back, <span>{firstName}</span> 👋</h1>
              <p className="db-welcome-sub">Here's your GolfGives overview for today</p>
            </div>

            {!isActive && (
              <div className="db-banner">
                <div className="db-banner-text">
                  <p>No active subscription</p>
                  <p>Subscribe to enter monthly draws and track your scores</p>
                </div>
                <Link href="/subscribe" className="db-banner-btn">Subscribe Now →</Link>
              </div>
            )}

            <div className="db-stats">
              {[
                { icon: '⚡', label: 'Subscription', value: isActive ? 'Active' : 'Inactive', cls: isActive ? 'green' : 'yellow', sub: profile?.subscription_plan || '—' },
                { icon: '⛳', label: 'Scores Logged', value: `${scores.length}/5`, cls: '', sub: scores.length ? `Avg ${avgScore} pts` : 'Rolling window' },
                { icon: '🏆', label: 'Total Won', value: `£${totalWon.toFixed(2)}`, cls: 'green', sub: `${winners.length} prize${winners.length !== 1 ? 's' : ''} earned` },
                { icon: '❤️', label: 'Charity Split', value: `${profile?.charity_percentage || 10}%`, cls: '', sub: profile?.charities?.name || 'Not selected' },
              ].map(({ icon, label, value, cls, sub }) => (
                <div className="stat-card" key={label}>
                  <span className="stat-icon">{icon}</span>
                  <p className="stat-label">{label}</p>
                  <p className={`stat-value ${cls}`}>{value}</p>
                  <p className="stat-sub">{sub}</p>
                </div>
              ))}
            </div>

            <div className="db-grid">
              {/* Scores */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><div className="panel-title-icon">⛳</div>Golf Scores</div>
                  <p className="panel-sub">Your last 5 Stableford scores (1–45 pts)</p>
                </div>
                <div className="panel-body">
                  <form className="score-form" onSubmit={handleAddScore}>
                    <input className="db-input score-input-num" type="number" min="1" max="45" required
                      value={newScore.score} onChange={e => setNewScore({ ...newScore, score: e.target.value })} placeholder="Pts" />
                    <input className="db-input score-input-date" type="date" required
                      value={newScore.played_on} onChange={e => setNewScore({ ...newScore, played_on: e.target.value })} />
                    <button type="submit" className="db-btn-primary">Add</button>
                  </form>
                  {scoreMsg && (
                    <p className={scoreMsg.includes('Error') || scoreMsg.includes('must') ? 'score-msg-err' : 'score-msg-ok'}>{scoreMsg}</p>
                  )}
                  <div className="score-list">
                    {scores.length === 0 && <p className="score-empty">No scores yet — add your first above!</p>}
                    {scores.map((s, i) => (
                      <div className="score-row" key={s.id}>
                        <div className="score-row-left">
                          <span className="score-rank">#{i + 1}</span>
                          <div className="score-bar-wrap"><div className="score-bar" style={{ width: `${(s.score / 45) * 100}%` }} /></div>
                          <span className="score-num">{s.score}</span>
                          <span className="score-pts">pts</span>
                        </div>
                        <span className="score-date">{new Date(s.played_on).toLocaleDateString('en-GB')}</span>
                      </div>
                    ))}
                  </div>
                  {scores.length >= 5 && <p className="score-warn">⚠ Max 5 scores — adding a new one removes the oldest</p>}
                </div>
              </div>

              {/* Charity */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><div className="panel-title-icon">❤️</div>Charity</div>
                  <p className="panel-sub">Choose where your contribution goes</p>
                </div>
                <div className="panel-body">
                  <div className="charity-list">
                    {charities.length === 0 && <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.22)', padding: '0.5rem 0' }}>No charities available yet.</p>}
                    {charities.map(c => (
                      <button key={c.id} className={`charity-btn ${profile?.charity_id === c.id ? 'selected' : ''}`} onClick={() => handleCharityUpdate(c.id)}>
                        <div className="charity-btn-top">
                          <span className="charity-name">{c.name}</span>
                          {profile?.charity_id === c.id && <span className="charity-selected-tag">Selected ✓</span>}
                        </div>
                        {c.description && <p className="charity-desc">{c.description}</p>}
                      </button>
                    ))}
                  </div>
                  <div className="slider-label">
                    <span>Your Contribution</span>
                    <span className="slider-val">{charityPct}%</span>
                  </div>
                  <input type="range" min="10" max="50" value={charityPct} onChange={e => setCharityPct(parseInt(e.target.value))} />
                  <button className="db-btn-secondary" onClick={handleCharityPctUpdate}>Save Contribution</button>
                </div>
              </div>

              {/* Draws */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><div className="panel-title-icon">🎰</div>Recent Draws</div>
                  <p className="panel-sub">Latest published draw results</p>
                </div>
                <div className="panel-body">
                  {draws.length === 0 && <p className="draw-empty">No draws published yet.</p>}
                  {draws.map(d => (
                    <div className="draw-card" key={d.id}>
                      <div className="draw-card-top">
                        <span className="draw-date">{new Date(d.draw_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                        <span className="draw-badge">Published</span>
                      </div>
                      <div className="draw-numbers">
                        {d.draw_numbers?.map((n, i) => <div className="draw-num" key={i}>{n}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winnings */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><div className="panel-title-icon">🏆</div>My Winnings</div>
                  <p className="panel-sub">Your prize history</p>
                </div>
                <div className="panel-body">
                  {winners.length === 0 ? (
                    <div className="win-empty">
                      <div className="win-empty-icon">🍀</div>
                      <p className="win-empty-text">No wins yet — keep playing!</p>
                    </div>
                  ) : winners.map(w => (
                    <div className="win-card" key={w.id}>
                      <div>
                        <p className="win-type">{w.match_type}</p>
                        <p className="win-date">{w.draws?.draw_date ? new Date(w.draws.draw_date).toLocaleDateString('en-GB') : '—'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="win-amount">£{w.prize_amount?.toFixed(2)}</p>
                        <span className={`win-status ${w.payment_status === 'paid' ? 'paid' : 'pending'}`}>{w.payment_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Shared Footer ── */}
        <Footer />
      </div>
    </>
  )
}