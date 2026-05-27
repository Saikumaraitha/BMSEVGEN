import type { ChatProject, RecentChat, AgentCategory, AgentChatMessage, FrequentQuery } from '../../types/chat-agents';

export const mockProjects: ChatProject[] = [
  {
    id: 'proj-001',
    name: 'Q1 2026 Cobenfy Launch',
    chats: [
      { id: 'chat-001', title: 'Cobenfy GI Safety Profile', projectId: 'proj-001' },
      { id: 'chat-002', title: 'HCP Adoption Barriers', projectId: 'proj-001' },
      { id: 'chat-003', title: 'Titration Strategy Analysis', projectId: 'proj-001' },
    ],
  },
  {
    id: 'proj-002',
    name: 'KOL Prep — Akeso Advisory',
    chats: [
      { id: 'chat-004', title: 'KOL Advisory Board Prep', projectId: 'proj-002' },
      { id: 'chat-005', title: 'BNT327 vs Ivonescimab', projectId: 'proj-002' },
    ],
  },
];

export const mockRecentChats: RecentChat[] = [
  { id: 'recent-001', title: 'SWOT – Bispecific Landscape' },
  { id: 'recent-002', title: 'Akeso Trial Readout Summary' },
  { id: 'recent-003', title: 'TPP Positioning vs Competitors' },
  { id: 'recent-004', title: 'Patient Segment Prioritization' },
  { id: 'recent-005', title: 'KOL Advisory Board Prep' },
  { id: 'recent-006', title: 'BNT327 vs Ivonescimab' },
  { id: 'recent-007', title: 'PD-L1×VEGF MOA Deep Dive' },
  { id: 'recent-008', title: '1L NSCLC Treatment Landscape' },
];

export const mockAgentCategories: AgentCategory[] = [
  {
    id: 'agent-cat-001',
    name: 'Disease & Treatment Landscape',
    icon: 'disease-treatment',
    agents: [
      {
        id: 'agent-001',
        name: 'Disease Pathophysiology',
        description: 'Epidemiology, etiology, molecular drivers and disease biology overview',
        icon: 'bi-lungs',
      },
      {
        id: 'agent-002',
        name: 'MOA Landscape',
        description: 'Mechanism of action comparison across all competing assets in class',
        icon: 'bi-diagram-3',
      },
      {
        id: 'agent-003',
        name: 'Treatment Paradigm',
        description: 'Lines of therapy, unmet needs, gaps, and asset positioning rationale',
        icon: 'bi-arrow-repeat',
      },
      {
        id: 'agent-004',
        name: 'Treatment Segments',
        description: 'Patient segmentation by biomarker, line of therapy, and clinical setting',
        icon: 'bi-people-fill',
      },
    ],
  },
  {
    id: 'agent-cat-002',
    name: 'Competitive Benchmark',
    icon: 'competitive-benchmark',
    agents: [
      {
        id: 'agent-005',
        name: 'Competitor Profiling',
        description: 'Multi-parameter comparison of clinical, regulatory, and commercial attributes',
        icon: 'bi-clipboard-data',
      },
      {
        id: 'agent-006',
        name: 'Trial Analytics',
        description: 'Phase progression, enrollment trends, endpoint design, and readout timelines',
        icon: 'bi-graph-up',
      },
      {
        id: 'agent-007',
        name: '360° Competitive View',
        description: 'Integrated MOA, efficacy, safety, and differentiation assessment',
        icon: 'bi-eye',
      },
    ],
  },
  {
    id: 'agent-cat-003',
    name: 'Asset Strategy & Evidence',
    icon: 'asset-strategy',
    agents: [
      {
        id: 'agent-008',
        name: 'Target Product Profile',
        description: 'Extract, structure, and benchmark TPP parameters vs. competitors',
        icon: 'bi-file-earmark-text',
      },
      {
        id: 'agent-009',
        name: 'SWOT Analysis',
        description: 'Comprehensive strengths, weaknesses, opportunities, and threats assessment',
        icon: 'bi-grid-fill',
      },
      {
        id: 'agent-010',
        name: 'Strategic Context',
        description: 'Medical strategy vision, imperatives, and evidence generation objectives',
        icon: 'bi-flag',
      },
      {
        id: 'agent-011',
        name: 'Insights Tracker',
        description: 'Timeline of advisory boards, congresses, KOL feedback, and key reviews',
        icon: 'bi-calendar-event',
      },
    ],
  },
];

