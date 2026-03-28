'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SubscribePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(null)
  const [billingCycle, setBillingCycle] = useState('yearly')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleSubscribe = async (priceId, planName) => {
    if (!user) { router.push('/login'); return }
    setLoading(planName)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { alert('Something went wrong. Please try again.'); setLoading(null) }
  }

  const plans = {
    monthly: {
      name: 'Monthly', priceNum: '9.99', period: '/mo',
      sub: null, priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID, savings: null,
    },
    yearly: {
      name: 'Yearly', priceNum: '89.99', period: '/yr',
      sub: 'Just £7.50/month — billed annually',
      priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID, savings: 'Save 25%',
    },
  }

  const features = [
    { icon: '🏌️', text: 'Enter & track your Stableford scores' },
    { icon: '🎰', text: 'Monthly prize draw entries' },
    { icon: '❤️', text: 'Support a charity of your choice' },
    { icon: '🏆', text: 'Win from a shared prize pool' },
    { icon: '📊', text: 'Full performance dashboard' },
    { icon: '📧', text: 'Draw result notifications' },
  ]

  const prizes = [
    { pct: '40%', label: 'Jackpot Pool',  sub: '5-number match' },
    { pct: '35%', label: 'Second Prize',  sub: '4-number match' },
    { pct: '25%', label: 'Third Prize',   sub: '3-number match' },
  ]

  const plan = plans[billingCycle]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sub-root {
          min-height: 100vh;
          background: #060a06;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
          display: flex; flex-direction: column;
        }
        .sub-bg-top {
          position: fixed; top: -180px; left: 50%;
          transform: translateX(-50%);
          width: 1000px; height: 560px;
          background: radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.16) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .sub-bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.032) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 90% 55% at 50% 15%, black 20%, transparent 80%);
          pointer-events: none; z-index: 0;
        }
        .sub-orb-l {
          position: fixed; width: 380px; height: 380px;
          top: 25%; left: -130px;
          background: radial-gradient(circle, rgba(34,197,94,0.09), transparent 70%);
          filter: blur(75px); pointer-events: none; z-index: 0;
        }
        .sub-orb-r {
          position: fixed; width: 300px; height: 300px;
          bottom: 8%; right: -90px;
          background: radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%);
          filter: blur(70px); pointer-events: none; z-index: 0;
          animation: orbPulse 9s ease-in-out infinite;
        }
        @keyframes orbPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.15); opacity: .65; }
        }
        .sub-main { flex: 1; }
        .sub-body {
          position: relative; z-index: 1;
          max-width: 860px; margin: 0 auto;
          padding: 3.25rem 1.5rem 5rem;
        }
        .sub-heading {
          text-align: center; margin-bottom: 2.5rem;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sub-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2rem, 5vw, 3.1rem);
          color: #fff; letter-spacing: -0.04em;
          line-height: 1.05; margin-bottom: 0.65rem;
        }
        .sub-title span { color: #4ade80; }
        .sub-desc {
          font-size: 0.96rem; color: rgba(255,255,255,0.35);
          font-weight: 300; max-width: 400px;
          margin: 0 auto; line-height: 1.65;
        }
        /* Toggle */
        .toggle-wrap {
          display: flex; justify-content: center;
          margin-bottom: 2.1rem;
          animation: fadeUp 0.5s 0.07s cubic-bezier(0.16,1,0.3,1) both;
        }
        .toggle-pill {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 4px; gap: 4px;
        }
        .toggle-btn {
          padding: 0.55rem 1.35rem; border-radius: 10px;
          border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.88rem;
          transition: all 0.2s; display: flex; align-items: center; gap: 0.45rem;
          background: transparent; color: rgba(255,255,255,0.32);
        }
        .toggle-btn.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #000; box-shadow: 0 4px 14px rgba(34,197,94,0.35);
        }
        .toggle-badge {
          font-size: 0.65rem; font-weight: 700;
          padding: 0.12rem 0.42rem; border-radius: 99px;
          background: rgba(0,0,0,0.18); color: inherit;
        }
        .toggle-btn:not(.active) .toggle-badge { background: rgba(34,197,94,0.15); color: #4ade80; }
        /* Grid */
        .sub-grid {
          display: grid; grid-template-columns: 1fr 1.1fr;
          gap: 1.25rem; margin-bottom: 1.5rem; align-items: start;
          animation: fadeUp 0.5s 0.13s cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 660px) { .sub-grid { grid-template-columns: 1fr; } }
        /* Plan card */
        .plan-card {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(34,197,94,0.22); border-radius: 26px; overflow: hidden;
          position: relative;
          box-shadow: 0 0 55px rgba(34,197,94,0.09), inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
        }
        .plan-card::before {
          content: ''; position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.55), transparent);
        }
        .plan-card-glow {
          position: absolute; bottom:-70px; right:-70px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%);
          pointer-events: none;
        }
        .plan-price-section {
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .savings-tag {
          display: inline-flex; align-items: center;
          background: rgba(34,197,94,0.13); border: 1px solid rgba(34,197,94,0.28);
          border-radius: 99px; padding: 0.2rem 0.6rem;
          font-size: 0.7rem; font-weight: 700; color: #4ade80;
          letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 1rem;
        }
        .plan-price-row { display: flex; align-items: flex-start; gap: 0.12rem; margin-bottom: 0.22rem; }
        .plan-currency {
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.55rem;
          color: rgba(255,255,255,0.5); margin-top: 0.5rem; line-height: 1;
        }
        .plan-price-num {
          font-family: 'Playfair Display', serif; font-weight: 900; font-size: 3.8rem;
          color: #fff; letter-spacing: -0.03em; line-height: 1;
        }
        .plan-period { font-size: 0.88rem; color: rgba(255,255,255,0.3); align-self: flex-end; margin-bottom: 0.25rem; margin-left: 0.2rem; }
        .plan-sub { font-size: 0.78rem; color: rgba(255,255,255,0.27); font-style: italic; font-weight: 300; min-height: 1.1rem; }
        .plan-features-section { padding: 1.4rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .plan-feature-row {
          display: flex; align-items: center; gap: 0.72rem;
          padding: 0.48rem 0; border-bottom: 1px solid rgba(255,255,255,0.032);
        }
        .plan-feature-row:last-child { border-bottom: none; }
        .plan-feature-check {
          width: 17px; height: 17px; border-radius: 50%; flex-shrink: 0;
          background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.28);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.56rem; color: #4ade80;
        }
        .plan-feature-text { font-size: 0.84rem; color: rgba(255,255,255,0.6); }
        .plan-cta-section { padding: 1.4rem 2rem 1.9rem; }
        .sub-btn {
          width: 100%; padding: 0.95rem; border-radius: 13px; border: none; cursor: pointer;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.97rem; color: #000;
          background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
          box-shadow: 0 7px 26px rgba(34,197,94,0.38), 0 0 0 1px rgba(34,197,94,0.18);
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .sub-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.16), transparent);
        }
        .sub-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 34px rgba(34,197,94,0.48); }
        .sub-btn:active:not(:disabled) { transform: translateY(0); }
        .sub-btn:disabled { background: #166534; box-shadow: none; cursor: not-allowed; opacity: .7; }
        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(0,0,0,0.25); border-top-color: #000;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          margin-right: 0.45rem; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sub-btn-note {
          text-align: center; font-size: 0.7rem;
          color: rgba(255,255,255,0.18); margin-top: 0.7rem; letter-spacing: 0.02em;
        }
        /* Highlights */
        .highlights-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 26px; padding: 2rem;
          backdrop-filter: blur(14px); display: flex; flex-direction: column; gap: 1.5rem;
        }
        .hl-section-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.68rem; color: rgba(255,255,255,0.28);
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.8rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .hl-section-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .hl-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
        .hl-stat {
          background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.12);
          border-radius: 14px; padding: 0.95rem;
        }
        .hl-stat-val {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.4rem; color: #4ade80; letter-spacing: -0.02em; margin-bottom: 0.18rem;
        }
        .hl-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.28); font-weight: 300; }
        .hl-steps { display: flex; flex-direction: column; gap: 0.55rem; }
        .hl-step { display: flex; align-items: flex-start; gap: 0.7rem; }
        .hl-step-num {
          width: 23px; height: 23px; border-radius: 7px; flex-shrink: 0;
          background: rgba(34,197,94,0.11); border: 1px solid rgba(34,197,94,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.7rem; color: #4ade80;
        }
        .hl-step-text { font-size: 0.83rem; color: rgba(255,255,255,0.5); line-height: 1.5; padding-top: 0.1rem; }
        /* Prize */
        .prize-section { animation: fadeUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
        .prize-label {
          text-align: center; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.68rem; color: rgba(255,255,255,0.2);
          text-transform: uppercase; letter-spacing: 0.13em; margin-bottom: 1rem;
        }
        .prize-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
        @media (max-width: 480px) { .prize-grid { grid-template-columns: 1fr; } }
        .prize-card { border-radius: 20px; padding: 1.35rem 1rem; text-align: center; transition: transform 0.2s; }
        .prize-card:hover { transform: translateY(-3px); }
        .prize-card-0 { background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.2); box-shadow: 0 0 28px rgba(34,197,94,0.08); }
        .prize-card-1 { background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.11); }
        .prize-card-2 { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); }
        .prize-pct { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 2.3rem; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.32rem; }
        .prize-card-0 .prize-pct { color: #4ade80; }
        .prize-card-1 .prize-pct { color: #86efac; }
        .prize-card-2 .prize-pct { color: rgba(255,255,255,0.4); }
        .prize-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.84rem; color: rgba(255,255,255,0.72); margin-bottom: 0.18rem; }
        .prize-sub { font-size: 0.69rem; color: rgba(255,255,255,0.2); font-weight: 300; }
      `}</style>

      <div className="sub-root">
        <div className="sub-bg-top" />
        <div className="sub-bg-grid" />
        <div className="sub-orb-l" />
        <div className="sub-orb-r" />

        {/* ── Shared Navbar ── */}
        <Navbar />

        <main className="sub-main">
          <div className="sub-body">
            <div className="sub-heading">
              <h1 className="sub-title">Choose your <span>plan</span></h1>
              <p className="sub-desc">One subscription. Monthly prize draws, charity impact, and full score tracking.</p>
            </div>

            <div className="toggle-wrap">
              <div className="toggle-pill">
                <button
                  className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >Monthly</button>
                <button
                  className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >Yearly <span className="toggle-badge">Save 25%</span></button>
              </div>
            </div>

            <div className="sub-grid">
              <div className="plan-card">
                <div className="plan-card-glow" />
                <div className="plan-price-section">
                  {plan.savings && <div className="savings-tag">✦ {plan.savings}</div>}
                  <div className="plan-price-row">
                    <span className="plan-currency">£</span>
                    <span className="plan-price-num">{plan.priceNum}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>
                  <p className="plan-sub">{plan.sub || '\u00a0'}</p>
                </div>
                <div className="plan-features-section">
                  {features.map(({ icon, text }) => (
                    <div className="plan-feature-row" key={text}>
                      <div className="plan-feature-check">✓</div>
                      <span className="plan-feature-text">{icon} {text}</span>
                    </div>
                  ))}
                </div>
                <div className="plan-cta-section">
                  <button
                    className="sub-btn"
                    onClick={() => handleSubscribe(plan.priceId, billingCycle)}
                    disabled={loading === billingCycle}
                  >
                    {loading === billingCycle
                      ? <><span className="spinner" />Redirecting...</>
                      : `Get Started — ${plan.name} →`}
                  </button>
                  <p className="sub-btn-note">Cancel anytime · Secure payment via Stripe 🔒</p>
                </div>
              </div>

              <div className="highlights-card">
                <div>
                  <p className="hl-section-title">Community</p>
                  <div className="hl-stats">
                    {[
                      { val: '1,200+', label: 'Active members' },
                      { val: '£48K+',  label: 'Raised for charity' },
                      { val: '36',     label: 'Prize draws held' },
                      { val: '100%',   label: 'Secure & encrypted' },
                    ].map(({ val, label }) => (
                      <div className="hl-stat" key={label}>
                        <div className="hl-stat-val">{val}</div>
                        <div className="hl-stat-label">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="hl-section-title">How it works</p>
                  <div className="hl-steps">
                    {[
                      'Subscribe and receive your monthly draw numbers',
                      'Submit your Stableford scores after each round',
                      'We match scores to numbers every month',
                      'Win prizes and support your chosen charity',
                    ].map((step, i) => (
                      <div className="hl-step" key={i}>
                        <div className="hl-step-num">{i + 1}</div>
                        <p className="hl-step-text">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="prize-section">
              <p className="prize-label">Prize Pool Distribution</p>
              <div className="prize-grid">
                {prizes.map(({ pct, label, sub }, i) => (
                  <div className={`prize-card prize-card-${i}`} key={label}>
                    <div className="prize-pct">{pct}</div>
                    <div className="prize-name">{label}</div>
                    <div className="prize-sub">{sub}</div>
                  </div>
                ))}
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