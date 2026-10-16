export const HACKVERSE_CATEGORIES = [
  { id: 'all', label: 'All', color: '#6366F1' },
  { id: 'ai-ml', label: 'AI/ML', color: '#BB5CF6' },
  { id: 'web-dev', label: 'Web Development', color: '#00E5A8' },
  { id: 'web3', label: 'Web3', color: '#6366F1' },
  { id: 'fintech', label: 'Fintech', color: '#F59E0B' },
  { id: 'healthcare', label: 'Healthcare', color: '#10B981' },
  { id: 'sustainability', label: 'Sustainability', color: '#06B6D4' },
];

export const HACKVERSE_EVENTS = [
  {
    id: 'ai-innovation-challenge',
    title: 'AI Innovation Challenge',
    tagline: 'Build innovative AI solutions for real-world problems',
    description: 'The AI Innovation Challenge brings together the brightest minds to solve real-world problems using artificial intelligence. Join us for 48 hours of innovation, learning, and collaboration.',
    category: 'ai-ml',
    categoryBadge: 'AI/ML',
    dates: 'Oct 12 - Oct 14, 2024',
    mode: 'Online',
    prizePool: '₹10,00,000',
    teamSize: '1-4',
    organizer: 'HackVerse Foundation',
    featured: true,
    status: 'Registered',
    bannerGradient: 'from-purple-900/60 via-indigo-900/50 to-cyan-900/40',
    accentColor: '#6366F1',
    tracks: [
      { name: 'Generative AI & Agentic Workflows', prize: '₹4,00,000', desc: 'Autonomous multi-agent systems and developer productivity tools.' },
      { name: 'Computer Vision & Real-time Perception', prize: '₹2,50,000', desc: 'Edge vision algorithms for robotics and safety telemetry.' },
      { name: 'Healthcare & Precision Diagnostics', prize: '₹2,00,000', desc: 'Clinical inference pipelines and medical imaging enhancement.' },
      { name: 'Open Innovation & Wildcard', prize: '₹1,50,000', desc: 'Unconventional applications combining hardware, sound, and LLMs.' }
    ],
    timeline: [
      { time: 'Day 1 — 10:00 AM', title: 'Opening Keynote & Problem Releases', desc: 'Virtual Main Stage' },
      { time: 'Day 1 — 12:00 PM', title: 'Hacking Commences & Team Matchmaking', desc: 'Discord Hack Channels' },
      { time: 'Day 2 — 03:00 PM', title: 'Mid-way Mentor Checkpoints', desc: '1-on-1 Video Booths' },
      { time: 'Day 3 — 12:00 PM', title: 'Code Freeze & Devpost Project Push', desc: 'Repository Submission Gate' },
      { time: 'Day 3 — 04:00 PM', title: 'Live Jury Demos & Winners Ceremony', desc: 'Stream Broadcast' }
    ]
  },
  {
    id: 'smart-india-hackathon',
    title: 'Smart India Hackathon',
    tagline: 'World’s biggest open innovation movement by Govt of India',
    description: 'Nationwide initiative to provide students with a platform to solve pressing problems of daily lives.',
    category: 'web-dev',
    categoryBadge: 'Hybrid • Government',
    dates: 'Nov 01 - Nov 03, 2024',
    mode: 'Hybrid',
    prizePool: '₹5,00,000',
    teamSize: '6 Members',
    organizer: 'Ministry of Education',
    featured: true,
    status: 'Open'
  },
  {
    id: 'web3-builders',
    title: 'Web3 Builders',
    tagline: 'Architect decentralized rails, zero-knowledge proofs and smart contracts',
    description: 'Build dApps, rollups, and cross-chain solutions on frontier protocols.',
    category: 'web3',
    categoryBadge: 'Web3',
    dates: 'Nov 15 - Nov 17, 2024',
    mode: 'Online',
    prizePool: '₹3,00,000',
    teamSize: '1-4',
    organizer: 'Ethereum India Guild',
    featured: true,
    status: 'Ongoing'
  },
  {
    id: 'sustainability-hackathon',
    title: 'Sustainability Hackathon',
    tagline: 'Climate technology, carbon tracking, and clean energy solutions',
    description: 'Hack for planet Earth by building verified telemetry and ecological circularity tools.',
    category: 'sustainability',
    categoryBadge: 'Hybrid • Sustainability',
    dates: 'Dec 05 - Dec 08, 2024',
    mode: 'Hybrid',
    prizePool: '₹2,00,000',
    teamSize: '2-4',
    organizer: 'CleanEarth Labs',
    featured: false,
    status: 'Upcoming'
  },
  {
    id: 'healthtech-innovate',
    title: 'HealthTech Innovate',
    tagline: 'AI diagnostics, bio-wearables, and federated patient records',
    description: 'Empower clinicians and patients with privacy-first biomedical engineering.',
    category: 'healthcare',
    categoryBadge: 'Online • Healthcare',
    dates: 'Jan 10 - Jan 12, 2025',
    mode: 'Online',
    prizePool: '₹1,50,000',
    teamSize: '1-3',
    organizer: 'BioMed Ventures',
    featured: false,
    status: 'Upcoming'
  },
  {
    id: 'fintech-revolution',
    title: 'FinTech Revolution',
    tagline: 'Instant settlements, algorithmic credit scoring and fraud defense',
    description: 'Reimagine financial inclusion, UPI infrastructure, and automated dispute engines.',
    category: 'fintech',
    categoryBadge: 'Hybrid • Fintech',
    dates: 'Jan 25 - Jan 27, 2025',
    mode: 'Hybrid',
    prizePool: '₹1,00,000',
    teamSize: '2-4',
    organizer: 'FinNext Accelerator',
    featured: false,
    status: 'Upcoming'
  }
];