export const mockChatMessages: AgentChatMessage[] = [
  {
    id: 'amsg-001',
    role: 'ai',
    content:
      'I\'ve analyzed the competitive landscape for bispecific antibodies in NSCLC. The key players are Ivonescimab (AK112), BNT327, and LY3434172. Would you like me to focus on a specific aspect?',
    timestamp: '2026-05-18T09:00:00',
  },
  {
    id: 'amsg-002',
    role: 'user',
    content: 'What are the most critical threats we should address first?',
    userInitials: 'AS',
    timestamp: '2026-05-18T09:05:00',
  },
  {
    id: 'amsg-003',
    role: 'ai',
    content: `## Critical Threats — Priority Assessment

The most critical threats to address are:

1. **Ivonescimab Phase 3 superiority data** — Akeso's HARMONi-2 trial demonstrated statistically significant superiority over pembrolizumab monotherapy in PD-L1 high NSCLC (ORR **50.7% vs 38.8%**, p<0.001), establishing a new efficacy benchmark that directly challenges your differentiation narrative.

2. **BNT327 accelerated enrollment** — Pfizer's Phase 2/3 program is tracking ahead of schedule with PFS HR 0.62 reported at interim analysis. The narrowing first-mover window in combination IO represents a near-term competitive risk.

3. **Payer access dynamics** — Early advisory signals indicate heightened payer scrutiny on combination regimens without mature OS data. Without a clear survival story, launch access in Tier 1 formulary positions may be delayed by **12–18 months**.

## Recommended Immediate Actions

- Accelerate KOL engagement around dual-pathway MOA differentiation
- Commission targeted real-world evidence study to bridge the OS gap
- Develop payer-specific dossiers emphasizing quality-of-life and safety differentiation`,
    timestamp: '2026-05-18T09:05:05',
  },
];

export const mockFrequentQueries: FrequentQuery[] = [
  {
    id: 'faq-001',
    question: 'What are the key clinical differentiation points for Pumitamig vs. competitors in 1L NSCLC?',
  },
  {
    id: 'faq-002',
    question: 'Summarize the most critical evidence gaps in the PD-L1 high NSCLC treatment landscape.',
  },
  {
    id: 'faq-003',
    question: 'What are the top KOL concerns about bispecific antibody safety and tolerability profiles?',
  },
  {
    id: 'faq-004',
    question: 'How does ivonescimab\'s HARMONi-2 Phase 3 data impact our current positioning strategy?',
  },
  {
    id: 'faq-005',
    question: 'Provide a SWOT analysis for our target product profile in first-line NSCLC.',
  },
  {
    id: 'faq-006',
    question: 'Which patient segments are most likely to benefit from PD-L1 × VEGF dual-pathway targeting?',
  },
  {
    id: 'faq-007',
    question: 'Compare endpoint selection strategies across the competitive bispecific landscape in NSCLC.',
  },
  {
    id: 'faq-008',
    question: 'What are the key regulatory considerations for accelerated approval pathways in RCC?',
  },
];

// ─── Per-agent mock AI response content (replaces live API responses) ─────────

