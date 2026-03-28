'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CharitiesPage() {
  const [charities, setCharities] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('charities').select('*').eq('is_active', true).then(({ data }) => {
      setCharities(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ch-root {
          min-height: 100vh;
          background: #060a06;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
          display: flex; flex-direction: column;
        }
        .ch-bg-top {
          position: fixed; top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 1100px; height: 600px;
          background: radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.13) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .ch-bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.028) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 50% at 50% 10%, black 10%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .ch-main { flex: 1; }
        .ch-body {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 3.5rem 1.5rem 6rem;
        }
        .ch-header {
          text-align: center;
          margin-bottom: 3.5rem;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ch-header-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: clamp(2rem, 5vw, 3.2rem);
          color: #fff; letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }
        .ch-header-sub {
          font-size: 0.95rem; color: rgba(255,255,255,0.3);
          font-weight: 300; max-width: 420px; margin: 0 auto 2rem;
          line-height: 1.6;
        }
        .ch-search-wrap {
          max-width: 420px; margin: 0 auto;
          position: relative;
        }
        .ch-search-icon {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          font-size: 0.9rem; color: rgba(255,255,255,0.2);
          pointer-events: none;
        }
        .ch-search {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; color: #fff;
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .ch-search::placeholder { color: rgba(255,255,255,0.2); }
        .ch-search:focus {
          border-color: rgba(34,197,94,0.45);
          background: rgba(34,197,94,0.04);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.09);
        }
        .ch-count {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ch-count-text { font-size: 0.78rem; color: rgba(255,255,255,0.22); font-weight: 300; }
        .ch-count-pill {
          font-size: 0.7rem; font-weight: 700; color: #4ade80;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 99px; padding: 0.18rem 0.65rem;
          font-family: 'Syne', sans-serif;
        }
        .ch-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem 0; gap: 1rem;
        }
        .ch-spinner {
          width: 36px; height: 36px;
          border: 2.5px solid rgba(34,197,94,0.15);
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ch-loading-text { font-size: 0.85rem; color: rgba(255,255,255,0.25); font-weight: 300; }
        .ch-empty { text-align: center; padding: 4rem 0; font-size: 0.88rem; color: rgba(255,255,255,0.22); }
        .ch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          animation: fadeUp 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 900px) { .ch-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ch-grid { grid-template-columns: 1fr; } }
        .ch-card {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 1.75rem 1.6rem;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .ch-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }
        .ch-card:hover { border-color: rgba(34,197,94,0.22); transform: translateY(-3px); }
        .ch-card-icon {
          width: 50px; height: 50px; border-radius: 14px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 1.2rem; flex-shrink: 0;
        }
        .ch-card-name {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 1rem; color: #fff; margin-bottom: 0.55rem;
        }
        .ch-card-desc {
          font-size: 0.82rem; color: rgba(255,255,255,0.3);
          line-height: 1.65; font-weight: 300;
          flex: 1; margin-bottom: 1.4rem;
        }
        .ch-card-footer {
          display: flex; align-items: center; justify-content: space-between; margin-top: auto;
        }
        .ch-card-link {
          font-size: 0.78rem; color: #4ade80;
          text-decoration: none; font-weight: 500; transition: opacity 0.18s;
        }
        .ch-card-link:hover { opacity: 0.7; }
        .ch-card-btn {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 9px; padding: 0.38rem 0.85rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.72rem; color: #4ade80; text-decoration: none;
          transition: background 0.18s, border-color 0.18s;
        }
        .ch-card-btn:hover { background: rgba(34,197,94,0.18); border-color: rgba(34,197,94,0.4); }
        .ch-cta {
          margin-top: 4rem; text-align: center;
          animation: fadeUp 0.5s 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ch-cta-box {
          display: inline-flex; flex-direction: column;
          align-items: center; gap: 1.25rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 24px; padding: 2.5rem 3rem;
          position: relative; overflow: hidden;
        }
        .ch-cta-box::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 40%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent);
        }
        .ch-cta-text { font-size: 0.88rem; color: rgba(255,255,255,0.3); font-weight: 300; }
        .ch-cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none; border-radius: 13px; padding: 0.8rem 2rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.92rem; color: #000; text-decoration: none;
          box-shadow: 0 6px 24px rgba(34,197,94,0.36);
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .ch-cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
        }
        .ch-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(34,197,94,0.46); }
      `}</style>

      <div className="ch-root">
        <div className="ch-bg-top" />
        <div className="ch-bg-grid" />

        {/* ── Shared Navbar ── */}
        <Navbar />

        <main className="ch-main">
          <div className="ch-body">
            {/* Header */}
            <div className="ch-header">
              <h1 className="ch-header-title">Our Charities</h1>
              <p className="ch-header-sub">Every subscription contributes to causes that matter</p>
              <div className="ch-search-wrap">
                <span className="ch-search-icon">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search charities..."
                  className="ch-search"
                />
              </div>
            </div>

            {/* Count row */}
            {!loading && (
              <div className="ch-count">
                <span className="ch-count-text">
                  {filtered.length === charities.length
                    ? `Showing all charities`
                    : `Showing ${filtered.length} of ${charities.length}`}
                </span>
                <span className="ch-count-pill">{filtered.length} found</span>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="ch-loading">
                <div className="ch-spinner" />
                <p className="ch-loading-text">Loading charities...</p>
              </div>
            ) : filtered.length === 0 ? (
              <p className="ch-empty">No charities found.</p>
            ) : (
              <div className="ch-grid">
                {filtered.map(c => (
                  <div className="ch-card" key={c.id}>
                    <div className="ch-card-icon">❤️</div>
                    <p className="ch-card-name">{c.name}</p>
                    <p className="ch-card-desc">{c.description || 'Supporting a great cause through golf.'}</p>
                    <div className="ch-card-footer">
                      {c.website
                        ? <a href={c.website} target="_blank" className="ch-card-link">Visit website →</a>
                        : <span />}
                      <Link href="/subscribe" className="ch-card-btn">Support →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="ch-cta">
              <div className="ch-cta-box">
                <p className="ch-cta-text">Want to support one of these charities?</p>
                <Link href="/subscribe" className="ch-cta-btn">Subscribe &amp; Give →</Link>
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