import type {
  ResearchDocument,
  ResearchDocumentData,
  ResearchNote,
  ChatMessage,
  DocumentComment,
  ShareMember,
  TeamMember,
} from '../../types/research-documents';

export const mockDocuments: ResearchDocument[] = [
  {
    id: 'doc-001',
    title: 'Pumitamig Research Doc 1',
    accessType: 'My Doc',
    owner: { name: 'Ava Sharma', initials: 'AS', role: 'Portfolio Strategy Lead', avatarColor: '#7c3aed' },
    lastEdited: '2026-02-03',
    lastEditedBy: 'Ava Sharma',
    description:
      'Strong relationship observed between PD-L1 high tumors and localized VEGF density across the synthesized evidence set. Supports prioritizing RCC refresh questions around dual-pathway positioning and biomarker segmentation.',
    noteCount: 3,
    commentCount: 2,
  },
  {
    id: 'doc-002',
    title: 'Pumitamig Research Doc 2',
    accessType: 'Can Edit',
    owner: { name: 'Ryan Lee', initials: 'RL', role: 'Medical Strategy Partner', avatarColor: '#0891b2' },
    lastEdited: '2026-01-21',
    lastEditedBy: 'Ryan Lee',
    description:
      'Benchmark evidence on comparator timing and endpoint selection for TNBC programs. Covers key trial design decisions across the competitive landscape and highlights critical evidence gaps.',
    noteCount: 0,
    commentCount: 0,
  },
  {
    id: 'doc-003',
    title: 'Pumitamig Research Doc 3',
    accessType: 'View Only',
    owner: { name: 'Maya Kim', initials: 'MK', role: 'Clinical Evidence Lead', avatarColor: '#d97706' },
    lastEdited: '2026-01-21',
    lastEditedBy: 'Maya Kim',
    description:
      'Overview of first-line treatment patterns in NSCLC with PD-L1 ≥50%, focusing on emerging data from combination regimens and patient subgroup stratification across key trials.',
    noteCount: 0,
    commentCount: 0,
  },
];

const doc1Notes: ResearchNote[] = [
  {
    id: 'note-001',
    number: 1,
    title: 'Difference between NSCLC and RCC',
    content:
      'NSCLC and RCC differ in their underlying biology, therapeutic approach, and the key evidence priorities that guide decision-making. In NSCLC, a form of lung cancer, strategy centers on PD-L1 stratification, sequencing across lines of therapy, the role of driver mutations, and mechanisms of resistance. In contrast, RCC—a kidney cancer—places greater focus on VEGF-driven biology, combination strategies targeting multiple pathways, and biomarker-based segmentation within a predominantly angiogenesis-focused landscape.',
    date: 'Apr 23, 2026',
    author: 'Ava Sharma',
    source: 'EvGenAI',
    originalQuery: 'What is the difference between NSCLC and RCC for our strategy?',
  },
  {
    id: 'note-002',
    number: 2,
    title: 'PD-L1 and VEGF pathway interaction in RCC',
    content:
      'Observed a strong relationship between PD-L1 high tumors and localized VEGF density across the synthesized evidence set. This supports prioritizing RCC dual-pathway positioning and biomarker segmentation. High PD-L1 expression correlates with elevated tumor vascularity, suggesting co-targeting may yield synergistic clinical benefit.',
    date: 'Apr 23, 2026',
    author: 'Ava Sharma',
    source: 'manual',
  },
  {
    id: 'note-003',
    number: 3,
    title: 'Difference between NSCLC and RCC',
    content:
      'NSCLC and RCC differ across disease biology, treatment logic, and the evidence questions that matter most. NSCLC is a lung cancer — strategy discussions focus on PD-L1 segmentation, line-of-therapy decisions, driver mutations, and resistance patterns. RCC—a kidney cancer—places greater focus on VEGF-driven biology, combination strategies targeting multiple pathways, and biomarker-based segmentation within a predominantly angiogenesis-focused landscape.',
    date: 'Apr 23, 2026',
    author: 'Nick Jones',
    source: 'manual',
  },
];

const doc1ChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'ai',
    content: "I've analyzed the RCC research context. What would you like to explore?",
    timestamp: '2026-04-23T09:00:00',
  },
  {
    id: 'msg-002',
    role: 'user',
    content: "What's the difference between NSCLC and RCC for our strategy?",
    userInitials: 'AS',
    timestamp: '2026-04-23T09:15:00',
  },
  {
    id: 'msg-003',
    role: 'ai',
    content:
      'NSCLC and RCC differ across disease biology, treatment logic, and the evidence questions that matter most. NSCLC is a lung cancer — strategy discussions focus on PD-L1 segmentation, line-of-therapy decisions, driver mutations, and resistance patterns. RCC—a kidney cancer—places greater focus on VEGF-driven biology, combination strategies targeting multiple pathways, and biomarker-based segmentation within a predominantly angiogenesis-focused landscape.',
    timestamp: '2026-04-23T09:15:05',
  },
];

const doc1Comments: DocumentComment[] = [
  {
    id: 'cmt-001',
    author: 'Maya Kim',
    authorInitials: 'MK',
    authorColor: '#FDECE6',
    authorTextColor: '#A6330E',
    date: 'Apr 25',
    time: '10:41 AM',
    content:
      'Do we have a source citation for the correlation between PD-L1 expression and tumor vascularity? Would strengthen the evidence base significantly.',
    replies: [],
  },
  {
    id: 'cmt-002',
    author: 'Ava Sharma',
    authorInitials: 'AS',
    authorColor: '#EEEDFF',
    authorTextColor: '#5265B0',
    date: 'Apr 25',
    time: '11:25 AM',
    content:
      'Great point—agree that a direct citation would strengthen this. The relationship between PD-L1 expression and tumor vascularity is generally supported more indirectly through biology than through a single definitive clinical correlation study.',
    replies: [],
  },
];