export const ROHAN_USER = {
  name: 'Rohan Kumar',
  email: 'rohan@example.com',
  college: 'VIT Chennai',
  team: 'Tech Titans',
  role: 'Participant',
  avatar: 'R',
  stats: {
    registered: 3,
    ongoing: 1,
    completed: 2,
    certificates: 5
  },
  qrTicket: {
    id: 'HV24-8842',
    status: 'Checked In',
    checkedInTime: 'Oct 12, 2024 • 10:24 AM',
    eventTitle: 'AI Innovation Challenge'
  }
};

export const PRIYA_ORGANIZER = {
  name: 'Priya Sharma',
  email: 'priya@hackverse.io',
  role: 'Organizer',
  avatar: 'P',
  stats: {
    totalEvents: 3,
    registrations: '1.2K',
    submissions: 850,
    awardsGiven: 5
  },
  registrationTrend: [
    { month: 'Jul', registrations: 140 },
    { month: 'Aug', registrations: 320 },
    { month: 'Sep', registrations: 260 },
    { month: 'Oct', registrations: 410 },
    { month: 'Nov', registrations: 380 },
    { month: 'Dec', registrations: 520 }
  ],
  recentRegistrations: [
    { id: 1, name: 'Aditya Singh', event: 'AI Innovation Challenge', time: '2 mins ago', email: 'aditya@iitd.ac.in', status: 'Approved' },
    { id: 2, name: 'Sneha Patel', event: 'AI Innovation Challenge', time: '5 mins ago', email: 'sneha@bits.ac.in', status: 'Approved' },
    { id: 3, name: 'Rahul Mehta', event: 'Web3 Builders', time: '12 mins ago', email: 'rahul@iiit.ac.in', status: 'Pending' },
    { id: 4, name: 'Ananya Gupta', event: 'Sustainability Hackathon', time: '18 mins ago', email: 'ananya@dtu.ac.in', status: 'Approved' }
  ]
};

export const DEFAULT_FORM_BUILDER_FIELDS = [
  { id: 'f-name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
  { id: 'f-email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@example.com' },
  { id: 'f-college', label: 'College / Organization', type: 'text', required: true, placeholder: 'Enter your institution' },
  { id: 'f-team', label: 'Team Name', type: 'text', required: true, placeholder: 'Enter your team name' },
  { 
    id: 'f-track', 
    label: 'Preferred Track', 
    type: 'dropdown', 
    required: true, 
    options: ['AI & Agentic Workflows', 'Computer Vision', 'Healthcare AI', 'Open Innovation'] 
  }
];
