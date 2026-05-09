import { useNavigate } from 'react-router';

/* ===== Inline SVG Icons ===== */
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.9.39 1.77.74 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.83.35 1.7.61 2.6.74A2 2 0 0 1 22 16.92z"/></svg>;
const IconUser = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconShieldCheck = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const IconLock = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconTarget = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconDollar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconTrendingUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconBinoculars = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 16.5a2.5 2.5 0 0 1-5 0V13a2.5 2.5 0 0 1 5 0z"/><path d="M18.5 16.5a2.5 2.5 0 0 1-5 0V13a2.5 2.5 0 0 1 5 0z"/><path d="M2 13h3"/><path d="M19 13h3"/><path d="M8 10V7a2 2 0 0 1 4 0v3"/><path d="M12 10V7a2 2 0 0 1 4 0v3"/></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconHandshake = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/><path d="M12 5.36 8.87 8.5"/><path d="M15.13 8.5 12 5.36"/></svg>;
const IconFileText = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const IconShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

/* ===== CSS Variables from spec ===== */
const navyDeep = '#051020';
const gold = '#C5A059';
const offWhite = '#F8F9FA';
const mutedText = '#a8b2d1';
const navyCard = '#0a192f';

/* ===== Data ===== */
const NAV = ['SERVICES', 'OUR PROCESS', 'ABOUT US', 'RESOURCES', 'CONTACT'];
const STATS = [
  { v: '$50M+', l: 'NOTES TRADED', icon: <IconDollar /> },
  { v: '200+', l: 'QUALIFIED BUYERS', icon: <IconUsers /> },
  { v: '1,500+', l: 'SELLER LEADS', icon: <IconHome /> },
  { v: '12-18%', l: 'AVERAGE YIELD', icon: <IconTrendingUp /> },
];
const SVC = [
  { icon: <IconBinoculars />, title: 'Acquire', desc: 'We source high-quality notes from motivated sellers nationwide.' },
  { icon: <IconSearch />, title: 'Underwrite', desc: 'Our team conducts thorough analysis to assess risk and value.' },
  { icon: <IconHandshake />, title: 'Match', desc: 'We connect qualified buyers with the right opportunities.' },
  { icon: <IconFileText />, title: 'Close', desc: 'We coordinate secure, efficient closings through trusted partners.' },
  { icon: <IconShield />, title: 'Manage', desc: 'We support investors with servicing and ongoing oversight.' },
];
const TRUST = [
  { icon: <IconShieldCheck />, l1: 'Institutional', l2: 'Due Diligence' },
  { icon: <IconLock />, l1: 'Secure &', l2: 'Compliant' },
  { icon: <IconTarget />, l1: 'Results-Driven', l2: 'Approach' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero float animation keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .hero-scroll-float {
          animation: heroFloat 6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .svc-grid { grid-template-columns: 1fr !important; }
          .hero-headline { font-size: clamp(36px, 8vw, 54px) !important; }
        }
      `}</style>

      {/* =================== HERO =================== */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', background: navyDeep }}>

        {/* Scroll hero image — floating animation */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden lg:block hero-scroll-float" style={{ backgroundImage: 'url(/hero-scroll-2x.png)' }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${navyDeep}ee 0%, ${navyDeep}dd 25%, ${navyDeep}aa 45%, ${navyDeep}66 62%, ${navyDeep}22 80%, transparent 100%)` }} />
        </div>
        <div className="absolute inset-0 lg:hidden" style={{ background: `linear-gradient(135deg, ${navyDeep} 0%, #0a1a30 100%)` }} />

        {/* HEADER */}
        <header className="relative z-10" style={{ borderBottom: '1px solid rgba(197,160,89,0.15)' }}>
          <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '1400px', height: '90px', padding: '0 40px' }}>
            <img src="/logo-lockup.png" alt="NoteWorthy Capital LLC" style={{ height: '46px', width: 'auto' }} />

            <nav className="hidden lg:flex items-center" style={{ gap: '30px' }}>
              {NAV.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-[#C5A059] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', letterSpacing: '0.12em', fontWeight: 400, color: mutedText, textTransform: 'uppercase' }}>
                  {item}
                </a>
              ))}
            </nav>

            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 hover:bg-[#C5A059]/10 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.1em', fontWeight: 400, color: gold, border: `1px solid ${gold}`, padding: '10px 24px', borderRadius: '2px', background: 'transparent', cursor: 'pointer', textTransform: 'uppercase' }}>
              <IconUser /> Employee Login
            </button>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="hero-grid relative z-10 mx-auto flex items-center" style={{ maxWidth: '1400px', minHeight: 'calc(90vh - 90px)', padding: '0 40px' }}>
          <div style={{ maxWidth: '580px' }}>
            <h2 className="hero-headline" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: offWhite }}>
              Turning Paper
            </h2>
            <h2 className="hero-headline" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: gold }}>
              Into Liquidity.
            </h2>

            <div className="mt-5 mb-6" style={{ width: '60px', height: '2px', background: gold }} />

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: mutedText, maxWidth: '500px' }}>
              NoteWorthy Capital LLC specializes in the acquisition and sale of performing and non-performing mortgage notes. Our disciplined underwriting process and vetted buyer network deliver consistent results with institutional-grade due diligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="flex items-center gap-2 hover:brightness-110 transition-all"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', color: navyDeep, background: gold, padding: '16px 32px', borderRadius: '4px', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
                <IconPhone /> Sell Your Note
              </button>
              <button className="flex items-center gap-2 hover:bg-[#C5A059]/8 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', color: gold, background: 'transparent', padding: '16px 32px', borderRadius: '4px', border: `1px solid ${gold}`, cursor: 'pointer', textTransform: 'uppercase' }}>
                <IconUser /> Join Buyer Pool
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-8 mt-10">
              {TRUST.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${gold}40`, color: gold }}>
                    {t.icon}
                  </div>
                  <div className="leading-tight">
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: offWhite }}>{t.l1}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: mutedText }}>{t.l2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================== STATS BAR =================== */}
      <section className="relative z-20 px-4 sm:px-6" style={{ marginTop: '-60px' }}>
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
          <div style={{ background: navyCard, border: `1px solid ${gold}45`, borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
            <div className="stats-grid grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center justify-center gap-4" style={{ padding: '28px 32px', borderRight: i < 3 ? `1px solid ${gold}25` : 'none' }}>
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${gold}30`, color: gold }}>
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', fontWeight: 700, color: offWhite, lineHeight: 1 }}>{s.v}</p>
                    <p className="mt-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: mutedText, textTransform: 'uppercase' }}>{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================== WHAT WE DO =================== */}
      <section id="services" className="relative" style={{ background: offWhite }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url(/cream-pattern.png)' }} />

        <div className="relative mx-auto" style={{ maxWidth: '1400px', padding: '100px 40px 90px' }}>
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', letterSpacing: '0.4em', fontWeight: 400, color: gold, marginBottom: '20px', textTransform: 'uppercase' }}>What We Do</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: navyDeep, lineHeight: 1.15, marginBottom: '20px' }}>
              Full-Service Note Trading
            </h2>
            <div className="flex items-center justify-center" style={{ gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '1px', background: `${gold}50` }} />
              <div style={{ width: '6px', height: '6px', background: gold, transform: 'rotate(45deg)' }} />
              <div style={{ width: '50px', height: '1px', background: `${gold}50` }} />
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 300, lineHeight: 1.65, color: '#6b7a94', maxWidth: '560px', margin: '0 auto' }}>
              From acquisition through closing, we manage the entire process with precision and integrity.
            </p>
          </div>

          {/* Services — hover lift effect per spec */}
          <div className="svc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" style={{ gap: '28px' }}>
            {SVC.map((s, i) => (
              <div
                key={i}
                className="group text-center transition-all duration-300 cursor-pointer"
                style={{ padding: '24px 16px' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div
                  className="flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-[#C5A059]"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', background: navyDeep, color: gold, marginBottom: '20px' }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, color: navyDeep, marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.6, color: '#6b7a94' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer style={{ background: navyDeep, borderTop: `1px solid ${gold}08` }}>
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ maxWidth: '1400px', padding: '24px 40px' }}>
          <div className="flex items-center gap-3">
            <img src="/nw-monogram.png" alt="" style={{ height: '24px', width: 'auto', opacity: 0.5 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 300, color: mutedText }}>© 2026 NoteWorthy Capital LLC. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Disclosures'].map((item) => (
              <span key={item} className="hover:text-[#C5A059] transition-colors cursor-pointer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 300, color: mutedText }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