// ─── Team Members (searchable roster for adding to a doc) ────────────────────

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'Erica Jones',        email: 'e.jones@bms.com',       initials: 'EJ', avatarColor: '#e879a0', jobRole: 'Portfolio Strategy Lead'   },
  { id: 'tm-002', name: 'Andrew Smith',        email: 'a.smith@bms.com',       initials: 'AS', avatarColor: '#9c5de8', jobRole: 'Medical Strategy Partner'  },
  { id: 'tm-003', name: 'Walker Texas Ranger', email: 'w.tex.ranger@bms.com',  initials: 'WR', avatarColor: '#e84444', jobRole: 'Clinical Evidence Lead'     },
  { id: 'tm-004', name: 'Alberto Gunil',       email: 'a.gunil@bms.com',       initials: 'AG', avatarColor: '#c44ed4', jobRole: 'Regulatory Affairs Lead'    },
  { id: 'tm-005', name: 'Ava Sharma',          email: 'ava.sharma@bms.com',    initials: 'AS', avatarColor: '#7c3aed', jobRole: 'Portfolio Strategy Lead'   },
  { id: 'tm-006', name: 'Ryan Lee',            email: 'r.lee@bms.com',         initials: 'RL', avatarColor: '#0891b2', jobRole: 'Medical Strategy Partner'  },
  { id: 'tm-007', name: 'Maya Kim',            email: 'm.kim@bms.com',         initials: 'MK', avatarColor: '#d97706', jobRole: 'Clinical Evidence Lead'     },
  { id: 'tm-008', name: 'Sarah Chen',          email: 's.chen@bms.com',        initials: 'SC', avatarColor: '#059669', jobRole: 'Biomarker Strategy Lead'    },
  { id: 'tm-009', name: 'Marcus Webb',         email: 'm.webb@bms.com',        initials: 'MW', avatarColor: '#dc2626', jobRole: 'Evidence Generation Lead'   },
  { id: 'tm-010', name: 'Lisa Park',           email: 'l.park@bms.com',        initials: 'LP', avatarColor: '#2563eb', jobRole: 'Medical Affairs Director'   },
  { id: 'tm-011', name: 'David Torres',        email: 'd.torres@bms.com',      initials: 'DT', avatarColor: '#0d9488', jobRole: 'Clinical Development Lead'  },
  { id: 'tm-012', name: 'Nina Patel',          email: 'n.patel@bms.com',       initials: 'NP', avatarColor: '#9333ea', jobRole: 'Global Medical Director'    },
];

// ─── People with access per document ─────────────────────────────────────────

export const mockDocShareMembers: Record<string, ShareMember[]> = {
  'doc-001': [
    { id: 'tm-001', name: 'Erica Jones',        email: 'e.jones@bms.com',      initials: 'EJ', avatarColor: '#e879a0', role: 'Owner'  },
    { id: 'tm-002', name: 'Andrew Smith',        email: 'a.smith@bms.com',      initials: 'AS', avatarColor: '#9c5de8', role: 'Editor' },
    { id: 'tm-003', name: 'Walker Texas Ranger', email: 'w.tex.ranger@bms.com', initials: 'WR', avatarColor: '#e84444', role: 'Editor' },
    { id: 'tm-004', name: 'Alberto Gunil',       email: 'a.gunil@bms.com',      initials: 'AG', avatarColor: '#c44ed4', role: 'Viewer' },
  ],
  'doc-002': [
    { id: 'tm-006', name: 'Ryan Lee',   email: 'r.lee@bms.com',      initials: 'RL', avatarColor: '#0891b2', role: 'Owner'  },
    { id: 'tm-007', name: 'Maya Kim',   email: 'm.kim@bms.com',      initials: 'MK', avatarColor: '#d97706', role: 'Editor' },
    { id: 'tm-005', name: 'Ava Sharma', email: 'ava.sharma@bms.com', initials: 'AS', avatarColor: '#7c3aed', role: 'Viewer' },
    { id: 'tm-008', name: 'Sarah Chen', email: 's.chen@bms.com',     initials: 'SC', avatarColor: '#059669', role: 'Viewer' },
  ],
  'doc-003': [
    { id: 'tm-007', name: 'Maya Kim',    email: 'm.kim@bms.com',    initials: 'MK', avatarColor: '#d97706', role: 'Owner'  },
    { id: 'tm-006', name: 'Ryan Lee',    email: 'r.lee@bms.com',    initials: 'RL', avatarColor: '#0891b2', role: 'Viewer' },
    { id: 'tm-009', name: 'Marcus Webb', email: 'm.webb@bms.com',   initials: 'MW', avatarColor: '#dc2626', role: 'Editor' },
  ],
};

// ─── Document data ────────────────────────────────────────────────────────────

export const mockDocumentData: Record<string, ResearchDocumentData> = {
  'doc-001': {
    document: mockDocuments[0],
    notes: doc1Notes,
    chatMessages: doc1ChatMessages,
    comments: doc1Comments,
    commentHeader: 'Re: PD-L1 and VEGF pathway interaction in RCC',
  },
  'doc-002': {
    document: mockDocuments[1],
    notes: [],
    chatMessages: [],
    comments: [],
    commentHeader: 'Document Comments (0)',
  },
  'doc-003': {
    document: mockDocuments[2],
    notes: [],
    chatMessages: [],
    comments: [],
    commentHeader: 'Document Comments (0)',
  },
};
