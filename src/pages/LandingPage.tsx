import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Phone, Users, Shield, Lock, TrendingUp,
  DollarSign, Home, Search, Handshake, FileCheck, Settings,
  User
} from 'lucide-react';

const stats = [
  { label: 'NOTES TRADED', value: '$50M+', icon: <DollarSign className="w-6 h-6" /> },
  { label: 'QUALIFIED BUYERS', value: '200+', icon: <Users className="w-6 h-6" /> },
  { label: 'SELLER LEADS', value: '1,500+', icon: <Home className="w-6 h-6" /> },
  { label: 'AVERAGE YIELD', value: '12-18%', icon: <TrendingUp className="w-6 h-6" /> },
];

const services = [
  { icon: <Home className="w-8 h-8" />, title: 'Acquire', desc: 'We source high quality notes from motivated sellers nationwide.' },
  { icon: <Search className="w-8 h-8" />, title: 'Underwrite', desc: 'Our team conducts thorough analysis to assess risk and value.' },
  { icon: <Handshake className="w-8 h-8" />, title: 'Match', desc: 'We connect qualified buyers with the right opportunities.' },
  { icon: <FileCheck className="w-8 h-8" />, title: 'Close', desc: 'We coordinate secure, efficient closings through trusted partners.' },
  { icon: <Settings className="w-8 h-8" />, title: 'Manage', desc: 'We support investors with servicing and ongoing oversight.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO — Full width dark navy with scroll image on right            */}
      {/* ================================================================ */}
      <section className="relative bg-[#0a1628] overflow-hidden">
        {/* Background: gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b2e] to-[#162544]" />

        {/* Hero scroll image — positioned absolute right */}
        <div
          className="absolute right-0 top-0 w-[55%] h-full bg-cover bg-center bg-no-repeat hidden lg:block"
          style={{ backgroundImage: 'url(/hero-scroll.jpg)' }}
        >
          {/* Gradient fade from navy into image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        </div>

        {/* Header nav */}
        <header className="relative z-10 border-b border-[#c9a84c]/10">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#c9a84c] rounded flex items-center justify-center flex-shrink-0">
                <span className="text-[#c9a84c] font-serif font-bold text-lg leading-none">N</span>
              </div>
              <div className="leading-tight">
                <p className="text-[9px] tracking-[0.25em] text-[#f8f6f1]/80 font-semibold">NOTEWORTHY</p>
                <p className="text-[9px] tracking-[0.2em] text-[#c9a84c] font-medium">CAPITAL LLC</p>
                <p className="text-[7px] tracking-[0.1em] text-[#f8f6f1]/30 mt-0.5">NOTE TRADING & INVESTMENT</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {['SERVICES', 'OUR PROCESS', 'ABOUT US', 'RESOURCES', 'CONTACT'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[10px] tracking-[0.15em] text-[#f8f6f1]/50 hover:text-[#c9a84c] transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Login */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-[#c9a84c]/40 text-[#f8f6f1]/80 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] text-[10px] tracking-wider px-4 py-2 h-auto"
            >
              <User className="w-3.5 h-3.5 mr-2" />
              EMPLOYEE LOGIN
            </Button>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-xl">
            {/* Headline */}
            <h1 className="font-serif text-5xl lg:text-[64px] text-[#c9a84c] leading-[1.05] mb-4">
              Turning Paper<br />
              Into Liquidity.
            </h1>

            {/* Gold line under headline */}
            <div className="w-20 h-0.5 bg-[#c9a84c]/60 mb-6" />

            {/* Body copy */}
            <p className="text-sm text-[#f8f6f1]/60 leading-relaxed max-w-md mb-8">
              NoteWorthy Capital LLC specializes in the acquisition and sale of performing and non-performing mortgage notes. Our AI-trained team and vetted buyer network deliver consistent results with institutional-grade due diligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                className="bg-[#c9a84c] text-[#0a1628] hover:bg-[#d4b55a] font-semibold text-[11px] tracking-wider px-6 py-3 h-auto rounded"
              >
                <Phone className="w-4 h-4 mr-2" />
                SELL YOUR NOTE
              </Button>
              <Button
                variant="outline"
                className="border-[#f8f6f1]/30 text-[#f8f6f1] hover:bg-[#f8f6f1]/10 text-[11px] tracking-wider px-6 py-3 h-auto rounded bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                JOIN BUYER POOL
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-[#c9a84c]/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-[#f8f6f1] font-semibold">Institutional</p>
                  <p className="text-[10px] text-[#f8f6f1]/40">Due Diligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-[#c9a84c]/30 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-[#f8f6f1] font-semibold">Secure &</p>
                  <p className="text-[10px] text-[#f8f6f1]/40">Compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-[#c9a84c]/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-[#f8f6f1] font-semibold">Results-Driven</p>
                  <p className="text-[10px] text-[#f8f6f1]/40">Approach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS BAR — Overlaps hero (negative margin) on dark navy         */}
      {/* ================================================================ */}
      <section className="relative z-20 bg-[#0d1b2e] border-t border-[#c9a84c]/10 -mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#c9a84c]/10">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-4 py-8 px-6">
                <div className="w-12 h-12 rounded-full border border-[#c9a84c]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c9a84c]">{s.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#f8f6f1]">{s.value}</p>
                  <p className="text-[9px] tracking-[0.15em] text-[#f8f6f1]/35 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SERVICES — Cream/off-white background                             */}
      {/* ================================================================ */}
      <section id="services" className="bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] text-[#c9a84c] mb-4 font-medium">WHAT WE DO</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#1a2744] mb-4">
              Full-Service Note Trading
            </h2>
            <p className="text-sm text-[#1a2744]/45 max-w-xl mx-auto">
              From acquisition through closing, we manage the entire process with precision and integrity.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {services.map((svc, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full border-2 border-[#1a2744]/10 flex items-center justify-center group-hover:border-[#c9a84c]/50 transition-all duration-300 bg-white/50">
                  <span className="text-[#1a2744]/50 group-hover:text-[#c9a84c] transition-colors duration-300">
                    {svc.icon}
                  </span>
                </div>
                <h3 className="font-bold text-[#1a2744] text-sm mb-2 tracking-wide">{svc.title}</h3>
                <p className="text-xs text-[#1a2744]/45 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                            */}
      {/* ================================================================ */}
      <footer className="bg-[#0a1628] border-t border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c9a84c]/50 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-[#c9a84c] font-serif font-bold text-[8px]">N</span>
            </div>
            <p className="text-[10px] text-[#f8f6f1]/25">
              © 2026 NoteWorthy Capital LLC. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-[#f8f6f1]/25">
            <span className="hover:text-[#c9a84c] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#c9a84c] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#c9a84c] cursor-pointer transition-colors">Disclosures</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
