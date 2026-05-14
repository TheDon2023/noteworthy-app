import { useNavigate } from 'react-router';

/* ===== SVG Icons ===== */
const IPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.9.39 1.77.74 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.83.35 1.7.61 2.6.74A2 2 0 0 1 22 16.92z"/></svg>;
const IUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IShieldCheck = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const ILock = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ITarget = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IDollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IHome = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ITrend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IBinoc = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 16.5a2.5 2.5 0 0 1-5 0V13a2.5 2.5 0 0 1 5 0z"/><path d="M18.5 16.5a2.5 2.5 0 0 1-5 0V13a2.5 2.5 0 0 1 5 0z"/><path d="M2 13h3"/><path d="M19 13h3"/><path d="M8 10V7a2 2 0 0 1 4 0v3"/><path d="M12 10V7a2 2 0 0 1 4 0v3"/></svg>;
const ISearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IHandshake = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/><path d="M12 5.36 8.87 8.5"/><path d="M15.13 8.5 12 5.36"/></svg>;
const IFile = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const IShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

/* ===== Data ===== */
const NAV = ['SERVICES', 'OUR PROCESS', 'ABOUT US', 'RESOURCES', 'CONTACT'];
const TRUST = [
  { icon: <IShieldCheck />, l1: 'Institutional', l2: 'Due Diligence' },
  { icon: <ILock />, l1: 'Secure &', l2: 'Compliant' },
  { icon: <ITarget />, l1: 'Results-Driven', l2: 'Approach' },
];
const STATS = [
  { v: '$50M+', l: 'NOTES TRADED', icon: <IDollar /> },
  { v: '200+', l: 'QUALIFIED BUYERS', icon: <IUsers /> },
  { v: '1,500+', l: 'SELLER LEADS', icon: <IHome /> },
  { v: '12-18%', l: 'AVERAGE YIELD', icon: <ITrend /> },
];
const SVC = [
  { icon: <IBinoc />, title: 'Acquire', desc: 'We source high-quality notes from motivated sellers nationwide.' },
  { icon: <ISearch />, title: 'Underwrite', desc: 'Our team conducts thorough analysis to assess risk and value.' },
  { icon: <IHandshake />, title: 'Match', desc: 'We connect qualified buyers with the right opportunities.' },
  { icon: <IFile />, title: 'Close', desc: 'We coordinate secure, efficient closings through trusted partners.' },
  { icon: <IShield />, title: 'Manage', desc: 'We support investors with servicing and ongoing oversight.' },
];

const gold = '#C5A059';
const navy = '#051020';
const offWhite = '#F8F9FA';
const muted = '#a8b2d1';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* =================== HERO =================== */}
      <section style={{ position: 'relative', background: navy, overflow: 'hidden', minHeight: '480px' }}>

        {/* Hero scroll — far right decorative only */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: '60px',
          width: '45%',
          height: ' calc(100% - 60px)',
          backgroundImage: 'url(/hero-v3.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'right top',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }} />

        {/* Navy overlay — left side only, scroll visible on right */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '75%',
          height: '100%',
          background: `linear-gradient(90deg, ${navy} 0%, ${navy} 90%, transparent 100%)`,
          zIndex: 2,
        }} />

        {/* HEADER */}
        <header style={{ position: 'relative', zIndex: 10, borderBottom: `1px solid ${gold}18`, height: '60px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <img src="/logo-lockup.png" alt="NoteWorthy Capital LLC" style={{ height: '40px', width: 'auto' }} />

            <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: '30px' }}>
              {NAV.map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-[#C5A059] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.10em', fontWeight: 400, color: muted, textTransform: 'uppercase', textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </nav>

            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 hover:bg-[#C5A059]/10 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 400, color: gold, border: `1px solid ${gold}`, padding: '10px 20px', borderRadius: '2px', background: 'transparent', cursor: 'pointer', textTransform: 'uppercase' }}>
              <IUser /> Employee Login
            </button>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 48px 80px' }}>
          <div style={{ maxWidth: '520px', background: navy, padding: '16px 0' }}>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(48px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, color: offWhite, margin: 0, letterSpacing: '-0.02em' }}>
              Turning Paper
            </h1>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(48px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, color: gold, margin: 0, letterSpacing: '-0.02em' }}>
              Into Liquidity.
            </h1>

            <div style={{ width: '50px', height: '2px', background: gold, margin: '16px 0' }} />

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.65, color: muted, maxWidth: '400px', margin: '0 0 20px 0' }}>
              NoteWorthy Capital LLC specializes in the acquisition and sale of performing and non-performing mortgage notes. Our AI-trained team and vetted buyer network deliver consistent results with institutional-grade due diligence.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button className="flex items-center gap-2 hover:brightness-110 transition-all"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: navy, background: gold, padding: '14px 24px', borderRadius: '3px', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
                <IPhone /> Sell Your Note
              </button>
              <button className="flex items-center gap-2 hover:bg-[#C5A059]/8 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', color: gold, background: 'transparent', padding: '14px 24px', borderRadius: '3px', border: `1px solid ${gold}55`, cursor: 'pointer', textTransform: 'uppercase' }}>
                <IUser /> Join Buyer Pool
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '28px' }}>
              {TRUST.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: `1px solid ${gold}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, flexShrink: 0 }}>
                    {t.icon}
                  </div>
                  <div style={{ lineHeight: 1.3 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: offWhite, margin: 0 }}>{t.l1}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: muted, margin: 0 }}>{t.l2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* =================== STATS BAR =================== */}
      <section style={{ position: 'relative', zIndex: 20, marginTop: '-48px', padding: '0 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#080e1a', border: `1px solid ${gold}18`, borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '22px 16px', borderRight: i < 3 ? `1px solid ${gold}12` : 'none' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `1px solid ${gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: gold }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '30px', fontWeight: 700, color: offWhite, margin: 0, lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.12em', color: muted, margin: '2px 0 0 0', textTransform: 'uppercase' }}>{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== WHAT WE DO =================== */}
      <section id="services" style={{ background: '#F7F2E8', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/cream-pattern.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '60px 48px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.38em', fontWeight: 500, color: gold, marginBottom: '16px', textTransform: 'uppercase' }}>What We Do</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(30px, 3.5vw, 40px)', fontWeight: 700, color: navy, lineHeight: 1.15, margin: '0 0 16px 0' }}>
              Full-Service Note Trading
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '1px', background: `${gold}35` }} />
              <div style={{ width: '6px', height: '6px', background: gold, transform: 'rotate(45deg)' }} />
              <div style={{ width: '48px', height: '1px', background: `${gold}35` }} />
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: 1.6, color: '#6b7a94', maxWidth: '520px', margin: '0 auto' }}>
              From acquisition through closing, we manage the entire process with precision and integrity.
            </p>
          </div>

          {/* Services */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
            {SVC.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: navy, color: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: navy, margin: '0 0 5px 0' }}>{s.title}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, color: '#6b7a94', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer style={{ background: navy, borderTop: `1px solid ${gold}06` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/nw-monogram.png" alt="" style={{ height: '20px', width: 'auto', opacity: 0.5 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 300, color: muted, margin: 0 }}>© 2026 NoteWorthy Capital LLC. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Disclosures'].map(item => (
              <span key={item} className="hover:text-[#C5A059] transition-colors cursor-pointer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 300, color: muted }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
