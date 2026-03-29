'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/components/AdminNavbar'
import Footer from '@/components/Footer'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [draws, setDraws] = useState([])
  const [charities, setCharities] = useState([])
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [simResult, setSimResult] = useState(null)
  const [drawType, setDrawType] = useState('random')
  const [newCharity, setNewCharity] = useState({ name: '', description: '', website: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) { router.push('/login'); return }
      setUser(user)
  
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
  
      if (profileError || !profile || !profile.is_admin) {
        router.push('/dashboard')
        return
      }
  
      const [usersRes, drawsRes, charitiesRes, winnersRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('draws').select('*').order('created_at', { ascending: false }),
        supabase.from('charities').select('*').order('created_at', { ascending: false }),
        supabase.from('winners').select('*, profiles(full_name, email), draws(draw_date)').order('created_at', { ascending: false }),
      ])
  
      setUsers(usersRes.data || [])
      setDraws(drawsRes.data || [])
      setCharities(charitiesRes.data || [])
      setWinners(winnersRes.data || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      router.push('/dashboard')
    }
  }

  const handleSimulate = async () => {
    setMsg('Simulating...')
    const res = await fetch('/api/admin/draw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'simulate', drawType }),
    })
    const data = await res.json()
    setSimResult(data); setMsg('')
  }

  const handleCreateDraw = async () => {
    setMsg('Creating draw...')
    const res = await fetch('/api/admin/draw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', drawType }),
    })
    const data = await res.json()
    if (data.success) { setMsg('Draw created!'); loadAll() }
    else setMsg('Error: ' + data.error)
  }

  const handlePublish = async (drawId) => {
    setMsg('Publishing...')
    const res = await fetch('/api/admin/draw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', drawId }),
    })
    const data = await res.json()
    if (data.success) {
      setMsg(`Published! Winners — 5-match: ${data.winners.fiveMatch}, 4-match: ${data.winners.fourMatch}, 3-match: ${data.winners.threeMatch}`)
      loadAll()
    } else setMsg('Error: ' + data.error)
  }

  const handleAddCharity = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('charities').insert(newCharity)
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('Charity added!'); setNewCharity({ name: '', description: '', website: '' }); loadAll() }
  }

  const handleDeleteCharity = async (id) => {
    await supabase.from('charities').delete().eq('id', id); loadAll()
  }

  const handleVerifyWinner = async (winnerId, status) => {
    await supabase.from('winners').update({ verification_status: status }).eq('id', winnerId); loadAll()
  }

  const handleMarkPaid = async (winnerId) => {
    await supabase.from('winners').update({ payment_status: 'paid' }).eq('id', winnerId); loadAll()
  }

  const handleToggleSubscription = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', userId); loadAll()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#4ade80', fontFamily: 'sans-serif', fontSize: '0.9rem' }}>Loading admin panel...</p>
    </div>
  )

  const activeUsers = users.filter(u => u.subscription_status === 'active').length
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif' }}>

      {/* ── Admin Navbar (tabs built-in) ── */}
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {msg && (
          <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', borderRadius: 14, fontSize: '0.88rem',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
            {msg}
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Users',         value: users.length,    icon: '👥' },
                { label: 'Active Subscribers',  value: activeUsers,     icon: '✅' },
                { label: 'Total Draws',          value: draws.length,    icon: '🎰' },
                { label: 'Total Winners',        value: winners.length,  icon: '🏆' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ ...cardStyle, borderRadius: 20, padding: '1.5rem' }}>
                  <p style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{value}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Users ({users.length})</h2>
            <div style={{ ...cardStyle, borderRadius: 20, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Name', 'Email', 'Plan', 'Status', 'Joined', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1rem 1.25rem', color: '#fff', fontSize: '0.88rem' }}>{u.full_name || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#9ca3af', fontSize: '0.88rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#9ca3af', fontSize: '0.88rem', textTransform: 'capitalize' }}>{u.subscription_plan || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 99,
                          background: u.subscription_status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: u.subscription_status === 'active' ? '#22c55e' : '#ef4444',
                        }}>{u.subscription_status || 'inactive'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.78rem' }}>{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <button onClick={() => handleToggleSubscription(u.id, u.subscription_status)}
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: 9, cursor: 'pointer',
                            background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}>
                          Toggle Sub
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DRAWS */}
        {activeTab === 'draws' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Draw Management</h2>
            <div style={{ ...cardStyle, borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Create New Draw</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={drawType} onChange={e => setDrawType(e.target.value)}
                  style={{ borderRadius: 12, padding: '0.6rem 1rem', color: '#fff', fontSize: '0.88rem', outline: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="random">Random Draw</option>
                  <option value="weighted">Weighted (Score-based)</option>
                </select>
                <button onClick={handleSimulate}
                  style={{ padding: '0.6rem 1.1rem', borderRadius: 12, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  🔍 Simulate
                </button>
                <button onClick={handleCreateDraw}
                  style={{ padding: '0.6rem 1.1rem', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#000', border: 'none' }}>
                  ✨ Create Draw
                </button>
              </div>
              {simResult && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 14, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p style={{ color: '#4ade80', fontWeight: 700, marginBottom: '0.75rem' }}>Simulation Result</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {simResult.drawNumbers?.map((n, i) => (
                      <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', fontSize: '0.88rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>{n}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div><p style={{ color: '#6b7280' }}>Jackpot (40%)</p><p style={{ color: '#fff', fontWeight: 700 }}>£{simResult.pools?.jackpot}</p></div>
                    <div><p style={{ color: '#6b7280' }}>4-Match (35%)</p><p style={{ color: '#fff', fontWeight: 700 }}>£{simResult.pools?.fourMatch}</p></div>
                    <div><p style={{ color: '#6b7280' }}>3-Match (25%)</p><p style={{ color: '#fff', fontWeight: 700 }}>£{simResult.pools?.threeMatch}</p></div>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '0.5rem' }}>Based on {simResult.subscriberCount} active subscribers</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {draws.map(d => (
                <div key={d.id} style={{ ...cardStyle, borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{new Date(d.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                      {d.draw_numbers?.map((n, i) => (
                        <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#000', background: '#22c55e' }}>{n}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 99, textTransform: 'capitalize',
                      background: d.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                      color: d.status === 'published' ? '#22c55e' : '#eab308' }}>{d.status}</span>
                    {d.status === 'pending' && (
                      <button onClick={() => handlePublish(d.id)}
                        style={{ padding: '0.45rem 1rem', borderRadius: 12, fontSize: '0.78rem', fontWeight: 700, color: '#000', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        Publish →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {draws.length === 0 && <p style={{ color: '#4b5563', fontSize: '0.88rem' }}>No draws yet. Create one above!</p>}
            </div>
          </div>
        )}

        {/* CHARITIES */}
        {activeTab === 'charities' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Charity Management</h2>
            <div style={{ ...cardStyle, borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Add New Charity</h3>
              <form onSubmit={handleAddCharity} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0.75rem' }}>
                {[
                  { key: 'name', placeholder: 'Charity name', required: true },
                  { key: 'description', placeholder: 'Short description', required: false },
                  { key: 'website', placeholder: 'Website URL', required: false },
                ].map(({ key, placeholder, required }) => (
                  <input key={key} required={required} value={newCharity[key]}
                    onChange={e => setNewCharity({ ...newCharity, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ borderRadius: 12, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.88rem', outline: 'none',
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
                ))}
                <button type="submit" style={{ padding: '0.75rem', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', color: '#000', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  + Add Charity
                </button>
              </form>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {charities.map(c => (
                <div key={c.id} style={{ ...cardStyle, borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{c.name}</p>
                    {c.description && <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>{c.description}</p>}
                    {c.website && <a href={c.website} target="_blank" style={{ color: '#4ade80', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>{c.website}</a>}
                  </div>
                  <button onClick={() => handleDeleteCharity(c.id)}
                    style={{ padding: '0.45rem 1rem', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    Delete
                  </button>
                </div>
              ))}
              {charities.length === 0 && <p style={{ color: '#4b5563', fontSize: '0.88rem' }}>No charities yet.</p>}
            </div>
          </div>
        )}

        {/* WINNERS */}
        {activeTab === 'winners' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Winners & Payouts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {winners.map(w => (
                <div key={w.id} style={{ ...cardStyle, borderRadius: 20, padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600 }}>{w.profiles?.full_name || w.profiles?.email || '—'}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>{w.match_type} · {w.draws?.draw_date ? new Date(w.draws.draw_date).toLocaleDateString('en-GB') : '—'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>£{w.prize_amount?.toFixed(2)}</span>
                      <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 99,
                        background: w.verification_status === 'approved' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                        color: w.verification_status === 'approved' ? '#22c55e' : '#eab308' }}>{w.verification_status}</span>
                      <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 99,
                        background: w.payment_status === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: w.payment_status === 'paid' ? '#22c55e' : '#ef4444' }}>{w.payment_status}</span>
                      {w.verification_status === 'pending' && (
                        <>
                          <button onClick={() => handleVerifyWinner(w.id, 'approved')}
                            style={{ padding: '0.35rem 0.8rem', borderRadius: 9, fontSize: '0.78rem', fontWeight: 700, color: '#000', cursor: 'pointer', border: 'none', background: '#22c55e' }}>Approve</button>
                          <button onClick={() => handleVerifyWinner(w.id, 'rejected')}
                            style={{ padding: '0.35rem 0.8rem', borderRadius: 9, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Reject</button>
                        </>
                      )}
                      {w.verification_status === 'approved' && w.payment_status === 'pending' && (
                        <button onClick={() => handleMarkPaid(w.id)}
                          style={{ padding: '0.35rem 0.8rem', borderRadius: 9, fontSize: '0.78rem', fontWeight: 700, color: '#000', cursor: 'pointer', border: 'none', background: '#22c55e' }}>Mark Paid</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {winners.length === 0 && <p style={{ color: '#4b5563', fontSize: '0.88rem' }}>No winners yet.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}