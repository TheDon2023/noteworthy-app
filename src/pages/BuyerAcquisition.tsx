import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, MapPin, TrendingUp, Users, Target,
  Mail, Calendar, AlertTriangle, CheckCircle, BarChart3,
  Globe, DollarSign, FileText, BookOpen
} from 'lucide-react';
import { topStates2024, marketSummary2024, getForeclosureColor, getForeclosureLabel } from '@/data/topStates';

const sbc = (c: string) => (
  <span className="font-semibold" style={{ color: '#c9a84c' }}>{c}</span>
);

export default function BuyerAcquisition() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#c9a84c]/20 bg-[#1a2744]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-[#f8f6f1]/60 hover:text-[#f8f6f1]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-[#f8f6f1]">Buyer Acquisition SOP</h1>
            <p className="text-xs text-[#c9a84c]">Building & Maintaining a Qualified Investor Pool</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-xs text-[#f8f6f1]/50">Notes Created (2024)</p>
                  <p className="text-xl font-bold text-[#c9a84c]">{marketSummary2024.totalNotesCreated.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-[#f8f6f1]/50">Dollar Volume</p>
                  <p className="text-xl font-bold text-green-400">{marketSummary2024.totalDollarVolume}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-[#f8f6f1]/50">Avg Residential Note</p>
                  <p className="text-xl font-bold text-blue-400">{marketSummary2024.avgResidentialNote}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-[#c9a84c]/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-[#f8f6f1]/50">Avg LTV</p>
                  <p className="text-xl font-bold text-purple-400">{marketSummary2024.avgResidentialLTV}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 States Table */}
        <Card className="glass-panel border-[#c9a84c]/20 mb-8">
          <CardHeader>
            <CardTitle className="text-[#f8f6f1] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#c9a84c]" />
              Top 10 States for Seller Financing (2024)
            </CardTitle>
            <p className="text-sm text-[#f8f6f1]/50">
              These 10 states account for {marketSummary2024.top10Share} of all seller-financed notes created.
              Source: NoteInvestor.com / Advanced Seller Data Services.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c9a84c]/20">
                    <th className="text-left py-3 px-3 text-[#c9a84c] font-semibold">Rank</th>
                    <th className="text-left py-3 px-3 text-[#c9a84c] font-semibold">State</th>
                    <th className="text-right py-3 px-3 text-[#c9a84c] font-semibold">Notes Created</th>
                    <th className="text-right py-3 px-3 text-[#c9a84c] font-semibold">Share</th>
                    <th className="text-left py-3 px-3 text-[#c9a84c] font-semibold">Foreclosure</th>
                    <th className="text-left py-3 px-3 text-[#c9a84c] font-semibold hidden md:table-cell">Key Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {topStates2024.map((s) => (
                    <tr key={s.code} className="border-b border-[#c9a84c]/10 hover:bg-[#c9a84c]/5 transition-colors">
                      <td className="py-3 px-3 text-[#f8f6f1]/60">#{s.rank}</td>
                      <td className="py-3 px-3 font-semibold text-[#f8f6f1]">{s.state} <span className="text-[#f8f6f1]/40 font-normal">({s.code})</span></td>
                      <td className="py-3 px-3 text-right text-[#f8f6f1]">{s.count2024.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-[#c9a84c]">{s.percentage}</td>
                      <td className="py-3 px-3">
                        <Badge style={{ backgroundColor: `${getForeclosureColor(s.foreclosureType)}20`, color: getForeclosureColor(s.foreclosureType), borderColor: `${getForeclosureColor(s.foreclosureType)}40` }} variant="outline" className="text-xs">
                          {getForeclosureLabel(s.foreclosureType)}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-[#f8f6f1]/50 hidden md:table-cell max-w-md">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Main SOP Content */}
        <Card className="glass-panel border-[#c9a84c]/20">
          <CardHeader>
            <CardTitle className="text-[#f8f6f1] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c9a84c]" />
              Buyer Acquisition Standard Operating Procedure
            </CardTitle>
            <p className="text-sm text-[#f8f6f1]/50">
              NoteWorthy Capital LLC | Confidential | Internal Use Only | 2026 Edition
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="bg-[#0f1929] border border-[#c9a84c]/20 h-auto flex-wrap w-full min-w-max">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="categories" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Buyer Categories</TabsTrigger>
                  <TabsTrigger value="sourcing" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 1: Sourcing</TabsTrigger>
                  <TabsTrigger value="outreach" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 2: Outreach</TabsTrigger>
                  <TabsTrigger value="qualification" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 3: Qualify</TabsTrigger>
                  <TabsTrigger value="crm" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 4: CRM</TabsTrigger>
                  <TabsTrigger value="nurturing" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 5: Nurture</TabsTrigger>
                  <TabsTrigger value="closing" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Phase 6: Close</TabsTrigger>
                  <TabsTrigger value="kpis" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">KPIs & Scorecard</TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-[#c9a84c] data-[state=active]:text-[#1a2744] text-xs">Templates</TabsTrigger>
                </TabsList>
              </ScrollArea>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Purpose & Scope</h3>
                  <p className="text-[#f8f6f1]/70 leading-relaxed">
                    This Standard Operating Procedure governs all activities related to identifying, qualifying, and maintaining a pool of qualified note buyers for NoteWorthy Capital LLC. {sbc('The buyer pool is the single most critical asset of our business.')}
                    Without verified, active buyers, no note can be flipped -- regardless of how well we source or underwrite it.
                  </p>
                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-6">Core Objectives</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Maintain minimum 25 qualified, active buyers at all times',
                      'Achieve average buyer match time of 5 business days or less',
                      'Maintain buyer fallout rate below 10%',
                      'Diversify across 5 distinct buyer categories',
                      'Generate 15-20% of new buyers through inbound channels by Month 12',
                    ].map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#0f1929] rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#f8f6f1]/70">{obj}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-6">Key Principles</h4>
                  <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-[#f8f6f1]/70">{sbc('Buyer Pool = #1 Asset:')} Protect and nurture it relentlessly</p>
                    <p className="text-sm text-[#f8f6f1]/70">{sbc('Qualify First:')} Every buyer must pass the 4-part framework before receiving deal access</p>
                    <p className="text-sm text-[#f8f6f1]/70">{sbc('Diversify:')} Multiple buyer types insulate against market shifts</p>
                    <p className="text-sm text-[#f8f6f1]/70">{sbc('Inbound is the Goal:')} Buyers finding YOU signals a credible operation</p>
                    <p className="text-sm text-[#f8f6f1]/70">{sbc('Relationships, Not Transactions:')} Long-term investment in every buyer</p>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-6">Weekly Time Budget (~25 hours)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Channel</th>
                          <th className="text-right py-2 px-3 text-[#c9a84c]">Hours/Week</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Key Activities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['LinkedIn & Digital', '8', 'Sales Navigator outreach, content posting, connection requests, messaging'],
                          ['Online Marketplaces', '4', 'Profile updates, blind teaser posts, direct messaging active buyers'],
                          ['Referral Networks', '4', 'Partner calls, referral follow-ups, program promotion'],
                          ['Direct Fund Outreach', '4', 'Research, personalized emails, follow-up sequences'],
                          ['Conferences/Events', '2', 'Event research, pre-event outreach, follow-up'],
                          ['Content Marketing', '2', 'Newsletter writing, blog posts, LinkedIn content creation'],
                          ['Note Associations', '1', 'Forum participation, member directory outreach'],
                        ].map(([ch, hrs, acts], i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3 text-[#f8f6f1]">{ch}</td>
                            <td className="py-2 px-3 text-right text-[#c9a84c]">{hrs}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/50">{acts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* BUYER CATEGORIES */}
              <TabsContent value="categories" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Buyer Categories & Definitions</h3>
                  <p className="text-[#f8f6f1]/70">Not all buyers are the same. Understanding the distinct categories allows us to match the right buyer to the right note.</p>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { cat: 'Institutional Funds', desc: 'Large-scale note investment funds with dedicated capital pools. Buy in volume, close quickly.', profile: '$5M+ AUM, national focus, 8-12% target yield, LTV < 75%', color: '#3b82f6', target: '25%' },
                      { cat: 'Private Investors', desc: 'High-net-worth individuals or small partnerships seeking yield. Flexible, relationship-driven.', profile: '$500K-$5M investable, state/regional focus, 10-15% yield', color: '#10b981', target: '40%' },
                      { cat: 'Self-Directed IRAs', desc: 'Individuals using retirement capital. Prioritize safety and predictability.', profile: '$100K-$1M, conservative LTV < 65%, performing only', color: '#f59e0b', target: '15%' },
                      { cat: 'Family Offices', desc: 'Wealth management offices for ultra-high-net-worth families. Long-term oriented.', profile: '$10M+ AUM, multi-state, 7-10% yield, large notes', color: '#8b5cf6', target: '10%' },
                      { cat: 'Syndicates & Groups', desc: 'Pooled investor groups through REIAs or online platforms. Variable sophistication.', profile: '$250K-$2M pooled, regional, 12-18% yield', color: '#ef4444', target: '10%' },
                    ].map((b, i) => (
                      <Card key={i} className="glass-panel border-[#c9a84c]/10">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: b.color }} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-[#f8f6f1]">{b.cat}</h4>
                                <Badge variant="outline" className="border-[#c9a84c]/20 text-[#c9a84c] text-xs">Target: {b.target}</Badge>
                              </div>
                              <p className="text-sm text-[#f8f6f1]/60 mt-1">{b.desc}</p>
                              <p className="text-xs text-[#f8f6f1]/40 mt-1">{b.profile}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Red Flags: Buyers to Avoid</h4>
                  <div className="space-y-2">
                    {[
                      'Buyers who refuse to provide proof of funds or financial references',
                      'Buyers who demand upfront fees or due diligence payments from sellers',
                      'Buyers involved in litigation related to note transactions',
                      'Buyers who consistently renegotiate price after committing',
                      'Buyers who take longer than 14 days to close without cause',
                      'Buyers who ask us to circumvent legal or compliance requirements',
                    ].map((flag, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#f8f6f1]/60">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PHASE 1: SOURCING */}
              <TabsContent value="sourcing" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 1: Buyer Sourcing (7 Channels)</h3>

                  {/* Channel 1 */}
                  <SopPhase title="Channel 1: Online Note Marketplaces" icon={<Globe className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Online platforms connecting note sellers with buyers. Registering gives direct access to active buyers.</p>
                    <div className="space-y-1">
                      {['Paperstac: Leading note exchange. Create seller profile, list blind teasers, message buyers directly.',
                        'NotesDirect: Wholesale marketplace. Bulk institutional buyers seeking performing notes.',
                        'Watermark Exchange: Secondary market. Mid-size funds and family offices.',
                        'FCI Exchange: Note trading platform with strong institutional presence.'].map((p, i) => (
                        <p key={i} className="text-xs text-[#f8f6f1]/50">- {p}</p>
                      ))}
                    </div>
                  </SopPhase>

                  {/* Channel 2 */}
                  <SopPhase title="Channel 2: LinkedIn & Digital Outreach" icon={<Users className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Most effective platform for institutional buyers. Systematic approach yields 3-5 qualified connections/week.</p>
                    <div className="space-y-1">
                      {['Advanced Search: Sales Navigator filters by title ("Note", "Portfolio Manager"), company size, location.',
                        'Send 15-20 personalized connection requests daily referencing their profile.',
                        'Follow up within 48 hours of acceptance with initial outreach message.',
                        'Post weekly content: deal case studies, market updates, educational content.'].map((p, i) => (
                        <p key={i} className="text-xs text-[#f8f6f1]/50">- {p}</p>
                      ))}
                    </div>
                  </SopPhase>

                  {/* Channel 3 */}
                  <SopPhase title="Channel 3: Industry Conferences & Events" icon={<Calendar className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Face-to-face meetings convert at 3-5x digital rates.</p>
                    <div className="space-y-1">
                      {['Paper Source Conference (Annual): Premier national event. 500+ attendees. Must-attend.',
                        'Note Expo (Semi-Annual): Strong buyer attendance, excellent networking.',
                        'IMN Distressed Debt & Note Summit: Institutional-focused. Fund managers.',
                        'Local REIA Meetings: Monthly. Lower cost, relationship-driven.'].map((p, i) => (
                        <p key={i} className="text-xs text-[#f8f6f1]/50">- {p}</p>
                      ))}
                    </div>
                  </SopPhase>

                  {/* Channel 4 */}
                  <SopPhase title="Channel 4: Professional Referral Networks" icon={<Users className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Professionals serving our target buyer demographic become steady introduction sources.</p>
                    <p className="text-xs text-[#f8f6f1]/50">Target: Real Estate Attorneys, CPAs & Tax Advisors, Financial Planners, Title Company Reps, Other Note Brokers</p>
                    <p className="text-xs text-[#c9a84c] mt-1">Referral fee: 10-15% finders fee on net profit. Paid within 30 days of closing.</p>
                  </SopPhase>

                  {/* Channel 5 */}
                  <SopPhase title="Channel 5: Direct Fund Outreach" icon={<DollarSign className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Institutional funds = highest volume. A single fund can absorb 50+ notes/year. These buyers ignore mass marketing.</p>
                    <p className="text-xs text-[#f8f6f1]/50">Use Private Equity List, Preqin, SEC filings. Research criteria. Find Portfolio Manager. Send personalized email. Follow up every 7-10 days for 4 touches.</p>
                  </SopPhase>

                  {/* Channel 6 */}
                  <SopPhase title="Channel 6: Content Marketing & SEO" icon={<FileText className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Inbound acquisition = hallmark of a mature note operation.</p>
                    <p className="text-xs text-[#f8f6f1]/50">Content pillars: Market Updates, Educational Guides ("Accredited Investor Guide to Note Investing"), Case Studies, Video Content. Gate premium content behind email capture.</p>
                  </SopPhase>

                  {/* Channel 7 */}
                  <SopPhase title="Channel 7: Note Investor Associations" icon={<BookOpen className="w-4 h-4" />}>
                    <p className="text-sm text-[#f8f6f1]/60 mb-2">Membership provides networking, credibility, and education.</p>
                    <p className="text-xs text-[#f8f6f1]/50">National Note Association, American Note Association, Local REIAs, BiggerPockets Note Investing Forum. Active participation generates relationships.</p>
                  </SopPhase>
                </div>
              </TabsContent>

              {/* PHASE 2: OUTREACH */}
              <TabsContent value="outreach" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 2: Initial Contact & Outreach</h3>
                  <p className="text-[#f8f6f1]/70">First impressions determine engagement. Every touchpoint must project professionalism and value.</p>

                  <h4 className="text-lg font-semibold text-[#f8f6f1]">First Contact Sequence</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Touch</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Timing</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['1', 'Day 0', 'Send initial outreach email or LinkedIn message'],
                          ['2', 'Day 2', 'LinkedIn connection request (if not already connected)'],
                          ['3', 'Day 5', 'Follow-up email #1 with value-add (market insight or deal teaser)'],
                          ['4', 'Day 8', 'Phone call or voicemail'],
                          ['5', 'Day 14', 'Final follow-up: "Last check-in" with soft opt-out'],
                          ['6', 'Ongoing', 'Add to monthly newsletter if not opted out'],
                        ].map(([touch, timing, action], i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3 text-[#c9a84c] font-semibold">{touch}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/60">{timing}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/70">{action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Handling Common Objections</h4>
                  <div className="space-y-3">
                    {[
                      { obj: 'I already have enough deal sources.', resp: 'Most of our buyers said the same until they saw our underwriting. We only send pre-vetted, performing notes with verified payment history. Would you be open to just one blind teaser?' },
                      { obj: 'I only buy in [different state].', resp: 'We are expanding our sourcing into that state this quarter. Would you like me to reach out when we have notes in your target area?' },
                      { obj: 'I am not buying right now.', resp: 'No problem. Would it be okay if I added you to our monthly market update? When you are ready, you will have context on pricing and availability.' },
                      { obj: 'Your notes are too small/large.', resp: 'Noted. What is your ideal UPB range? I will tag your record and only reach out when we have notes in your sweet spot.' },
                      { obj: 'I need a higher yield.', resp: 'We occasionally see higher-yield opportunities with sub-performing notes. What is your minimum acceptable yield?' },
                    ].map((o, i) => (
                      <div key={i} className="bg-[#0f1929] rounded-lg p-3">
                        <p className="text-sm text-[#f8f6f1]/80 font-medium">"{o.obj}"</p>
                        <p className="text-sm text-[#f8f6f1]/50 mt-1">{sbc('Response:')} {o.resp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PHASE 3: QUALIFICATION */}
              <TabsContent value="qualification" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 3: Buyer Qualification</h3>
                  <p className="text-[#f8f6f1]/70">Every buyer must pass the 4-Part Qualification Framework before receiving deal access. {sbc('No exceptions.')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QualCard number="1" title="Financial Capacity" subtitle="Can they close?" color="#3b82f6">
                      <ul className="space-y-1 text-xs text-[#f8f6f1]/50">
                        <li>- Proof of funds letter or bank statement</li>
                        <li>- AUM verification for institutions</li>
                        <li>- IRA custodian confirmation</li>
                        <li>- Minimum: 2x largest note presented</li>
                        <li>- {sbc('90-day expiration')} on POF</li>
                      </ul>
                    </QualCard>
                    <QualCard number="2" title="Track Record" subtitle="Have they closed before?" color="#10b981">
                      <ul className="space-y-1 text-xs text-[#f8f6f1]/50">
                        <li>- 2-3 references from prior purchases</li>
                        <li>- Verify references independently</li>
                        <li>- Check: closed on time? renegotiated?</li>
                        <li>- New buyers: $2,500 non-refundable earnest</li>
                      </ul>
                    </QualCard>
                    <QualCard number="3" title="Criteria Alignment" subtitle="Do they buy what we sell?" color="#f59e0b">
                      <ul className="space-y-1 text-xs text-[#f8f6f1]/50">
                        <li>- States, UPB range, yield targets</li>
                        <li>- Max LTV, property types</li>
                        <li>- Performing/sub/non-performing preference</li>
                        <li>- Note position (1st, 2nd, or both)</li>
                        <li>- Update every {sbc('90 days')}</li>
                      </ul>
                    </QualCard>
                    <QualCard number="4" title="Compliance" subtitle="Will they follow rules?" color="#8b5cf6">
                      <ul className="space-y-1 text-xs text-[#f8f6f1]/50">
                        <li>- Accredited Investor verification (Rule 501)</li>
                        <li>- QIB status for large transactions</li>
                        <li>- NDA signed before property details shared</li>
                        <li>- Securities law awareness</li>
                        <li>- NDA expires in {sbc('12 months')}</li>
                      </ul>
                    </QualCard>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Qualification Decision Matrix</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Status</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Requirements</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Next Steps</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['QUALIFIED', 'All 4 parts passed', 'Add to active pool, begin deal alerts, quarterly check-ins'],
                          ['CONDITIONAL', 'Parts 1, 2, 4 passed; Part 3 partial', 'Add with restricted criteria; require earnest deposit'],
                          ['PENDING', 'Parts 3, 4 passed; waiting on 1 or 2', 'Follow up weekly; 30-day deadline'],
                          ['DISQUALIFIED', 'Failed any critical part', 'Archive record, do not contact'],
                        ].map(([status, reqs, next], i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3">
                              <Badge variant="outline" className={`text-xs ${i === 0 ? 'border-green-500/30 text-green-400' : i === 3 ? 'border-red-500/30 text-red-400' : 'border-[#c9a84c]/20 text-[#c9a84c]'}`}>
                                {status}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-[#f8f6f1]/60">{reqs}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/50">{next}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* PHASE 4: CRM */}
              <TabsContent value="crm" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 4: CRM Data Standards</h3>
                  <p className="text-[#f8f6f1]/70">Consistent data entry is essential for efficient buyer matching, tracking, and compliance.</p>

                  <h4 className="text-lg font-semibold text-[#f8f6f1]">Required CRM Fields</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Field</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Full Name', 'Text'],
                          ['Company/Entity', 'Text'],
                          ['Title/Role', 'Text'],
                          ['Phone', 'Phone'],
                          ['Email', 'Email'],
                          ['LinkedIn URL', 'URL'],
                          ['Buyer Category', 'Dropdown: Institutional, Private, IRA, Family Office, Syndicate'],
                          ['Status', 'Dropdown: Prospect, Pending, Qualified, Conditional, Active, Passive, Dormant, Disqualified'],
                          ['Tier', 'Dropdown: A, B, C, Unassigned'],
                          ['Source Channel', 'Dropdown: Marketplace, LinkedIn, Conference, Referral, Direct, Inbound, Association'],
                          ['Proof of Funds', 'Attachment (90-day expiration)'],
                          ['NDA Status', 'Dropdown: Not Sent, Sent, Signed, Expired'],
                        ].map(([field, type], i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3 text-[#f8f6f1]">{field}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/50">{type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Data Hygiene Rules</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { rule: 'Update Within 24 Hours', desc: 'Log all interactions within 24 hours. Delayed logging kills deal flow.' },
                      { rule: 'Verify Annually', desc: 'Send annual criteria confirmation to all qualified buyers.' },
                      { rule: 'Archive Inactive', desc: 'Move 180-day non-responders to Dormant. Do not delete.' },
                      { rule: 'Backup Weekly', desc: 'Export CRM data weekly to secure cloud storage.' },
                      { rule: 'Access Control', desc: 'Limit to Buyer Relations Mgr, Acquisition Lead, Managing Member.' },
                    ].map((r, i) => (
                      <div key={i} className="bg-[#0f1929] rounded-lg p-3">
                        <p className="text-sm font-semibold text-[#c9a84c]">{r.rule}</p>
                        <p className="text-xs text-[#f8f6f1]/50">{r.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PHASE 5: NURTURING */}
              <TabsContent value="nurturing" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 5: Pool Nurturing & Maintenance</h3>
                  <p className="text-[#f8f6f1]/70">A buyer pool is a living asset. Without consistent nurturing, relationships go cold.</p>

                  <h4 className="text-lg font-semibold text-[#f8f6f1]">Tier-Based Nurturing Cadence</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { tier: 'Tier A (Top 10)', freq: 'Weekly', activities: 'Personal check-in calls, first look at new deals, exclusive invitations, quarterly face-to-face meetings', color: '#c9a84c' },
                      { tier: 'Tier B (Next 15)', freq: 'Bi-weekly', activities: 'Deal alerts, monthly newsletter, periodic phone check-ins', color: '#3b82f6' },
                      { tier: 'Tier C (Remaining)', freq: 'Monthly', activities: 'Newsletter only, included in mass deal alerts', color: '#6b7280' },
                      { tier: 'Passive/Dormant', freq: 'Quarterly', activities: 'Newsletter + quarterly re-engagement attempt', color: '#8b5cf6' },
                    ].map((t, i) => (
                      <div key={i} className="bg-[#0f1929] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                          <h5 className="font-semibold text-[#f8f6f1]">{t.tier}</h5>
                          <Badge variant="outline" style={{ borderColor: `${t.color}40`, color: t.color }} className="text-xs ml-auto">{t.freq}</Badge>
                        </div>
                        <p className="text-xs text-[#f8f6f1]/50 mt-2">{t.activities}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Re-Engagement Protocol (90+ days no response)</h4>
                  <div className="space-y-2">
                    {[
                      ['Day 90', 'Send "We miss you" email with market insight or case study'],
                      ['Day 105', 'LinkedIn message or phone call: "Has anything changed?"'],
                      ['Day 120', 'Final email: "Should we keep you on our list?" with opt-out'],
                      ['Day 150', 'Move to Dormant. Retain record for future attempts.'],
                    ].map(([day, action], i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-semibold text-[#c9a84c] w-16 flex-shrink-0">{day}</span>
                        <span className="text-sm text-[#f8f6f1]/60">{action}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Weekly Pool Health Dashboard (15-min standup)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'Total qualified buyers (target: 25+ Active)',
                      'New buyers added this week/month/quarter',
                      'Buyers moved to Dormant or Disqualified',
                      'Avg days from first contact to qualification',
                      'Number of buyer-match conversations',
                      'Tier distribution (A/B/C ratio)',
                    ].map((m, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#0f1929] rounded-lg p-3">
                        <BarChart3 className="w-3 h-3 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#f8f6f1]/50">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PHASE 6: CLOSING */}
              <TabsContent value="closing" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Phase 6: Deal Presentation & Closing</h3>
                  <p className="text-[#f8f6f1]/70">Speed and professionalism are critical -- delays increase buyer fatigue and seller frustration.</p>

                  <h4 className="text-lg font-semibold text-[#f8f6f1]">The Deal Presentation Sequence</h4>
                  <div className="space-y-3">
                    {[
                      ['1. Internal Review', 'Confirm with Managing Member & Underwriting that note is ready for market.'],
                      ['2. Buyer Matching', 'Filter pool against note criteria. Identify 3-5 Tier A/B buyers.'],
                      ['3. Blind Teaser Send', 'Send blind teaser to matched buyers. First response gets first look.'],
                      ['4. NDA Collection', 'Confirm NDA on file (signed within 12 months). Re-send if expired.'],
                      ['5. Full Package Delivery', 'Complete underwriting package: note summary, payment history, title, photos, LTV.'],
                      ['6. Buyer DD Period', '48-72 hours for review. Be available for questions.'],
                      ['7. LOI / Commitment', 'Send Letter of Intent. Require refundable earnest ($1K-$5K).'],
                      ['8. Coordinate Closing', 'Work with title company. Ensure all docs ready.'],
                      ['9. Post-Close Follow-Up', '48-hour thank-you notes. Request testimonials. Update CRM.'],
                    ].map(([step, desc], i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#c9a84c]">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#f8f6f1]">{step}</p>
                          <p className="text-xs text-[#f8f6f1]/50">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Competitive Deal Strategy</h4>
                  <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-[#f8f6f1]/70">- Set a {sbc('48-hour "best and final"')} deadline for interested buyers</p>
                    <p className="text-sm text-[#f8f6f1]/70">- Create urgency: "Two other qualified buyers are reviewing." ({sbc('Never fabricate buyer interest.')})</p>
                    <p className="text-sm text-[#f8f6f1]/70">- Maintain integrity. If only one buyer interested, be transparent.</p>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Escrow & Closing Protocol (Non-Negotiable)</h4>
                  <div className="space-y-2">
                    {[
                      'All funds flow through licensed, neutral third-party title company or escrow agent',
                      'Buyer wires to title. Title disburses seller payoff + assignment spread.',
                      'Original note and recorded assignment delivered to buyer.',
                      'File assignment with county recorder within 30 days.',
                      sbc('NEVER handle transaction funds directly.'),
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#f8f6f1]/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* KPIs */}
              <TabsContent value="kpis" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Performance Metrics & KPIs</h3>
                  <p className="text-[#f8f6f1]/70">Track weekly, review monthly, report quarterly to Managing Member.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Metric</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Target</th>
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Owner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Total Active Buyers', '25+', 'Buyer Relations Mgr'],
                          ['New Buyers Added/Month', '3-5', 'Buyer Relations Mgr'],
                          ['Buyer Match Time', '<=5 days', 'Buyer Relations Mgr'],
                          ['Buyer Fallout Rate', '<10%', 'Buyer Relations Mgr'],
                          ['Avg Time to Qualify', '<=14 days', 'Buyer Relations Mgr'],
                          ['Inbound Buyer %', '15-20%', 'Buyer Relations Mgr'],
                          ['Pool Diversity Score', '5 categories', 'Managing Member'],
                          ['Re-Engagement Success', '>10%', 'Buyer Relations Mgr'],
                          ['Newsletter Open Rate', '>25%', 'Ops Coordinator'],
                        ].map(([metric, target, owner], i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3 text-[#f8f6f1]">{metric}</td>
                            <td className="py-2 px-3 text-[#c9a84c] font-semibold">{target}</td>
                            <td className="py-2 px-3 text-[#f8f6f1]/50">{owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="text-lg font-semibold text-[#f8f6f1] mt-4">Weekly Scorecard (Submit Friday by 5:00 PM)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#c9a84c]/20">
                          <th className="text-left py-2 px-3 text-[#c9a84c]">Activity</th>
                          <th className="text-right py-2 px-3 text-[#c9a84c]">This Week</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'New buyer prospects identified',
                          'Outreach messages sent',
                          'Responses received',
                          'Qualification questionnaires completed',
                          'Buyers moved to Qualified',
                          'Deal alerts sent',
                          'LOIs/Commitments received',
                          'Closings facilitated',
                          'Total Active buyer count',
                        ].map((act, i) => (
                          <tr key={i} className="border-b border-[#c9a84c]/10">
                            <td className="py-2 px-3 text-[#f8f6f1]/70">{act}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="text-[#f8f6f1]/30">___</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* TEMPLATES */}
              <TabsContent value="templates" className="mt-6 space-y-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#c9a84c]">Appendix A: Outreach Templates</h3>
                  <p className="text-[#f8f6f1]/70">All templates compliance-reviewed. Do not add language guaranteeing returns or offering investment advice.</p>

                  {/* Template A1 */}
                  <TemplateCard title="A1: Initial Buyer Outreach Email" subject="Quick question about your note buying criteria">
                    <p className="text-xs text-[#f8f6f1]/60 leading-relaxed">
                      Hi [First Name],<br/><br/>
                      My name is [Your Name] with NoteWorthy Capital LLC. We specialize in sourcing performing private mortgage notes -- deeds of trust, mortgages, and land contracts -- for qualified investors and funds.<br/><br/>
                      I came across your [profile/recent purchase/firm] and wanted to reach out. We are currently underwriting notes in [State(s)] with the following typical profile:<br/>
                      - Performing 12+ months, on-time payment history<br/>
                      - LTV: 60-75% (conservative, equity-protected)<br/>
                      - UPB range: $[X] to $[Y]<br/>
                      - Target yield: [X]% to [Y]%<br/><br/>
                      Before I send any opportunities, I would love to learn your criteria:<br/>
                      1. What states are you buying in?<br/>
                      2. Preferred UPB range?<br/>
                      3. Minimum yield target?<br/>
                      4. Performing only, or sub/non-performing?<br/><br/>
                      If there is a fit, I will add you to our qualified buyer list. No pressure, no spam -- just curated opportunities.<br/><br/>
                      Best,<br/>
                      [Your Name] | NoteWorthy Capital LLC<br/>
                      [Phone] | [Email]
                    </p>
                  </TemplateCard>

                  {/* Template A2 */}
                  <TemplateCard title="A2: Conference Follow-Up Email" subject="Great meeting you at [Conference Name]">
                    <p className="text-xs text-[#f8f6f1]/60 leading-relaxed">
                      Hi [First Name],<br/><br/>
                      Great connecting at [Conference]. I enjoyed our conversation about [topic].<br/><br/>
                      As promised, here is what we are seeing:<br/>
                      - Performing notes trading at [X]%--[Y]% of UPB<br/>
                      - LTVs under 70% in highest demand<br/>
                      - Quick-close buyers winning the best deals<br/><br/>
                      Are you open to a brief 10-minute call next week?<br/><br/>
                      Best,<br/>
                      [Your Name]
                    </p>
                  </TemplateCard>

                  {/* Template A3 */}
                  <TemplateCard title="A3: Referral Partner Introduction" subject="Referral partnership opportunity">
                    <p className="text-xs text-[#f8f6f1]/60 leading-relaxed">
                      Hi [First Name],<br/><br/>
                      I am [Your Name] with NoteWorthy Capital LLC, specializing in the acquisition and assignment of performing private mortgage notes.<br/><br/>
                      We work with [attorneys/CPAs/planners] to help clients convert notes into cash -- for estate planning, retirement, or other purposes.<br/><br/>
                      We offer a 10-15% referral fee on net profit of closed deals, and handle all underwriting, legal review, and closing.<br/><br/>
                      Open to a 15-minute call?<br/><br/>
                      Best,<br/>
                      [Your Name]
                    </p>
                  </TemplateCard>

                  {/* Template A5 */}
                  <TemplateCard title="A5: Deal Alert Email" subject="DEAL ALERT: $[UPB] UPB, [LTV]% LTV, [State]">
                    <p className="text-xs text-[#f8f6f1]/60 leading-relaxed">
                      Hi [First Name],<br/><br/>
                      I have a note matching your criteria:<br/><br/>
                      PROPERTY: [City, State]<br/>
                      UPB: $[X] | LTV: [Y]% | Monthly: $[Z]<br/>
                      PERFORMING: [X] months on-time<br/>
                      PROJECTED YIELD: [X]%<br/><br/>
                      Presenting to [X] qualified buyers. Reply by [Date] for the full package.<br/><br/>
                      This one will not last long.<br/><br/>
                      [Your Name]
                    </p>
                  </TemplateCard>

                  <h4 className="text-lg font-semibold text-[#c9a84c] mt-6">Quick Reference Card</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      ['Min pool size', '25 Active buyers'],
                      ['Target monthly additions', '3-5 qualified'],
                      ['Qualification parts', '4 (Financial, Track, Criteria, Compliance)'],
                      ['Target match time', '5 business days'],
                      ['Max fallout', '10%'],
                      ['Tier A contact', 'Weekly'],
                      ['Tier B contact', 'Bi-weekly'],
                      ['Tier C contact', 'Monthly (newsletter)'],
                      ['Dormant trigger', '150 days no response'],
                      ['POF expiration', '90 days'],
                      ['NDA expiration', '12 months'],
                      ['Earnest deposit', '$2,500 (new buyers)'],
                    ].map(([k, v], i) => (
                      <div key={i} className="bg-[#0f1929] rounded p-2">
                        <p className="text-[#f8f6f1]/40">{k}</p>
                        <p className="text-[#c9a84c] font-semibold">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/* Sub-components */

function SopPhase({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f1929] rounded-lg p-4 border border-[#c9a84c]/10">
      <h5 className="font-semibold text-[#f8f6f1] flex items-center gap-2 mb-2">
        <span className="text-[#c9a84c]">{icon}</span>
        {title}
      </h5>
      {children}
    </div>
  );
}

function QualCard({ number, title, subtitle, color, children }: { number: string; title: string; subtitle: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f1929] rounded-lg p-4 border" style={{ borderColor: `${color}30` }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: color }}>
          {number}
        </div>
        <div>
          <h5 className="font-semibold text-[#f8f6f1] text-sm">{title}</h5>
          <p className="text-xs text-[#f8f6f1]/40">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function TemplateCard({ title, subject, children }: { title: string; subject: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f1929] rounded-lg p-4 border border-[#c9a84c]/10">
      <h5 className="font-semibold text-[#f8f6f1] text-sm mb-1">{title}</h5>
      <p className="text-xs text-[#c9a84c] mb-3 flex items-center gap-1">
        <Mail className="w-3 h-3" />
        Subject: {subject}
      </p>
      <div className="bg-[#1a2744] rounded p-3 font-mono">
        {children}
      </div>
    </div>
  );
}
