import type { GapDetailsData } from "../../types/evidence-gap-summary/gap-details"

// Detailed view for Gap 01: Lack of Long-Term Durability Data
export const mockGapDetailsData: GapDetailsData = {
  gapId:       "gap-01",
  title:       "Lack of Long-Term (>=3-Year) Durability Data",
  category:    "Long-Term Efficacy",
  priority:    "Critical",
  confidence:  "High",
  description: "No published peer-reviewed data exists beyond 2 years for deucravacitinib in plaque psoriasis. IL-23 inhibitor competitors (risankizumab, guselkumab) have published 3-5-year open-label extension data showing sustained PASI 75-100 rates. This gap affects guideline positioning, payer willingness to grant preferred tier status, and dermatologist prescribing confidence for patients expected to be on therapy long-term.",
  rationale:   "Long-term durability is a key purchasing criterion for payers and formulary committees. ICER 2023 review cited moderate uncertainty in deucravacitinib cost-effectiveness models precisely due to the absence of >=3-year data. AAD-NPF guidelines explicitly favor agents with robust long-term data. Closing this gap is the single highest-impact evidence generation opportunity for deucravacitinib.",
  impactScore: 92,
  feasibility: "High",

  relatedStudies: [
    {
      id:               "st-01",
      name:             "POETYK PSO-OLE (Open-Label Extension)",
      design:           "Open-label extension of POETYK PSO-1 and PSO-2",
      phase:            "Phase 3 OLE",
      n:                1519,
      status:           "Ongoing",
      primaryEndpoint:  "PASI 75 maintenance at Year 3 (Week 148)",
      result:           "Year 2 data: 74.0% PASI 75 in continuous deucravacitinib arm",
      grade:            "Grade B",
    },
    {
      id:               "st-02",
      name:             "POETYK PSO-1 (Pivotal)",
      design:           "Phase 3, randomized, double-blind, placebo- and apremilast-controlled",
      phase:            "Phase 3",
      n:                666,
      status:           "Completed",
      primaryEndpoint:  "PASI 75 and IGA 0/1 at Week 16",
      result:           "PASI 75: 58.4% vs 35.1% vs 12.7%; IGA 0/1: 53.6% vs 32.1% vs 7.2%",
      grade:            "Grade A",
    },
    {
      id:               "st-03",
      name:             "POETYK PSO-2 (Pivotal)",
      design:           "Phase 3, randomized, double-blind, placebo- and apremilast-controlled",
      phase:            "Phase 3",
      n:                1020,
      status:           "Completed",
      primaryEndpoint:  "PASI 75 and IGA 0/1 at Week 16",
      result:           "PASI 75: 53.0% vs 40.2% vs 9.4%",
      grade:            "Grade A",
    },
  ],

  recommendations: [
    "Accelerate POETYK PSO-OLE Year 3 data collection and target high-impact journal publication (NEJM/Lancet) for Q4 2026.",
    "Design a dedicated 5-year prospective registry (N>=2000) to generate long-term effectiveness, safety, and persistence data in real-world practice.",
    "Commission meta-analysis of available long-term data to estimate durability curve and support ICER model update.",
    "Partner with academic dermatology centers for independent investigator-sponsored 3-year durability sub-studies using electronic PASI capture.",
  ],

  citations: [
    { id: "c01", title: "POETYK PSO-1",               source: "NEJM 2023",        year: 2023 },
    { id: "c02", title: "POETYK PSO-2",               source: "JAAD 2023",        year: 2023 },
    { id: "c70", title: "Risankizumab 5-year OLE",    source: "JAAD 2025",        year: 2025 },
    { id: "c71", title: "ICER Psoriasis Review 2023", source: "ICER Report 2023", year: 2023 },
    { id: "c72", title: "AAD-NPF Guidelines 2024",    source: "JAAD 2024",        year: 2024 },
  ],
}
