'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
  
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single()
  
    if (profile?.is_admin) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          padding-top: 0;
          padding: 0 ;
          background: #060a06;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Mesh gradient background */
        .bg-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(34,197,94,0.13) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(21,128,61,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(5,46,22,0.4) 0%, transparent 70%);
        }

        /* Grid overlay */
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 420px; height: 420px;
          top: -120px; right: -80px;
          background: radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%);
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 320px; height: 320px;
          bottom: -100px; left: -60px;
          background: radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%);
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 480px;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          margin: 4rem auto 0;;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Card */
        .auth-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 2.75rem;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.06),
            0 32px 80px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.07);
          animation: fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.85rem;
          color: #fff;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
        }
        .card-subtitle {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.35);
          margin-bottom: 2.25rem;
          font-weight: 300;
        }

        /* Divider line */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent);
          margin-bottom: 2.25rem;
        }

        /* Fields */
        .field-group {
          margin-bottom: 1.25rem;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.6rem;
        }
        .field-label-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #22c55e;
          opacity: 0.6;
        }

        .field-wrap {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          font-size: 1rem;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-wrap.is-focused .field-icon {
          color: #22c55e;
        }

        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.95rem 1rem 0.95rem 2.85rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-input:focus {
          border-color: rgba(34,197,94,0.5);
          background: rgba(34,197,94,0.05);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.1), 0 4px 16px rgba(0,0,0,0.3);
        }
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0b1f10 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
          border-color: rgba(34,197,94,0.5) !important;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
        }
        .error-icon { font-size: 1rem; }
        .error-text { font-size: 0.85rem; color: #f87171; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.01em;
          color: #000;
          background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
          box-shadow: 0 8px 32px rgba(34,197,94,0.35), 0 0 0 1px rgba(34,197,94,0.2);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: inherit;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(34,197,94,0.45), 0 0 0 1px rgba(34,197,94,0.3);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          background: linear-gradient(135deg, #166534, #14532d);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Loading spinner */
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .card-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }
        .card-footer p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.3);
        }
        .card-footer a {
          color: #4ade80;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .card-footer a:hover { color: #86efac; }

        /* Trust badge */
        .trust-badge {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.03em;
          animation: fadeUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .trust-badge span {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .trust-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: inline-block;
        }
        .sub-nav {
          position: relative;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.3rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          background: rgba(6,10,6,0.75);
          width: 100%;
        }
        .sub-logo {
          display: inline-flex; align-items: center;
          gap: 0.6rem; text-decoration: none;
        }
        .sub-logo-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.1rem; color: #000;
          box-shadow: 0 4px 20px rgba(34,197,94,0.4); flex-shrink: 0;
        }
        .sub-logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.35rem;
          color: #fff; letter-spacing: -0.02em;
        }
        .sub-logo-name span { color: #4ade80; }
        .sub-nav-pill {
          display: flex; align-items: center; gap: 0.4rem;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 99px; padding: 0.28rem 0.8rem;
          font-size: 0.72rem; font-weight: 600;
          color: #4ade80; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .blink-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
      `}</style>

      <div className="auth-root">
        <div className="bg-mesh" />
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <nav className="sub-nav">
          <Link href="/" className="sub-logo">
            <div className="sub-logo-icon">G</div>
            <span className="sub-logo-name">Golf<span>Gives</span></span>
          </Link>
          <div className="sub-nav-pill">
            <span className="blink-dot" />1,200+ members
          </div>
        </nav>
        <div className="auth-container">
          {/* Card */}
          <div className="auth-card">
            <h1 className="card-title">Welcome back</h1>
            <p className="card-subtitle">Sign in to your account to continue</p>
            <div className="divider" />

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="field-group">
                <label className="field-label">
                  <span className="field-label-dot" />
                  Email Address
                </label>
                <div className={`field-wrap ${focused === 'email' ? 'is-focused' : ''}`}>
                  <span className="field-icon">✉</span>
                  <input
                    className="auth-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">
                  <span className="field-label-dot" />
                  Password
                </label>
                <div className={`field-wrap ${focused === 'password' ? 'is-focused' : ''}`}>
                  <span className="field-icon">🔑</span>
                  <input
                    className="auth-input"
                    type="password"
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Your password"
                  />
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <span className="error-icon">⚠</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner" />Signing in...</>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            <div className="card-footer">
              <p>
                Don't have an account?{' '}
                <Link href="/signup">Create one free</Link>
              </p>
            </div>
          </div>

          <p className="trust-badge">
            <span>
              🔒 Secured with Stripe
              <span className="trust-dot" />
              Supabase
              <span className="trust-dot" />
              Your data is always protected
            </span>
          </p>
        </div>
      </div>
    </>
  )
}