export const mockAgentResponseContent: Record<string, string> = {
  'agent-001': `## Disease Pathophysiology — Pumitamig / 1L NSCLC

Non-small cell lung cancer (NSCLC) represents **85%** of all lung cancer diagnoses globally, with an estimated **2.2 million** new cases annually. PD-L1 high tumors (TPS ≥50%) account for approximately **30%** of all NSCLC presentations.

## Molecular Drivers
- **KRAS G12C** mutations: ~13% of NSCLC adenocarcinoma
- **PD-L1 TPS ≥50%**: primary immunotherapy-eligible population
- **VEGF pathway co-activation** observed in ~60% of PD-L1 high tumors, supporting dual-pathway hypothesis

## Disease Biology
Elevated tumor vascularity in PD-L1 high microenvironments creates an immunosuppressive state. Co-targeting PD-L1 and VEGF may normalize vasculature while restoring T-cell trafficking — a mechanistic rationale for combination approaches.`,

  'agent-002': `## MOA Landscape — Bispecific IO Class

## Pumitamig (PD-L1 × VEGF)
Simultaneous blockade of PD-L1 (checkpoint inhibition) and VEGF (anti-angiogenesis) in a single molecule. Designed to normalize the tumor microenvironment while enabling immune-mediated tumor killing.

## Competitive MOA Summary
- **Ivonescimab (AK112)** — PD-1 × VEGF bispecific; HARMONi-2 showed ORR **50.7%** vs pembro ORR **38.8%**
- **BNT327 (Pfizer)** — PD-L1 × VEGF; Phase 2/3 interim PFS HR **0.62**
- **Pembrolizumab** — PD-1 monotherapy; standard comparator in PD-L1 high setting

## Key Differentiation
Pumitamig's PD-**L1** (not PD-1) targeting may offer distinct TME penetration and avoid the receptor competition observed with PD-1 class competitors.`,

  'agent-003': `## Treatment Paradigm — 1L NSCLC PD-L1 High

## Lines of Therapy
1. **1L Standard:** Pembrolizumab monotherapy (FDA approved 2016) for TPS ≥50%
2. **1L Emerging:** Bispecific IO/anti-VEGF combinations challenging monotherapy
3. **2L+:** Docetaxel ± ramucirumab; platinum doublet for primary resistors

## Unmet Needs
- **OS benefit plateau** at ~30% 5-year survival even in PD-L1 high
- No validated predictive biomarkers beyond TPS for IO benefit
- Primary resistance in **~40–50%** of PD-L1 high patients to checkpoint monotherapy

## Positioning Rationale
Dual-pathway agents like Pumitamig may address primary IO resistance by normalizing vascular immunosuppression, creating a differentiated position for patients with high VEGF co-expression.`,

  'agent-004': `## Treatment Segments — PD-L1 High NSCLC

## Biomarker Segmentation
| Segment | TPS Range | VEGF Co-expression | Est. Share |
|---|---|---|---|
| IO Ideal | ≥50% | High | ~18% |
| IO Moderate | ≥50% | Low/Neg | ~12% |
| Biomarker Excluded | <50% | Any | ~70% |

## Line of Therapy Segments
- **Treatment-naïve 1L:** Largest addressable segment; primary target for Pumitamig launch
- **Post-IO progression:** Secondary opportunity if cross-class switching is supported
- **Combination-eligible (fit patients):** ECOG 0–1; key access criterion

## Clinical Setting Segments
- Academic/comprehensive cancer centers: **45%** of PD-L1 high initiations
- Community oncology practices: **55%** of initiations; key MSL engagement target`,

  'agent-005': `## Competitor Profiling — Bispecific IO Landscape

## Ivonescimab (Akeso / Summit)
- **Mechanism:** PD-1 × VEGF bispecific
- **Phase:** Phase 3 (HARMONi-2 readout)
- **Key Data:** ORR **50.7%** vs pembro **38.8%**, p<0.001; PFS HR **0.51**
- **Regulatory:** BLA submission anticipated H2 2026
- **Commercial:** US rights with Summit Therapeutics

## BNT327 (BioNTech / Pfizer)
- **Mechanism:** PD-L1 × VEGF bispecific (same class as Pumitamig)
- **Phase:** Phase 2/3; interim data: PFS HR **0.62**
- **Regulatory:** Breakthrough Therapy Designation (NSCLC)
- **Timeline:** US approval potential 2027–2028

## LY3434172 (Eli Lilly)
- **Mechanism:** PD-1 × PD-L1 bispecific
- **Phase:** Phase 2 (dose expansion)
- **Data:** ORR ~42% in heavily pre-treated NSCLC`,

  'agent-006': `## Trial Analytics — Competitive Landscape

## Phase Progression Summary
- **HARMONi-2 (Ivonescimab):** Phase 3 complete — superiority confirmed; regulatory filing expected
- **BNT327-NSCLC-301:** Phase 2/3 ongoing — **73%** enrollment complete as of Q1 2026
- **Pumitamig Phase 3:** Design finalized; SIV initiation Q3 2026

## Enrollment Trends
Competitive trials averaging **18–24 months** enrollment for 1L NSCLC PD-L1 high. Key site competition with academic centers creates risk of slow accrual without differentiated site strategy.

## Endpoint Design
| Trial | Primary Endpoint | Key Secondary |
|---|---|---|
| HARMONi-2 | PFS (superiority vs pembro) | OS, ORR |
| BNT327-301 | PFS + OS (co-primary) | DoR, PFS2 |
| Pumitamig Ph3 | OS (superiority) | PFS, ORR, QoL |

## Readout Timelines
- HARMONi-2 OS: **Q4 2026** (estimated)
- BNT327 primary analysis: **2027**`,

  'agent-007': `## 360° Competitive View — Pumitamig vs. Class

## Efficacy Comparison
- Ivonescimab demonstrates strongest published efficacy data (ORR **50.7%**, PFS HR **0.51**)
- BNT327 interim data competitive (PFS HR **0.62**)
- Pumitamig OS-primary endpoint is higher regulatory bar but more compelling commercial differentiator

## Safety Differentiation
- PD-L1 targeting vs PD-1 may reduce irAE burden — key HCP perception opportunity
- VEGF-related toxicities (hypertension, proteinuria) class-wide; managed dosing schedule critical

## MOA Differentiation
Pumitamig's bivalent PD-L1 binding architecture delivers superior receptor occupancy vs monoclonal comparators. PD-L1 specificity avoids PD-1 receptor crowding present in ivonescimab class.

## Commercial Differentiation Levers
1. OS as primary — strongest payer/prescriber signal
2. Safety profile — irAE reduction narrative for broad community use
3. Biomarker strategy — VEGF co-expression assay could define a precision market`,

  'agent-008': `## Target Product Profile — Pumitamig 1L NSCLC

## TPP Parameters vs. Competitors
| Attribute | Pumitamig | Ivonescimab | Pembro |
|---|---|---|---|
| Indication | 1L NSCLC TPS ≥50% | 1L NSCLC TPS ≥50% | 1L NSCLC TPS ≥50% |
| Mechanism | PD-L1 × VEGF bispecific | PD-1 × VEGF bispecific | PD-1 mAb |
| Primary Endpoint | OS (superiority) | PFS (superiority) | PFS/OS |
| Dosing | Q3W flat dose | Q2W weight-based | Q6W flat dose |
| Route | IV infusion | IV infusion | IV infusion |
| Biomarker | PD-L1 TPS ≥50% | PD-L1 TPS ≥50% | PD-L1 TPS ≥50% |

## Differentiation Opportunities
- **OS-primary design:** Superior commercial narrative vs PFS-only competitors
- **Safety:** PD-L1 specificity may reduce irAE class risk
- **Precision biomarker:** VEGF co-expression assay in development`,

  'agent-009': `## SWOT Analysis — Pumitamig 1L NSCLC

## Strengths
- Mechanistically rational dual-pathway design (PD-L1 × VEGF)
- OS-primary endpoint: strongest commercial positioning signal
- PD-L1 specificity — potential irAE advantage vs PD-1 competitors
- **BMS global infrastructure** and oncology commercial capabilities

## Weaknesses
- Later to market vs ivonescimab (Phase 3 complete) and BNT327 (enrollment ahead)
- No published Phase 3 efficacy data yet; prescriber confidence gap
- PD-L1 TPS ≥50% limits addressable market to ~**30%** of NSCLC

## Opportunities
- Growing recognition that combination IO/anti-VEGF is new standard of care
- VEGF co-expression biomarker could enable precision market segment
- Partnership or licensing in key APAC markets where ivonescimab dominates

## Threats
- Ivonescimab BLA filing H2 2026 — potential FDA approval before Pumitamig Phase 3 read
- BNT327 breakthrough designation accelerates competitive timeline
- Payer pushback on combination pricing without clear OS advantage`,

  'agent-010': `## Strategic Context — Pumitamig Medical Strategy

## Medical Strategy Vision
Establish Pumitamig as the preferred OS-proven dual-pathway IO therapy for PD-L1 high NSCLC, leveraging superior survival data to achieve Tier 1 formulary access and KOL endorsement at launch.

## Strategic Imperatives
1. **Generate OS superiority data** — Phase 3 OS-primary design is the anchor; interim analysis strategy must balance early readout with regulatory robustness
2. **Build KOL conviction ahead of data** — Advisory board program to establish mechanistic credibility pre-Phase 3 readout
3. **Define the VEGF co-expression biomarker** — Companion diagnostic partnership to enable precision positioning
4. **Evidence generation in key evidence gaps** — RWE program to address OS-maturity lag and support formulary submissions

## Evidence Generation Objectives
- Phase 3 NSCLC: Primary OS readout target **Q4 2027**
- Phase 2 RCC expansion: IND submission **Q2 2026**
- Biomarker validation study: Protocol finalization **Q3 2026**`,

  'agent-011': `## Insights Tracker — Advisory Boards & Congress Timeline

## Advisory Board Activity (2026)
- **Jan 2026:** ASCO GU — KOL feedback on RCC positioning; concern re: VEGF safety in renal patients
- **Feb 2026:** Internal MSL Advisory — confirmed PD-L1 targeting differentiation resonates with community oncologists
- **Mar 2026:** Global Medical Affairs Strategy Board — aligned on OS-primary endpoint as commercial differentiator
- **Apr 2026:** EU KOL Advisory (Virtual) — payer landscape review; EU access challenges flagged

## Upcoming Congress Calendar
| Congress | Date | Key Topic |
|---|---|---|
| ASCO Annual | Jun 2026 | Competitive bispecific data (HARMONi-2 OS update) |
| ESMO | Sep 2026 | BNT327 Phase 2/3 interim readout expected |
| SITC | Nov 2026 | Pumitamig Phase 2 biomarker data presentation |
| ASH | Dec 2026 | Hematology — no direct Pumitamig content |

## Key KOL Feedback Themes
- **Positive:** Mechanistic rationale for dual-pathway; OS primary endpoint credibility
- **Concern:** Late-mover risk; need differentiated safety data vs ivonescimab`,
};
