import type { CompanyRole } from '@/types';

export const roles: CompanyRole[] = [
  {
    id: 'acquisition',
    name: 'Acquisition Lead',
    icon: 'Phone',
    description: 'Front-line seller outreach, qualification calls, and rapport building. The voice of NoteWorthy Capital to prospective note holders.',
    color: '#3b82f6',
    kpis: [
      'Lead-to-qualified rate ≥25%',
      'Average call duration: 8-12 min',
      'Seller satisfaction score ≥4.5/5',
      'Referrals generated per closed deal ≥1.5'
    ],
    scenarioIds: ['al-cold-call', 'al-voicemail', 'al-qualify', 'al-objection']
  },
  {
    id: 'underwriting',
    name: 'Underwriting Analyst',
    icon: 'BarChart3',
    description: 'Due diligence, LTV analysis, yield calculations, and risk assessment. The gatekeeper of deal quality.',
    color: '#10b981',
    kpis: [
      'Deals analyzed per week: 8-12',
      'Underwriting accuracy: 100%',
      'Average LTV of closed deals: ≤68%',
      'Time from qualification to LOI: ≤48 hours'
    ],
    scenarioIds: ['ua-deal-review', 'ua-explain-yield']
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: 'Scale',
    description: 'Contract review, securities law analysis, and regulatory compliance. Protects the company from liability.',
    color: '#8b5cf6',
    kpis: [
      'Contract review time: ≤24 hours',
      'Compliance audit score: ≥90%',
      'Zero regulatory violations',
      'Buyer accreditation verification: 100%'
    ],
    scenarioIds: ['lo-contract-review', 'lo-nda-standoff']
  },
  {
    id: 'buyer-relations',
    name: 'Buyer Relations Manager',
    icon: 'Users',
    description: 'Cultivates buyer network, qualifies investors, presents deals, and negotiates assignments.',
    color: '#f59e0b',
    kpis: [
      'Active buyers in network: ≥25',
      'Buyer response time: ≤2 hours',
      'Deal-to-buyer match time: ≤24 hours',
      'Buyer retention rate: ≥80% annually'
    ],
    scenarioIds: ['br-qualify-buyer', 'br-deal-presentation', 'br-negotiate']
  },
  {
    id: 'operations',
    name: 'Operations Coordinator',
    icon: 'ClipboardList',
    description: 'Escrow coordination, document management, timeline tracking, and post-closing follow-up.',
    color: '#ef4444',
    kpis: [
      'Average closing time: ≤14 days',
      'Document accuracy: 100%',
      'Recording same-day rate: 100%',
      'Post-closing issues: ≤5% of deals'
    ],
    scenarioIds: ['oc-escrow', 'oc-crisis']
  },
  {
    id: 'buyer-pool',
    name: 'Buyer Pool Builder',
    icon: 'Users',
    description: 'THE MOST IMPORTANT ROLE. Sources, qualifies, and maintains a network of active note buyers. Without buyers, there are no flips.',
    color: '#c9a84c',
    kpis: [
      'Active qualified buyers: ≥25',
      'Buyer response rate to deals: ≥60%',
      'New buyer additions per month: ≥3',
      'Buyer retention rate: ≥80% annually'
    ],
    scenarioIds: ['chris-peterson', 'maria-santos', 'david-kim']
  },
  {
    id: 'referral-partner',
    name: 'Referral Partner Manager',
    icon: 'Handshake',
    description: 'Builds and manages relationships with CPAs, attorneys, meetup organizers, and other professionals who can introduce qualified note buyers to NoteWorthy Capital.',
    color: '#ec4899',
    kpis: [
      'Active referral partners: ≥10',
      'Qualified introductions per quarter: ≥15',
      'Partner-sourced buyer conversions: ≥25%',
      'Referral partner retention rate: ≥80%'
    ],
    scenarioIds: ['robert-chen', 'amanda-foster']
  }
];
