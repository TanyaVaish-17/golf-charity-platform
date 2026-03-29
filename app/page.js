'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [charities, setCharities] = useState([])

  useEffect(() => {
    supabase.from('charities').select('*').eq('is_active', true).limit(3).then(({ data }) => {
      setCharities(data || [])
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          min-height: 100vh;
          background: #060a06;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── Shared background decorations ── */
        .hp-bg-fixed {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
        }
        .hp-bg-glow {
          position: absolute; top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 1100px; height: 600px;
          background: radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.13) 0%, transparent 65%);
        }
        .hp-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.028) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 50% at 50% 10%, black 10%, transparent 70%);
        }

        /* ══════════════════════════════════
           NAVBAR  — matches dashboard exactly
        ══════════════════════════════════ */
        .hp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          background: rgba(6,10,6,0.82);
        }
        .hp-logo {
          display: inline-flex; align-items: center;
          gap: 0.6rem; text-decoration: none;
        }
        .hp-logo-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.05rem; color: #000;
          box-shadow: 0 4px 18px rgba(34,197,94,0.38); flex-shrink: 0;
        }
        .hp-logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.3rem;
          color: #fff; letter-spacing: -0.02em;
        }
        .hp-logo-name span { color: #4ade80; }

        .hp-nav-links {
          display: flex; align-items: center; gap: 0.25rem;
        }
        @media (max-width: 768px) { .hp-nav-links { display: none; } }
        .hp-nav-link {
          padding: 0.4rem 0.85rem; border-radius: 10px;
          font-size: 0.82rem; color: rgba(255,255,255,0.45);
          text-decoration: none; font-weight: 400;
          transition: color 0.18s, background 0.18s;
        }
        .hp-nav-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }

        .hp-nav-right {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .hp-nav-login {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 0.38rem 0.85rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.18s;
        }
        .hp-nav-login:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.8);
        }
        .hp-nav-cta {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none; border-radius: 10px;
          padding: 0.42rem 1rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.8rem; color: #000; cursor: pointer;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(34,197,94,0.32);
          transition: transform 0.15s, box-shadow 0.15s;
          display: inline-block;
        }
        .hp-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(34,197,94,0.42);
        }

        /* ══════════════════════════════════
           HERO
        ══════════════════════════════════ */
        .hp-hero {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 8rem 1.5rem 5rem;
          text-align: center;
        }
        .hp-hero-inner { max-width: 820px; margin: 0 auto; }

        /* Live badge */
        .hp-badge {
          display: inline-flex; align-items: center; gap: 0.55rem;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 99px; padding: 0.35rem 1rem;
          margin-bottom: 2rem;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hp-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.8); }
        }
        .hp-badge-text {
          font-size: 0.8rem; color: #4ade80; font-weight: 500;
          font-family: 'Syne', sans-serif;
        }

        .hp-hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          color: #fff; line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.55s 0.05s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hp-hero-title-accent {
          display: block;
          background: linear-gradient(135deg, #22c55e, #4ade80 60%, #86efac);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hp-hero-sub {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.38);
          max-width: 560px; margin: 0 auto 2.5rem;
          line-height: 1.7; font-weight: 300;
          animation: fadeUp 0.55s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .hp-hero-btns {
          display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center;
          margin-bottom: 4rem;
          animation: fadeUp 0.55s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hp-btn-main {
          display: inline-block; padding: 0.9rem 2rem;
          border-radius: 14px; text-decoration: none;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.95rem; color: #000;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 8px 28px rgba(34,197,94,0.4);
          transition: transform 0.18s, box-shadow 0.18s;
          position: relative; overflow: hidden;
        }
        .hp-btn-main::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
        }
        .hp-btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(34,197,94,0.5);
        }
        .hp-btn-ghost {
          display: inline-block; padding: 0.9rem 2rem;
          border-radius: 14px; text-decoration: none;
          font-family: 'Syne', sans-serif; font-weight: 600;
          font-size: 0.95rem; color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .hp-btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
        }

        /* Stats row */
        .hp-stats {
          display: flex; gap: 0; justify-content: center;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
          max-width: 480px; margin: 0 auto;
          animation: fadeUp 0.55s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hp-stat {
          flex: 1; padding: 1.2rem 0.75rem; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .hp-stat:last-child { border-right: none; }
        .hp-stat-val {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1.5rem;
          color: #fff; line-height: 1; margin-bottom: 0.3rem;
        }
        .hp-stat-val.green { color: #4ade80; }
        .hp-stat-label {
          font-size: 0.68rem; color: rgba(255,255,255,0.25);
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ══════════════════════════════════
           SECTIONS — shared layout
        ══════════════════════════════════ */
        .hp-section {
          position: relative; z-index: 1;
          padding: 6rem 1.5rem;
        }
        .hp-section-inner { max-width: 1100px; margin: 0 auto; }
        .hp-section-alt {
          background: radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%);
        }

        .hp-section-label {
          font-size: 0.68rem; font-weight: 700; color: #4ade80;
          text-transform: uppercase; letter-spacing: 0.14em;
          margin-bottom: 0.75rem;
          font-family: 'Syne', sans-serif;
        }
        .hp-section-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff; letter-spacing: -0.03em; margin-bottom: 0.75rem;
        }
        .hp-section-sub {
          font-size: 0.95rem; color: rgba(255,255,255,0.3);
          font-weight: 300; max-width: 460px;
        }
        .hp-section-head { margin-bottom: 3.5rem; }

        /* ══════════════════════════════════
           HOW IT WORKS
        ══════════════════════════════════ */
        .hp-steps {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
        }
        @media (max-width: 768px) { .hp-steps { grid-template-columns: 1fr; } }

        .hp-step {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 2rem 1.75rem;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .hp-step:hover {
          border-color: rgba(34,197,94,0.22);
          transform: translateY(-3px);
        }
        .hp-step::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
        }
        .hp-step-num {
          position: absolute; top: 1.4rem; right: 1.6rem;
          font-family: 'Playfair Display', serif; font-weight: 900;
          font-size: 4rem; color: rgba(255,255,255,0.04); line-height: 1;
          pointer-events: none;
        }
        .hp-step-icon-wrap {
          width: 52px; height: 52px; border-radius: 15px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; margin-bottom: 1.4rem;
        }
        .hp-step-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 1.05rem; color: #fff; margin-bottom: 0.6rem;
        }
        .hp-step-desc {
          font-size: 0.88rem; color: rgba(255,255,255,0.32);
          line-height: 1.65; font-weight: 300;
        }

        /* Connector line between steps */
        @media (min-width: 769px) {
          .hp-steps { position: relative; }
        }

        /* ══════════════════════════════════
           PRIZES
        ══════════════════════════════════ */
        .hp-prizes {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
        }
        @media (max-width: 768px) { .hp-prizes { grid-template-columns: 1fr; } }

        .hp-prize {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 2.2rem 1.75rem;
          text-align: center; position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .hp-prize:first-child {
          border-color: rgba(34,197,94,0.18);
          background: rgba(34,197,94,0.04);
        }
        .hp-prize:first-child::after {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 60%; height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
        }
        .hp-prize:hover { transform: translateY(-3px); }

        .hp-prize-icon {
          font-size: 2.2rem; margin-bottom: 1.1rem; display: block;
        }
        .hp-prize-pct {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 3.2rem; line-height: 1;
          margin-bottom: 0.5rem;
        }
        .hp-prize-label {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 1rem; color: #fff; margin-bottom: 0.3rem;
        }
        .hp-prize-match {
          font-size: 0.75rem; color: #4ade80; font-weight: 600;
          margin-bottom: 0.75rem; font-family: 'Syne', sans-serif;
        }
        .hp-prize-desc {
          font-size: 0.78rem; color: rgba(255,255,255,0.22); font-weight: 300;
        }

        /* ══════════════════════════════════
           CHARITIES
        ══════════════════════════════════ */
        .hp-charities {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 768px) { .hp-charities { grid-template-columns: 1fr; } }

        .hp-charity {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 2rem 1.75rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .hp-charity:hover {
          border-color: rgba(34,197,94,0.2);
          transform: translateY(-2px);
        }
        .hp-charity-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 1.2rem;
        }
        .hp-charity-name {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 1rem; color: #fff; margin-bottom: 0.5rem;
        }
        .hp-charity-desc {
          font-size: 0.82rem; color: rgba(255,255,255,0.3);
          line-height: 1.6; font-weight: 300; margin-bottom: 1rem;
        }
        .hp-charity-link {
          font-size: 0.78rem; color: #4ade80;
          text-decoration: none; font-weight: 500;
          transition: opacity 0.18s;
        }
        .hp-charity-link:hover { opacity: 0.7; }

        .hp-charities-cta { text-align: center; }
        .hp-outline-btn {
          display: inline-block; padding: 0.65rem 1.5rem;
          border-radius: 12px; text-decoration: none;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.82rem; color: #4ade80;
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.22);
          transition: background 0.18s, border-color 0.18s;
        }
        .hp-outline-btn:hover {
          background: rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.4);
        }

        /* ══════════════════════════════════
           CTA SECTION
        ══════════════════════════════════ */
        .hp-cta-wrap {
          position: relative; z-index: 1;
          padding: 4rem 1.5rem 6rem;
        }
        .hp-cta-box {
          max-width: 680px; margin: 0 auto; text-align: center;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 28px; padding: 3.5rem 2.5rem;
          position: relative; overflow: hidden;
          box-shadow: 0 0 80px rgba(34,197,94,0.08);
        }
        .hp-cta-box::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 50%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent);
        }
        .hp-cta-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 200px;
          background: radial-gradient(ellipse, rgba(34,197,94,0.12), transparent 70%);
          pointer-events: none;
        }
        .hp-cta-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: clamp(1.6rem, 4vw, 2.4rem);
          color: #fff; letter-spacing: -0.03em;
          margin-bottom: 0.85rem;
        }
        .hp-cta-sub {
          font-size: 0.92rem; color: rgba(255,255,255,0.3);
          font-weight: 300; margin-bottom: 2rem; line-height: 1.6;
        }
        .hp-cta-note {
          font-size: 0.75rem; color: rgba(255,255,255,0.18);
          margin-top: 1rem; font-weight: 300;
        }

        /* ══════════════════════════════════
           FOOTER
        ══════════════════════════════════ */
        .hp-footer {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 2.2rem 2rem;
        }
        .hp-footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1.25rem;
        }
        .hp-footer-logo {
          display: flex; align-items: center; gap: 0.55rem;
          text-decoration: none;
        }
        .hp-footer-logo-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.9rem; color: #000;
        }
        .hp-footer-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1rem; color: #fff;
        }
        .hp-footer-logo-name span { color: #4ade80; }
        .hp-footer-links {
          display: flex; gap: 0.25rem; flex-wrap: wrap;
        }
        .hp-footer-link {
          padding: 0.3rem 0.7rem; border-radius: 8px;
          font-size: 0.78rem; color: rgba(255,255,255,0.3);
          text-decoration: none; transition: color 0.18s, background 0.18s;
        }
        .hp-footer-link:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
        }
        .hp-footer-copy {
          font-size: 0.75rem; color: rgba(255,255,255,0.15); font-weight: 300;
        }
      `}</style>

      <div className="hp-root">
        {/* Fixed background */}
        <div className="hp-bg-fixed">
          <div className="hp-bg-glow" />
          <div className="hp-bg-grid" />
        </div>

        {/* ── Navbar ── */}
        <nav className="hp-nav">
          <Link href="/" className="hp-logo">
            <div className="hp-logo-icon">G</div>
            <span className="hp-logo-name">Golf<span>Gives</span></span>
          </Link>

          <div className="hp-nav-links">
            <a href="#how" className="hp-nav-link">How it Works</a>
            <a href="#prizes" className="hp-nav-link">Prizes</a>
            <a href="#charities" className="hp-nav-link">Charities</a>
          </div>

          <div className="hp-nav-right">
            <Link href="/login" className="hp-nav-login">Log in</Link>
            <Link href="/subscribe" className="hp-nav-cta">Get Started →</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hp-hero">
          <div className="hp-hero-inner">
            <div className="hp-badge">
              <div className="hp-badge-dot" />
              <span className="hp-badge-text">Monthly draws now live</span>
            </div>

            <h1 className="hp-hero-title">
              Golf with a
              <span className="hp-hero-title-accent">greater purpose</span>
            </h1>

            <p className="hp-hero-sub">
              Track your Stableford scores, enter monthly prize draws, and support the charity closest to your heart — all in one place.
            </p>

            <div className="hp-hero-btns">
              <Link href="/subscribe" className="hp-btn-main">Start Playing →</Link>
              <a href="#how" className="hp-btn-ghost">How it Works</a>
            </div>

            <div className="hp-stats">
              {[
                { val: '1,200+', label: 'Active Members', green: false },
                { val: '£48K+',  label: 'Given to Charity', green: true },
                { val: 'Monthly', label: 'Prize Draws', green: false },
              ].map(({ val, label, green }) => (
                <div className="hp-stat" key={label}>
                  <p className={`hp-stat-val${green ? ' green' : ''}`}>{val}</p>
                  <p className="hp-stat-label">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section id="how" className="hp-section">
          <div className="hp-section-inner">
            <div className="hp-section-head">
              <p className="hp-section-label">The Process</p>
              <h2 className="hp-section-title">How it Works</h2>
              <p className="hp-section-sub">Three simple steps to play with purpose</p>
            </div>
            <div className="hp-steps">
              {[
                { step: '01', icon: '🏌️', title: 'Subscribe & Play', desc: 'Choose a monthly or yearly plan. Enter your last 5 Stableford scores after every round.' },
                { step: '02', icon: '🎰', title: 'Enter the Draw', desc: 'Your scores automatically enter you into our monthly prize draw. Match 3, 4, or all 5 numbers to win.' },
                { step: '03', icon: '❤️', title: 'Give Back', desc: 'A portion of every subscription goes directly to your chosen charity. Golf with a greater purpose.' },
              ].map(({ step, icon, title, desc }) => (
                <div className="hp-step" key={step}>
                  <span className="hp-step-num">{step}</span>
                  <div className="hp-step-icon-wrap">{icon}</div>
                  <p className="hp-step-title">{title}</p>
                  <p className="hp-step-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Prize Structure ── */}
        <section id="prizes" className="hp-section hp-section-alt">
          <div className="hp-section-inner">
            <div className="hp-section-head">
              <p className="hp-section-label">Rewards</p>
              <h2 className="hp-section-title">Prize Structure</h2>
              <p className="hp-section-sub">50% of all subscriptions go directly into the prize pool</p>
            </div>
            <div className="hp-prizes">
              {[
                { match: '5 Numbers', pool: '40%', label: 'Jackpot',       color: '#4ade80', desc: 'Rolls over if unclaimed', icon: '👑' },
                { match: '4 Numbers', pool: '35%', label: 'Second Prize',  color: '#86efac', desc: 'Split among all winners', icon: '🥈' },
                { match: '3 Numbers', pool: '25%', label: 'Third Prize',   color: '#bbf7d0', desc: 'Split among all winners', icon: '🥉' },
              ].map(({ match, pool, label, color, desc, icon }) => (
                <div className="hp-prize" key={label}>
                  <span className="hp-prize-icon">{icon}</span>
                  <p className="hp-prize-pct" style={{ color }}>{pool}</p>
                  <p className="hp-prize-label">{label}</p>
                  <p className="hp-prize-match">{match} matched</p>
                  <p className="hp-prize-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Charities ── */}
        <section id="charities" className="hp-section">
          <div className="hp-section-inner">
            <div className="hp-section-head">
              <p className="hp-section-label">Causes</p>
              <h2 className="hp-section-title">Charities We Support</h2>
              <p className="hp-section-sub">Choose the cause that matters most to you</p>
            </div>

            {charities.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.22)', textAlign: 'center', padding: '2rem 0' }}>
                Charities coming soon.
              </p>
            ) : (
              <div className="hp-charities">
                {charities.map(c => (
                  <div className="hp-charity" key={c.id}>
                    <div className="hp-charity-icon">❤️</div>
                    <p className="hp-charity-name">{c.name}</p>
                    <p className="hp-charity-desc">{c.description || 'Supporting a great cause.'}</p>
                    {c.website && (
                      <a href={c.website} target="_blank" className="hp-charity-link">Visit website →</a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="hp-charities-cta">
              <Link href="/charities" className="hp-outline-btn">View all charities →</Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="hp-cta-wrap">
          <div className="hp-cta-box">
            <div className="hp-cta-glow" />
            <h2 className="hp-cta-title">Ready to play with purpose?</h2>
            <p className="hp-cta-sub">Join thousands of golfers making every round count.</p>
            <Link href="/subscribe" className="hp-btn-main">Subscribe Now →</Link>
            <p className="hp-cta-note">From £7.50/month · Cancel anytime</p>
          </div>
        </div>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </>
  )
}