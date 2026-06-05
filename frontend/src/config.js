export const SKILLS = {
  'Drug Information': {
    color: '#0eb884',
    bg: 'rgba(14,184,132,0.1)',
    border: 'rgba(14,184,132,0.25)',
    icon: '💊',
    id: 'drug',
  },
  'Objection Handling': {
    color: '#4d8ff0',
    bg: 'rgba(77,143,240,0.1)',
    border: 'rgba(77,143,240,0.25)',
    icon: '🗣️',
    id: 'objection',
  },
  'CRM Action': {
    color: '#9b7cf4',
    bg: 'rgba(155,124,244,0.1)',
    border: 'rgba(155,124,244,0.25)',
    icon: '🗄️',
    id: 'crm',
  },
  'Compliance Guard': {
    color: '#f0a84d',
    bg: 'rgba(240,168,77,0.1)',
    border: 'rgba(240,168,77,0.25)',
    icon: '🛡️',
    id: 'compliance',
  },
  'HCP Profile': {
    color: '#f06b8a',
    bg: 'rgba(240,107,138,0.1)',
    border: 'rgba(240,107,138,0.25)',
    icon: '📋',
    id: 'hcp',
  },
}

export const QUICK_PROMPTS = [
  {
    label: 'Keytruda indications',
    prompt: 'What are the approved indications for Keytruda (pembrolizumab)?',
  },
  {
    label: 'Handle safety objection',
    prompt: 'The doctor says the side effect profile is too risky. How should I respond?',
  },
  {
    label: 'Log visit to Veeva',
    prompt: 'Log this visit to Veeva CRM and suggest the next best action for Dr. Raj.',
  },
  {
    label: 'Off-label compliance check',
    prompt: 'Can I proactively share this off-label study with Dr. Raj?',
  },
  {
    label: 'HCP profile summary',
    prompt: "Give me a quick summary of Dr. Raj's profile and engagement history.",
  },
  {
    label: 'Competitor question',
    prompt: 'Dr. Raj is asking how we compare to Opdivo. How do I respond?',
  },
]

export const HCP = {
  name: 'Dr. Raj',
  initials: 'DR',
  specialty: 'Oncology',
  hospital: 'Sunnybrook Hospital',
  city: 'Toronto',
  tier: 'KOL Tier 1',
  patients: '~40/week',
}
