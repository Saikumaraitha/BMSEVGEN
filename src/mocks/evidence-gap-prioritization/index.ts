import type { EvidenceGapPrioritizationData } from "../../types/evidence-gap-prioritization"

// ── List view gaps ─────────────────────────────────────────────────────────────
const listGaps = [
  {
    id:          "gap-p01",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "Special Populations: Brain mets",
    rationale:   "Addresses a persistent evidence opportunity in a high-risk population underrepresented in trials, where VEGF modulation may offer intracranial benefit beyond PD-1/L1-based SOC",
    priority:    "High"       as const,
    urgency:     "Urgent"     as const,
    impact:      "High"       as const,
    timeHorizon: "Short-term" as const,
  },
  {
    id:          "gap-p02",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "Special Populations: Liver mets",
    rationale:   "Enables evaluation in an immunologically hostile setting with poor IO outcomes, supporting differentiation driven by vascular and immune microenvironment modulation",
    priority:    "High"       as const,
    urgency:     "Urgent"     as const,
    impact:      "High"       as const,
    timeHorizon: "Short-term" as const,
  },
  {
    id:          "gap-p03",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "≥50% TPS: Practice informing data beyond populations in CDP trial",
    rationale:   "Clarifies benefit in a population with multiple effective SOC options, informing differentiation versus PD-1 monotherapy and emerging combination strategies",
    priority:    "Medium"     as const,
    urgency:     "N/A"        as const,
    impact:      "High"       as const,
    timeHorizon: "Long-term"  as const,
  },
  {
    id:          "gap-p04",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "Lack of a validated biomarker framework to select patients for PD-L1 × VEGF bispecific therapy beyond PD-L1 TPS",
    rationale:   "Addresses a key evidence gap in biomarker-driven selection for PD-(L1) × VEGF bispecifics in NSCLC, where activity beyond PD-L1 underscores the need for validated markers to optimize differentiation and Phase 3 success.",
    priority:    "N/A"        as const,
    urgency:     "N/A"        as const,
    impact:      "High"       as const,
    timeHorizon: "Long-term"  as const,
  },
  {
    id:          "gap-p05",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "Post-EGFR TKI mNSCLC: Role of PD-L1 × VEGF bispecific after EGFR-TKI resistance",
    rationale:   "Addresses a critical evidence gap in defining the optimal post-EGFR TKI regimen, where ivonescimab's success and chemo + PD-L1 + anti-VEGF signals lack head-to-head comparisons.",
    priority:    "N/A"        as const,
    urgency:     "N/A"        as const,
    impact:      "Low-Medium" as const,
    timeHorizon: "Short-term" as const,
  },
  {
    id:          "gap-p06",
    egoId:       "ego-1",
    ego:         "Generate data in core CDP tumors (earlier settings)",
    segment:     "1L mNSCLC",
    title:       "2L+ mNSCLC after anti-PD-(L1) + platinum: Activity of pumilimag in patients progressing after first-line chemo-immunotherapy",
    rationale:   "Addresses a major evidence gap in the post-IO setting where poor real-world outcomes highlight unmet need.",
    priority:    "N/A"        as const,
    urgency:     "N/A"        as const,
    impact:      "Low-Medium" as const,
    timeHorizon: "Long-term"  as const,
  },
  {
    id:          "gap-p07",
    egoId:       "ego-2",
    ego:         "Generate signal-seeking data in tumors beyond the CDP",
    segment:     "2L+ NSCLC",
    title:       "Signal-seeking in SCLC post-platinum relapse",
    rationale:   "Evaluates the potential of PD-L1 × VEGF bispecific in a tumor type with high unmet need and limited second-line options beyond topotecan.",
    priority:    "High"       as const,
    urgency:     "Urgent"     as const,
    impact:      "High"       as const,
    timeHorizon: "Short-term" as const,
  },
  {
    id:          "gap-p08",
    egoId:       "ego-2",
    ego:         "Generate signal-seeking data in tumors beyond the CDP",
    segment:     "Cervical Cancer",
    title:       "Signal-seeking in cervical cancer: PD-L1 × VEGF bispecific as 2L therapy",
    rationale:   "Addresses the lack of differentiated options beyond bevacizumab + pembrolizumab, where dual VEGF and PD-L1 blockade may offer additive benefit.",
    priority:    "Medium"     as const,
    urgency:     "N/A"        as const,
    impact:      "High"       as const,
    timeHorizon: "Long-term"  as const,
  },
  {
    id:          "gap-p09",
    egoId:       "ego-3",
    ego:         "Explore novel combinations",
    segment:     "1L mNSCLC",
    title:       "Combination with ADC (TROP2-targeted) in IO-refractory NSCLC",
    rationale:   "Explores synergy between VEGF modulation and TROP2-directed payload delivery in tumors with diminished IO responsiveness.",
    priority:    "Medium"     as const,
    urgency:     "Urgent"     as const,
    impact:      "High"       as const,
    timeHorizon: "Short-term" as const,
  },
  {
    id:          "gap-p10",
    egoId:       "ego-4",
    ego:         "Further the understanding of Pumitamig through translational analysis",
    segment:     "Pan-tumor",
    title:       "Biomarker discovery: TME characterisation pre- and post-treatment",
    rationale:   "Translational data from biopsies will inform which patient subgroups derive maximal benefit and guide Phase 3 enrichment strategies.",
    priority:    "High"       as const,
    urgency:     "N/A"        as const,
    impact:      "High"       as const,
    timeHorizon: "Long-term"  as const,
  },
  {
    id:          "gap-p11",
    egoId:       "ego-5",
    ego:         "Generate HEOR, PRO, and RWE data",
    segment:     "1L mNSCLC",
    title:       "Real-world effectiveness vs. standard-of-care IO regimens",
    rationale:   "Registry-based RWE will support payer submissions and reinforce label claims in populations excluded from pivotal trials.",
    priority:    "Medium"     as const,
    urgency:     "N/A"        as const,
    impact:      "Low-Medium" as const,
    timeHorizon: "Long-term"  as const,
  },
]

