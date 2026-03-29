'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('profiles')
        .select('full_name, subscription_status, is_admin')
        .eq('id', data.user.id)
        .single()
        .then(({ data: p }) => {
          setProfile(p)
          setIsActive(p?.subscription_status === 'active')
          setIsAdmin(p?.is_admin || false)
        })
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Golfer'
  const initial = firstName[0]?.toUpperCase() || 'G'

  const links = [
    { href: '/',          label: 'Home' },
    { href: '/charities', label: 'Charities' },
    { href: '/dashboard', label: 'Dashboard' },
    ...(isAdmin ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
  ]

  return (
    <>
      <style>{`
        .nav-auth {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          background: rgba(6,10,6,0.82);
          transition: box-shadow 0.25s, background 0.25s;
        }
        .nav-auth.scrolled {
          background: rgba(6,10,6,0.96);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }

        .nav-auth-logo {
          display: inline-flex; align-items: center;
          gap: 0.6rem; text-decoration: none; flex-shrink: 0;
        }
        .nav-auth-logo-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.05rem; color: #000;
          box-shadow: 0 4px 18px rgba(34,197,94,0.38); flex-shrink: 0;
        }
        .nav-auth-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.3rem; color: #fff; letter-spacing: -0.02em;
        }
        .nav-auth-logo-name span { color: #4ade80; }

        .nav-auth-links {
          display: flex; align-items: center; gap: 0.25rem;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-auth-link {
          padding: 0.42rem 0.95rem; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          font-weight: 500; color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.18s, background 0.18s;
          position: relative;
        }
        .nav-auth-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .nav-auth-link.active {
          color: #4ade80;
          background: rgba(34,197,94,0.08);
        }
        .nav-auth-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 18px; height: 2px; border-radius: 99px;
          background: #4ade80;
        }
        .nav-auth-link.admin-link {
          color: rgba(34,197,94,0.7);
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.15);
        }
        .nav-auth-link.admin-link:hover {
          color: #4ade80;
          background: rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.3);
        }
        .nav-auth-link.admin-link.active {
          color: #4ade80;
          background: rgba(34,197,94,0.15);
          border-color: rgba(34,197,94,0.35);
        }

        .nav-auth-right {
          display: flex; align-items: center; gap: 0.65rem;
        }
        .nav-auth-sub-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none; border-radius: 10px;
          padding: 0.44rem 1.05rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.82rem; color: #000;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 14px rgba(34,197,94,0.32);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .nav-auth-sub-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 22px rgba(34,197,94,0.44);
        }
        .nav-auth-user {
          display: flex; align-items: center; gap: 0.55rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 99px; padding: 0.28rem 0.85rem 0.28rem 0.35rem;
        }
        .nav-auth-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.72rem; color: #000; flex-shrink: 0;
        }
        .nav-auth-username {
          font-size: 0.82rem; color: rgba(255,255,255,0.6); font-weight: 400;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-auth-signout {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 0.4rem 0.85rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          color: rgba(255,255,255,0.38); cursor: pointer;
          transition: all 0.18s;
        }
        .nav-auth-signout:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.2);
          color: #f87171;
        }

        .nav-auth-burger {
          display: none; flex-direction: column;
          gap: 5px; cursor: pointer; padding: 4px;
          background: none; border: none;
        }
        .nav-auth-burger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.55); border-radius: 99px;
          transition: all 0.22s;
        }
        .nav-auth-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-auth-burger.open span:nth-child(2) { opacity: 0; }
        .nav-auth-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .nav-auth-drawer {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0;
          background: rgba(6,10,6,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          padding: 1.25rem 1.5rem 1.75rem;
          z-index: 99;
          animation: drawerIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
          flex-direction: column; gap: 0.4rem;
        }
        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-auth-drawer.open { display: flex; }
        .nav-auth-drawer-link {
          padding: 0.7rem 1rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          font-weight: 500; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: all 0.18s;
        }
        .nav-auth-drawer-link:hover, .nav-auth-drawer-link.active {
          background: rgba(34,197,94,0.07); color: #4ade80;
        }
        .nav-auth-drawer-link.admin-drawer-link {
          color: rgba(34,197,94,0.6);
          background: rgba(34,197,94,0.04);
          border: 1px solid rgba(34,197,94,0.12);
        }
        .nav-auth-drawer-link.admin-drawer-link:hover {
          background: rgba(34,197,94,0.1); color: #4ade80;
        }
        .nav-auth-drawer-divider {
          height: 1px; background: rgba(255,255,255,0.05); margin: 0.6rem 0;
        }
        .nav-auth-drawer-signout {
          padding: 0.7rem 1rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          font-weight: 500; color: rgba(239,68,68,0.6);
          background: none; border: none; cursor: pointer;
          text-align: left; width: 100%; transition: all 0.18s;
        }
        .nav-auth-drawer-signout:hover {
          background: rgba(239,68,68,0.08); color: #f87171;
        }

        @media (max-width: 700px) {
          .nav-auth-links    { display: none; }
          .nav-auth-user     { display: none; }
          .nav-auth-signout  { display: none; }
          .nav-auth-sub-btn  { display: none; }
          .nav-auth-burger   { display: flex; }
        }
      `}</style>

      <nav className={`nav-auth${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="nav-auth-logo">
          <div className="nav-auth-logo-icon">G</div>
          <span className="nav-auth-logo-name">Golf<span>Gives</span></span>
        </Link>

        <div className="nav-auth-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-auth-link${pathname === href ? ' active' : ''}${href === '/admin' ? ' admin-link' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-auth-right">
          {!isActive && (
            <Link href="/subscribe" className="nav-auth-sub-btn">Subscribe →</Link>
          )}
          <div className="nav-auth-user">
            <div className="nav-auth-avatar">{initial}</div>
            <span className="nav-auth-username">{firstName}</span>
          </div>
          <button className="nav-auth-signout" onClick={handleSignOut}>Sign out</button>
          <button
            className={`nav-auth-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-auth-drawer${menuOpen ? ' open' : ''}`}>
        <div className="nav-auth-user" style={{ marginBottom: '0.5rem', borderRadius: '12px', padding: '0.7rem 1rem' }}>
          <div className="nav-auth-avatar">{initial}</div>
          <span className="nav-auth-username">{firstName}</span>
        </div>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-auth-drawer-link${pathname === href ? ' active' : ''}${href === '/admin' ? ' admin-drawer-link' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className="nav-auth-drawer-divider" />
        <button className="nav-auth-drawer-signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </>
  )
}