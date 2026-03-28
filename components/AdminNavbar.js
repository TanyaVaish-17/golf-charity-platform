'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// activeTab and setActiveTab are passed from AdminPage so tabs stay in sync
export default function AdminNavbar({ activeTab, setActiveTab }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const tabs = ['overview', 'users', 'draws', 'charities', 'winners']

  return (
    <>
      <style>{`
        .nav-admin {
          position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(20px);
        }

        /* Top bar */
        .nav-admin-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.5rem; height: 60px;
          max-width: 1280px; margin: 0 auto;
        }
        .nav-admin-left {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .nav-admin-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1rem; color: #000;
          box-shadow: 0 4px 14px rgba(34,197,94,0.35);
          flex-shrink: 0;
          text-decoration: none;
        }
        .nav-admin-brand {
          display: flex; align-items: center; gap: 0.55rem;
          text-decoration: none;
        }
        .nav-admin-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.2rem; color: #fff; letter-spacing: -0.02em;
          text-decoration: none;
        }
        .nav-admin-badge {
          font-size: 0.65rem; font-weight: 700;
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.28);
          color: #4ade80;
          padding: 0.15rem 0.55rem; border-radius: 99px;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'Syne', sans-serif;
        }
        .nav-admin-right {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .nav-admin-home {
          font-size: 0.8rem; color: rgba(255,255,255,0.3);
          text-decoration: none; font-family: 'DM Sans', sans-serif;
          padding: 0.35rem 0.75rem; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.18s;
        }
        .nav-admin-home:hover {
          color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.04);
        }
        .nav-admin-signout {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 0.38rem 0.85rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          color: rgba(255,255,255,0.35); cursor: pointer;
          transition: all 0.18s;
        }
        .nav-admin-signout:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.2);
          color: #f87171;
        }

        /* Tab bar */
        .nav-admin-tabs {
          display: flex; align-items: center; gap: 0.25rem;
          padding: 0 1.5rem 0;
          max-width: 1280px; margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .nav-admin-tabs::-webkit-scrollbar { display: none; }
        .nav-admin-tab {
          padding: 0.55rem 1.15rem;
          border-radius: 10px 10px 0 0;
          font-family: 'Syne', sans-serif; font-weight: 600;
          font-size: 0.82rem; color: rgba(255,255,255,0.32);
          background: none; border: none; cursor: pointer;
          text-transform: capitalize; white-space: nowrap;
          transition: color 0.18s, background 0.18s;
          position: relative;
        }
        .nav-admin-tab:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
        }
        .nav-admin-tab.active {
          color: #4ade80;
          background: rgba(34,197,94,0.07);
        }
        .nav-admin-tab.active::after {
          content: '';
          position: absolute; bottom: 0; left: 0.75rem; right: 0.75rem;
          height: 2px; border-radius: 99px 99px 0 0;
          background: #4ade80;
        }

        /* Tab icons */
        .tab-icon { margin-right: 0.35rem; font-size: 0.88rem; }
      `}</style>

      <nav className="nav-admin">
        {/* Top bar */}
        <div className="nav-admin-top">
          <div className="nav-admin-left">
            <Link href="/" className="nav-admin-brand">
              <div className="nav-admin-logo-icon">G</div>
              <span className="nav-admin-name">GolfGives</span>
            </Link>
            <span className="nav-admin-badge">Admin</span>
          </div>
          <div className="nav-admin-right">
            <Link href="/dashboard" className="nav-admin-home">← Dashboard</Link>
            <button className="nav-admin-signout" onClick={handleSignOut}>Log out</button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="nav-admin-tabs">
          {[
            { key: 'overview',   icon: '📊' },
            { key: 'users',      icon: '👥' },
            { key: 'draws',      icon: '🎰' },
            { key: 'charities',  icon: '❤️' },
            { key: 'winners',    icon: '🏆' },
          ].map(({ key, icon }) => (
            <button
              key={key}
              className={`nav-admin-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span className="tab-icon">{icon}</span>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}