// ── Matrix view gaps ───────────────────────────────────────────────────────────
const matrixGaps = [
  // EGO 1 — TOP PRIORITY (High / Short-term)
  { id: "gap-m01", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "Special Populations: Brain Mets",                         rationale: "", priority: "High"   as const, urgency: "Urgent" as const, impact: "High"       as const, timeHorizon: "Short-term" as const },
  { id: "gap-m02", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "Special Populations: Poor performance status",            rationale: "", priority: "High"   as const, urgency: "Urgent" as const, impact: "High"       as const, timeHorizon: "Short-term" as const },
  { id: "gap-m03", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "Special Populations: Post IO neoadj/periop progression",  rationale: "", priority: "High"   as const, urgency: "Urgent" as const, impact: "High"       as const, timeHorizon: "Short-term" as const },
  // EGO 1 — LONG TERM PLAYS (High / Long-term)
  { id: "gap-m04", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "Biomarker populations PD-L1-low/(-), STK11/KEAP1-mutant; RAS", rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  { id: "gap-m05", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "Adjuvant NSCLC", title: "Optional treatment for pCR vs non-pCRs; MRD/ctDNA",       rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  { id: "gap-m06", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "NeoAdj/NSCLC",  title: "Neoadjuvant/perioperative",                                rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  // EGO 1 — URGENT BUT LESS RELEVANT (Low-Medium / Short-term)
  { id: "gap-m07", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "NSCLC",          title: "Unresectable stage 1-2 combo with SABR",                   rationale: "", priority: "Low"    as const, urgency: "N/A"    as const, impact: "Low-Medium" as const, timeHorizon: "Short-term" as const },
  { id: "gap-m08", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "1L mNSCLC: Special Populations: Elderly",                  rationale: "", priority: "Low"    as const, urgency: "Urgent" as const, impact: "Low-Medium" as const, timeHorizon: "Short-term" as const },
  { id: "gap-m09", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "NSCLC",          title: "Neoadjuvant/perioperative: Safety post SABR",               rationale: "", priority: "Low"    as const, urgency: "N/A"    as const, impact: "Low-Medium" as const, timeHorizon: "Short-term" as const },
  // EGO 1 — LOWER PRIORITY (Low-Medium / Long-term)
  { id: "gap-m10", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "Special Populations: Oligomets",                           rationale: "", priority: "Low"    as const, urgency: "N/A"    as const, impact: "Low-Medium" as const, timeHorizon: "Long-term"  as const },
  { id: "gap-m11", egoId: "ego-1", ego: "Generate data in core CDP tumors (earlier settings)", segment: "1L mNSCLC",      title: "2L NSCLC: IO naive post TKI",                              rationale: "", priority: "Low"    as const, urgency: "N/A"    as const, impact: "Low-Medium" as const, timeHorizon: "Long-term"  as const },

  // EGO 2 — TOP PRIORITY
  { id: "gap-m12", egoId: "ego-2", ego: "Generate signal-seeking data in tumors beyond the CDP", segment: "2L+ NSCLC",       title: "Signal-seeking in SCLC post-platinum relapse",           rationale: "", priority: "High"   as const, urgency: "Urgent" as const, impact: "High"       as const, timeHorizon: "Short-term" as const },
  // EGO 2 — LONG TERM PLAYS
  { id: "gap-m13", egoId: "ego-2", ego: "Generate signal-seeking data in tumors beyond the CDP", segment: "Cervical Cancer", title: "2L cervical cancer: PD-L1 × VEGF bispecific",            rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  { id: "gap-m14", egoId: "ego-2", ego: "Generate signal-seeking data in tumors beyond the CDP", segment: "HCC",             title: "Hepatocellular carcinoma: 2L signal-seeking",            rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  // EGO 2 — URGENT BUT LESS RELEVANT
  { id: "gap-m15", egoId: "ego-2", ego: "Generate signal-seeking data in tumors beyond the CDP", segment: "Gastric",         title: "Gastric/GEJ: Signal-seeking in PD-L1 high subgroup",     rationale: "", priority: "Low"    as const, urgency: "Urgent" as const, impact: "Low-Medium" as const, timeHorizon: "Short-term" as const },

  // EGO 3 — TOP PRIORITY
  { id: "gap-m16", egoId: "ego-3", ego: "Explore novel combinations", segment: "1L mNSCLC",  title: "ADC (TROP2) + PD-L1 × VEGF in IO-refractory NSCLC",       rationale: "", priority: "High"   as const, urgency: "Urgent" as const, impact: "High"       as const, timeHorizon: "Short-term" as const },
  { id: "gap-m17", egoId: "ego-3", ego: "Explore novel combinations", segment: "1L mNSCLC",  title: "PARP inhibitor combo in HRD+ NSCLC subgroup",              rationale: "", priority: "Medium" as const, urgency: "N/A"    as const, impact: "High"       as const, timeHorizon: "Long-term"  as const },
  // EGO 3 — LOWER PRIORITY
  { id: "gap-m18", egoId: "ego-3", ego: "Explore novel combinations", segment: "Pan-tumor",  title: "Tri-specific antibody platform: early signal",             rationale: "", priority: "Low"    as const, urgency: "N/A"    as const, impact: "Low-Medium" as const, timeHorizon: "Long-term"  as const },

  // EGO 4 — LONG TERM PLAYS
  { id: "gap-m19", egoId: "ego-4", ego: "Further the understanding of Pumitamig through translational analysis", segment: "Pan-tumor", title: "TME characterisation pre- and post-treatment", rationale: "", priority: "High" as const, urgency: "N/A" as const, impact: "High" as const, timeHorizon: "Long-term" as const },
  { id: "gap-m20", egoId: "ego-4", ego: "Further the understanding of Pumitamig through translational analysis", segment: "NSCLC",     title: "Resistance mechanism profiling post-progression", rationale: "", priority: "Medium" as const, urgency: "N/A" as const, impact: "High" as const, timeHorizon: "Long-term" as const },

  // EGO 5 — LOWER PRIORITY
  { id: "gap-m21", egoId: "ego-5", ego: "Generate HEOR, PRO, and RWE data", segment: "1L mNSCLC", title: "Real-world effectiveness vs. standard-of-care IO regimens", rationale: "", priority: "Medium" as const, urgency: "N/A" as const, impact: "Low-Medium" as const, timeHorizon: "Long-term" as const },
  { id: "gap-m22", egoId: "ego-5", ego: "Generate HEOR, PRO, and RWE data", segment: "Pan-tumor", title: "Patient-reported outcomes: fatigue and QoL instruments",   rationale: "", priority: "Low"    as const, urgency: "N/A" as const, impact: "Low-Medium" as const, timeHorizon: "Short-term" as const },
]

export const mockEvidenceGapPrioritizationData: EvidenceGapPrioritizationData = {

  egos: [
    { id: "ego-1", label: "EGO 1", title: "Generate data in core CDP tumors (earlier settings)"                      },
    { id: "ego-2", label: "EGO 2", title: "Generate signal-seeking data in tumors beyond the CDP"                    },
    { id: "ego-3", label: "EGO 3", title: "Explore novel combinations"                                               },
    { id: "ego-4", label: "EGO 4", title: "Further the understanding of Pumitamig through translational analysis"    },
    { id: "ego-5", label: "EGO 5", title: "Generate HEOR, PRO, and RWE data"                                        },
  ],

  list: {
    view:    "list",
    columns: [
      { key: "ego",       label: "EGO"          },
      { key: "segment",   label: "Segment"       },
      { key: "title",     label: "Evidence Gap"  },
      { key: "rationale", label: "Gap Rationale" },
      { key: "priority",  label: "Priority"      },
      { key: "urgency",   label: "Urgency"       },
    ],
    gaps: listGaps,
  },

  matrix: {
    view: "matrix",
    quadrants: [
      { id: "top-priority",         label: "TOP PRIORITY",             impact: "High",       timeHorizon: "Short-term", badgeColor: "var(--color-success-dark)", bgColor: "var(--color-quadrant-top-priority-bg)" },
      { id: "long-term-plays",      label: "LONG TERM PLAYS",          impact: "High",       timeHorizon: "Long-term",  badgeColor: "var(--color-warning-dark)", bgColor: "var(--color-quadrant-long-term-bg)"    },
      { id: "urgent-less-relevant", label: "URGENT BUT LESS RELEVANT", impact: "Low-Medium", timeHorizon: "Short-term", badgeColor: "var(--color-secondary)",    bgColor: "var(--color-quadrant-urgent-bg)"       },
      { id: "lower-priority",       label: "LOWER PRIORITY",           impact: "Low-Medium", timeHorizon: "Long-term",  badgeColor: "var(--color-error-dark)",   bgColor: "var(--color-quadrant-lower-bg)"        },
    ],
    gaps: matrixGaps,
  },
}
