export interface StateData {
  rank: number;
  state: string;
  code: string;
  count2024: number;
  percentage: string;
  foreclosureType: 'judicial' | 'non-judicial' | 'both';
  note: string;
}

export const topStates2024: StateData[] = [
  {
    rank: 1,
    state: 'Texas',
    code: 'TX',
    count2024: 22584,
    percentage: '25.1%',
    foreclosureType: 'non-judicial',
    note: 'Largest market by far. Non-judicial foreclosure (fast). No state income tax. Strong investor activity in secondary markets. Average note size: $285K.',
  },
  {
    rank: 2,
    state: 'Florida',
    code: 'FL',
    count2024: 8088,
    percentage: '9.0%',
    foreclosureType: 'judicial',
    note: 'Judicial foreclosure state (slower process). High retirement buyer demand. Strong land contract activity. Hot spots: Tampa, Orlando, Jacksonville.',
  },
  {
    rank: 3,
    state: 'California',
    code: 'CA',
    count2024: 7083,
    percentage: '7.9%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial (trust deed state). Highest average note values ($425K+). Complex regulatory environment. Strong institutional buyer presence.',
  },
  {
    rank: 4,
    state: 'North Carolina',
    code: 'NC',
    count2024: 4362,
    percentage: '4.9%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial (power of sale). Strong growth market. NoteWorthy target state. Charlotte and Raleigh metros expanding rapidly.',
  },
  {
    rank: 5,
    state: 'Georgia',
    code: 'GA',
    count2024: 3767,
    percentage: '4.2%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial. Atlanta metro is a hub for note investors. Strong performing note market. Good entry point for new buyers.',
  },
  {
    rank: 6,
    state: 'Arizona',
    code: 'AZ',
    count2024: 3757,
    percentage: '4.2%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial (trust deed). Phoenix and Tucson markets. Popular with IRA investors. Strong snowbird/rental demand supports values.',
  },
  {
    rank: 7,
    state: 'Washington',
    code: 'WA',
    count2024: 2955,
    percentage: '3.3%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial. Higher-value notes. Tech wealth creates investor demand. Seattle metro dominant. Environmental regulations affect land notes.',
  },
  {
    rank: 8,
    state: 'New York',
    code: 'NY',
    count2024: 2875,
    percentage: '3.2%',
    foreclosureType: 'judicial',
    note: 'Judicial foreclosure (very slow). Upstate NY is more active than NYC for seller financing. Higher regulatory complexity.',
  },
  {
    rank: 9,
    state: 'Tennessee',
    code: 'TN',
    count2024: 2355,
    percentage: '2.6%',
    foreclosureType: 'non-judicial',
    note: 'Non-judicial (power of sale). New to top 10 in 2024. Nashville and Memphis markets. Investor-friendly. No state income tax.',
  },
  {
    rank: 10,
    state: 'Pennsylvania',
    code: 'PA',
    count2024: 2341,
    percentage: '2.6%',
    foreclosureType: 'judicial',
    note: 'Judicial foreclosure. Pittsburgh and Philadelphia markets. Growing investor interest. Moderate note values. Strong Rust Belt recovery.',
  },
];

export const marketSummary2024 = {
  totalNotesCreated: 89890,
  totalDollarVolume: '$30.3 Billion',
  avgResidentialNote: '$271,655',
  avgResidentialLTV: '73%',
  avgDownPayment: '27%',
  top10Share: '66.9%',
  growthYoY: '+8% (dollar volume)',
};

export const getForeclosureColor = (type: string): string => {
  switch (type) {
    case 'non-judicial': return '#10b981'; // green - faster
    case 'judicial': return '#f59e0b'; // yellow - slower
    case 'both': return '#8b5cf6'; // purple
    default: return '#6b7280';
  }
};

export const getForeclosureLabel = (type: string): string => {
  switch (type) {
    case 'non-judicial': return 'Non-Judicial (Fast)';
    case 'judicial': return 'Judicial (Slow)';
    case 'both': return 'Both';
    default: return type;
  }
};
