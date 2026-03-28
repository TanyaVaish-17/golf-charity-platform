'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/',            label: 'Home' },
    { href: '/charities',  label: 'Charities' },
    { href: '/subscribe',  label: 'Pricing' },
  ]

  return (
    <>
      <style>{`
        .nav-public {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          background: rgba(6,10,6,0.82);
          transition: box-shadow 0.25s, background 0.25s;
        }
        .nav-public.scrolled {
          background: rgba(6,10,6,0.96);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }

        /* Logo */
        .nav-logo {
          display: inline-flex; align-items: center;
          gap: 0.6rem; text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.05rem; color: #000;
          box-shadow: 0 4px 18px rgba(34,197,94,0.38);
          flex-shrink: 0;
        }
        .nav-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.3rem; color: #fff; letter-spacing: -0.02em;
        }
        .nav-logo-name span { color: #4ade80; }

        /* Centre links */
        .nav-links {
          display: flex; align-items: center; gap: 0.25rem;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-link {
          padding: 0.42rem 0.95rem; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          font-weight: 500; color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.18s, background 0.18s;
          position: relative;
        }
        .nav-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .nav-link.active {
          color: #4ade80;
          background: rgba(34,197,94,0.08);
        }
        .nav-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 18px; height: 2px; border-radius: 99px;
          background: #4ade80;
        }

        /* Right actions */
        .nav-right {
          display: flex; align-items: center; gap: 0.65rem;
        }
        .nav-login {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 0.4rem 0.9rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.18s;
        }
        .nav-login:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
        }
        .nav-cta {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none; border-radius: 10px;
          padding: 0.44rem 1.05rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.82rem; color: #000; cursor: pointer;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 14px rgba(34,197,94,0.32);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 22px rgba(34,197,94,0.44);
        }

        /* Mobile hamburger */
        .nav-burger {
          display: none; flex-direction: column;
          gap: 5px; cursor: pointer; padding: 4px;
          background: none; border: none;
        }
        .nav-burger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.55); border-radius: 99px;
          transition: all 0.22s;
        }
        .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .nav-drawer {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0;
          background: rgba(6,10,6,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          padding: 1.25rem 1.5rem 1.75rem;
          z-index: 99;
          animation: drawerIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-drawer.open { display: flex; flex-direction: column; gap: 0.4rem; }
        .nav-drawer-link {
          padding: 0.7rem 1rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          font-weight: 500; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: all 0.18s;
        }
        .nav-drawer-link:hover, .nav-drawer-link.active {
          background: rgba(34,197,94,0.07);
          color: #4ade80;
        }
        .nav-drawer-divider {
          height: 1px; background: rgba(255,255,255,0.05);
          margin: 0.6rem 0;
        }
        .nav-drawer-cta {
          display: block; text-align: center;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 13px; padding: 0.82rem;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.92rem; color: #000; text-decoration: none;
          margin-top: 0.4rem;
          box-shadow: 0 6px 20px rgba(34,197,94,0.3);
        }

        @media (max-width: 700px) {
          .nav-links { display: none; }
          .nav-login  { display: none; }
          .nav-cta    { display: none; }
          .nav-burger { display: flex; }
        }
      `}</style>

      <nav className={`nav-public${scrolled ? ' scrolled' : ''}`}>
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">G</div>
          <span className="nav-logo-name">Golf<span>Gives</span></span>
        </Link>

        {/* Centre nav links */}
        <div className="nav-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          <Link href="/login" className="nav-login">Log in</Link>
          <Link href="/subscribe" className="nav-cta">Get Started →</Link>
          <button
            className={`nav-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-drawer-link${pathname === href ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className="nav-drawer-divider" />
        <Link href="/login" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Log in</Link>
        <Link href="/subscribe" className="nav-drawer-cta" onClick={() => setMenuOpen(false)}>Get Started →</Link>
      </div>
    </>
  )
}