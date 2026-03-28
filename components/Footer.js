import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  const navLinks = [
    { href: '/',           label: 'Home' },
    { href: '/charities',  label: 'Charities' },
    { href: '/subscribe',  label: 'Pricing' },
    { href: '/dashboard',  label: 'Dashboard' },
  ]

  const socials = [
    {
      label: 'X / Twitter',
      href: 'https://twitter.com/golfgives',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com/golfgives',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      <style>{`
        .footer {
          position: relative; overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(6,10,6,0.95);
          padding: 3.5rem 2rem 2.25rem;
        }
        .footer::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 55%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.35), transparent);
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
        }

        /* Top row */
        .footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 700px) {
          .footer-top { grid-template-columns: 1fr; gap: 2rem; }
        }

        /* Brand */
        .footer-brand {}
        .footer-logo {
          display: inline-flex; align-items: center;
          gap: 0.6rem; text-decoration: none; margin-bottom: 1rem;
        }
        .footer-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1rem; color: #000;
          box-shadow: 0 4px 14px rgba(34,197,94,0.3);
          flex-shrink: 0;
        }
        .footer-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.25rem; color: #fff; letter-spacing: -0.02em;
        }
        .footer-logo-name span { color: #4ade80; }
        .footer-tagline {
          font-size: 0.85rem; color: rgba(255,255,255,0.28);
          font-weight: 300; line-height: 1.65;
          max-width: 260px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Nav col */
        .footer-col-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.72rem; color: rgba(255,255,255,0.28);
          text-transform: uppercase; letter-spacing: 0.12em;
          margin-bottom: 1rem;
        }
        .footer-links {
          display: flex; flex-direction: column; gap: 0.55rem;
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          font-weight: 400; color: rgba(255,255,255,0.38);
          text-decoration: none; transition: color 0.18s;
          width: fit-content;
        }
        .footer-link:hover { color: #4ade80; }

        /* Connect col */
        .footer-contact-item {
          display: flex; align-items: center; gap: 0.55rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: rgba(255,255,255,0.38); margin-bottom: 0.7rem;
        }
        .footer-contact-icon {
          font-size: 0.85rem; flex-shrink: 0;
        }
        .footer-contact-link {
          color: rgba(255,255,255,0.38); text-decoration: none;
          transition: color 0.18s;
        }
        .footer-contact-link:hover { color: #4ade80; }
        .footer-socials {
          display: flex; gap: 0.55rem; margin-top: 1.1rem;
        }
        .footer-social {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.3); text-decoration: none;
          transition: all 0.18s;
        }
        .footer-social:hover {
          background: rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.25);
          color: #4ade80;
        }

        /* Bottom bar */
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(255,255,255,0.045);
          gap: 1rem; flex-wrap: wrap;
        }
        .footer-copy {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          color: rgba(255,255,255,0.18); font-weight: 300;
        }
        .footer-copy span { color: rgba(34,197,94,0.55); }
        .footer-legal {
          display: flex; gap: 1.25rem;
        }
        .footer-legal a {
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          color: rgba(255,255,255,0.18); text-decoration: none;
          transition: color 0.18s;
        }
        .footer-legal a:hover { color: rgba(255,255,255,0.45); }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <div className="footer-logo-icon">G</div>
                <span className="footer-logo-name">Golf<span>Gives</span></span>
              </Link>
              <p className="footer-tagline">
                A subscription golf platform combining performance tracking, monthly prize draws, and charitable giving.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="footer-col-title">Navigate</p>
              <div className="footer-links">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className="footer-link">{label}</Link>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <p className="footer-col-title">Connect</p>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:hello@golfgives.com" className="footer-contact-link">
                  hello@golfgives.com
                </a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>United Kingdom</span>
              </div>
              <div className="footer-socials">
                {socials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social"
                    aria-label={label}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {year} <span>GolfGives</span>. All rights reserved. Play. Win. Give.
            </p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}