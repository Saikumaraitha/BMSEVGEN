import type { EvidenceGapSummaryData } from "../../types/evidence-gap-summary"

export const mockEvidenceGapSummaryData: EvidenceGapSummaryData = {
  strategicImperatives: [
    {
      id:    "si-1",
      label: "SI 1",
      title: "Advance the science in progressive fibrotic lung diseases, including IPF & PPF",
    },
    {
      id:    "si-2",
      label: "SI 2",
      title: "Educate the community on the drug pathway & Ph2 results",
    },
    {
      id:    "si-3",
      label: "SI 3",
      title: "Engage with the external experts & form strong partnerships",
    },
  ],

  egos: [
    {
      id:    "ego-1",
      label: "EGO 1",
      title: "Increase IPF & PPF awareness",
      bullets: [
        "Establish parity in disease burden between IPF & PPF to address HCP perception of differing severities & generate treatment inertia",
        "Highlight the need for timely diagnosis & early treatment initiation in IPF & PPF",
        "Drive awareness into real-world treatment patterns & limitations associated with current Tx options",
      ],
    },
    {
      id:          "ego-2",
      label:       "EGO 2",
      title:       "Differentiate LP41 MoA",
      highlighted: true,
      bullets: [
        "Differentiate & story build vs. ever-evolving competitive landscape within IPF & PPF",
        "Establish antifibrotic halo within non-pulmonary fibrotic diseases (e.g., scleroderma, CRS)",
        "Identify prognostic, circulating & imaging biomarkers implicated within LP41 pathway",
      ],
    },
    {
      id:    "ego-3",
      label: "EGO 3",
      title: "Demonstrate long-term efficacy",
      bullets: [
        "Demonstrate meaningful disease-modification of long-term outcomes; quality of life, functional measures, & survival",
        "Generate evidence in special populations excluded in Ph2",
      ],
    },
    {
      id:    "ego-4",
      label: "EGO 4",
      title: "Establish safety & tolerability",
      bullets: [
        "Demonstrate favorable safety & tolerability profile, including AEs, adherence, & reinitiation schemes",
        "Generate evidence in special populations excluded in Phase 3",
      ],
    },
    {
      id:    "ego-5",
      label: "EGO 5",
      title: "Drive early value",
      bullets: [
        "Develop a strong value proposition for payers to show differentiated benefit, incl. cost-effectiveness & factors influencing Tx preference",
        "Establish positioning in Tx paradigm including monotherapy, combination therapy, & switches",
      ],
    },
  ],

  keyDataMaps: [
    {
      id:           "kdm-1",
      indication:   "1L mNSCLC",
      type:         "Existing Gap",
      gap:          "Special Populations: Brain mets",
      rationale:    "Addresses a persistent evidence opportunity in a high-risk population under-represented in trials, where VEGF modulation may offer intracranial benefit beyond PD-L1/-based SOC",
      priority:     "High",
      tags:         ["Brain Mets", "VEGF"],
      linkedEgoIds: ["ego-2", "ego-3"],
      detailedRationale: {
        gapId:        "kdm-1",
        gapStatement: "Special Populations: Brain mets",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                text: "Ivonescimab (AK112/SMT112), a PD-1 + VEGF-A bispecific from Akeso Biopharma/Summit, has reported intracranial activity data in NSCLC patients with brain metastases, highlighting the potential for VEGF modulation to enhance CNS penetration and control alongside PD-L1 blockade.",
                studyLinks: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC12170321/"],
              },
              {
                text: "Atezolizumab (Genentech/Roche) + bevacizumab combination therapy demonstrated activity in patients with brain metastases across multiple tumor types, establishing a benchmark for IO + anti-VEGF regimens in CNS-involved disease and indicating class-level intracranial activity.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
              {
                text: "Despite growing interest, most PD-L1 × VEGF programs—including emerging bispecifics—have excluded or underenrolled brain met patients in pivotal trials, leaving a defined evidence gap that pumilimag could address with a prospective brain met cohort or dedicated sub-study.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "Brain metastases occur in 25–40% of NSCLC patients and are associated with significantly worsened prognosis. Current SoC relies on radiation (SRS/WBRT) combined with systemic IO-based regimens, but durable intracranial control remains an unmet need.",
                studyLinks: [],
              },
              {
                text: "VEGF pathway inhibition is hypothesized to reduce blood-brain barrier permeability and limit metastatic seeding, offering a mechanistic rationale for PD-L1 + VEGF bispecifics in this population beyond what PD-L1 monotherapy provides.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "Prospective inclusion of brain met patients as a stratification factor or dedicated expansion cohort in Phase 3 could differentiate pumilimag from competitors with weaker CNS evidence packages.",
                studyLinks: [],
              },
              {
                text: "Collaboration with radiation oncology and neuro-oncology centers for combined modality data (SRS + pumilimag) would address a high-value evidence gap and strengthen market access arguments in a difficult-to-treat subpopulation.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
    {
      id:           "kdm-2",
      indication:   "1L mNSCLC",
      type:         "Existing Gap",
      gap:          "≥50% TPS, Practice informing data beyond populations in CDP trial",
      rationale:    "Clarifies benefit in a population with multiple effective SOC options. Informs differentiation versus PD-1 monotherapy and emerging combination strategies.",
      priority:     "Medium",
      tags:         ["Brain Mets", "VEGF"],
      linkedEgoIds: ["ego-2"],
      detailedRationale: {
        gapId:        "kdm-2",
        gapStatement: "≥50% TPS, Practice informing data beyond populations in CDP trial",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                text: "Pembrolizumab monotherapy remains SoC in PD-L1 TPS ≥50% NSCLC (KEYNOTE-024), with 5-year OS data establishing a high benchmark. Any new agent must demonstrate meaningful clinical benefit over or alongside pembrolizumab in this well-served segment.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
              {
                text: "Combination chemo-IO regimens (pembrolizumab + carboplatin/pemetrexed; atezolizumab + bevacizumab + chemotherapy) have expanded into high TPS populations, blurring the advantage of monotherapy and raising the evidence bar for differentiation in this segment.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "PD-L1 TPS ≥50% represents approximately 30% of metastatic NSCLC patients and is characterized by high IO responsiveness. However, response durability and resistance mechanisms remain variable, leaving room for biomarker-refined selection strategies.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "Generating pumilimag data in TPS ≥50% populations through real-world evidence studies or biomarker sub-analyses of Phase 3 cohorts would help position the drug in the high-expressors segment and inform treatment sequencing guidelines.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
    {
      id:           "kdm-3",
      indication:   "1L mNSCLC",
      type:         "Existing Gap",
      gap:          "Special Populations: Liver mets",
      rationale:    "Addresses a situation in an immunologically hostile setting with poor IO outcomes, supporting differentiation driven by vascular and immune microenvironment modulation",
      priority:     "Special Population",
      tags:         ["VEGF"],
      linkedEgoIds: ["ego-2", "ego-4"],
      detailedRationale: {
        gapId:        "kdm-3",
        gapStatement: "Special Populations: Liver mets",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                text: "Patients with liver metastases represent a well-documented poor IO responder subgroup. Retrospective analyses of KEYNOTE-189 and IMpower150 showed diminished PFS/OS benefit in patients with hepatic involvement, highlighting a persistent unmet need.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
              {
                text: "IMpower150 (atezolizumab + bevacizumab + chemotherapy) demonstrated preserved benefit even in liver met patients, providing a proof-of-concept for VEGF inhibition overcoming IO resistance in this immunosuppressive microenvironment.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "Liver metastases create a highly immunosuppressive tumor microenvironment characterized by Treg accumulation and PD-L1 upregulation on hepatic sinusoidal endothelium. VEGF-driven immune exclusion compounds poor T-cell infiltration in this setting.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "Prospective stratification by liver metastasis status in Phase 3, combined with translational correlatives, would allow pumilimag to generate class-differentiating data and support a focused label claim or post-marketing commitment in liver-met patients.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
    {
      id:           "kdm-4",
      indication:   "1L mNSCLC",
      type:         "AI-Driven",
      gap:          "Lack of a validated biomarker framework to select patients for PD-L1 × VEGF bispecific therapy beyond PD-L1 TPS",
      rationale:    "Addresses a key evidence gap in biomarker-driven selection for PD-L1 + VEGF bispecifics in NSCLC, where activity beyond PD-L1 underscores the need for validated models to optimize differentiation and Phase 3 success.",
      priority:     "Medium",
      tags:         ["VEGF"],
      linkedEgoIds: ["ego-2"],
      detailedRationale: {
        gapId:        "kdm-4",
        gapStatement: "Lack of a validated biomarker framework to select patients for PD-L1 × VEGF bispecific therapy beyond PD-L1 TPS",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                title: "Ivonescimab",
                text: "(AK112/SMT112), a PD-1 + VEGF-A bispecific from Akeso Biopharma/Summit, is being advanced in EGFR-mutated NSCLC post-EGFR-TKI. Chinese Phase III HARMONIA generated clinical and pharmacoeconomic analyses, indicating active development in the same post-TKI population and signaling head-to-head competitive pressure for any PD-L1 × VEGF entrant (e.g., pumilimag) in this niche.",
                studyLinks: [
                  "https://pmc.ncbi.nlm.nih.gov/PMC12170321/",
                  "https://pmc.ncbi.nlm.nih.gov/articles/10430740/",
                ],
              },
              {
                title: "Atezolizumab",
                text: "(Genentech/Roche) + bevacizumab (PD-L1 inhibitor + anti-VEGF) with chemotherapy (MPower158) established immune-angiogenic combination activity in first-line non-squamous NSCLC, including patients with EGFR alterations after TKI, demonstrating class validation of PD-L1 plus VEGF blockade but not resolving post-TKI sequencing or bispecific versus combination superiority.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
              {
                text: "Other dual immune-angiogenic entrants signal increasing saturation: PMB002 (PD-L1 × VEGF-A bispecific) has reported early solid-tumor signals at SITC/ASCO, while reviews of novel-novel combinations highlight that many programs proceed in biomarker-unselected populations with limited preclinical rationale, sponsoring company for PMB002 is not specified in the provided literature, but the breadth of IO+VEGF trials indicates active competitive probing of similar gaps.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "PD-L1 TPS remains the primary biomarker for IO selection in NSCLC, but its predictive value for PD-L1 × VEGF bispecifics is unclear—VEGF levels, angiogenic gene signatures, and TMB may independently or jointly predict benefit from dual blockade.",
                studyLinks: [],
              },
              {
                text: "Composite biomarker models integrating PD-L1, VEGF expression, tumor microenvironment metrics, and genomic features are being explored preclinically but lack clinical validation in bispecific-treated populations, representing a critical evidence gap.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "Embedding a prospective biomarker sub-study within Phase 3 to evaluate VEGF pathway markers, angiogenic signatures, and spatial transcriptomics alongside PD-L1 TPS would generate a unique biomarker dataset differentiating pumilimag from competitors proceeding biomarker-agnostic.",
                studyLinks: [],
              },
              {
                text: "Partnership with diagnostic companies (Foundation Medicine, Roche Diagnostics) to develop a companion diagnostic or enrichment strategy could accelerate label claims and payer access in biomarker-defined subpopulations.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
    {
      id:           "kdm-5",
      indication:   "Post-EGFR TKI mNSCLC",
      type:         "AI-Driven",
      gap:          "Post-EGFR TKI mNSCLC (EGFR-mutated): Role of a PD-L1 + VEGF bispecific (RNT327/pumilimag) after EGFR-TKI resistance versus current standards, and versus PD-L1 + VEGF competitor Ivonescimab",
      rationale:    "Addresses a critical evidence gap in defining the optimal post-EGFR TKI regimen, where ivonescimab's success and chemo + PD-L1 + anti-VEGF signals lack head-to-head or biomarker comparisons for PD-L1 + VEGF bispecifics, leaving efficacy durability and safety uncertainties unresolved.",
      priority:     "High",
      tags:         ["VEGF"],
      linkedEgoIds: ["ego-2", "ego-3"],
      detailedRationale: {
        gapId:        "kdm-5",
        gapStatement: "Post-EGFR TKI mNSCLC (EGFR-mutated): Role of a PD-L1 + VEGF bispecific (RNT327/pumilimag) after EGFR-TKI resistance versus current standards, and versus PD-L1 + VEGF competitor Ivonescimab",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                text: "Ivonescimab has emerged as the leading PD-L1 × VEGF bispecific in EGFR-mutated NSCLC post-TKI. HARMONIA Phase III data demonstrated superiority over pembrolizumab, creating a high efficacy bar and a head-to-head evidence gap for pumilimag in this specific niche.",
                studyLinks: ["https://pmc.ncbi.nlm.nih.gov/articles/10430740/"],
              },
              {
                text: "Chemo + PD-L1 + bevacizumab (IMpower150 regimen) is widely used in post-EGFR-TKI settings outside label, providing a real-world combination benchmark against which any bispecific monotherapy must justify its benefit-risk profile.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "Post-EGFR TKI resistance is heterogeneous (T790M, C797S, MET amplification, histological transformation), and IO benefit is limited in EGFR-mutated NSCLC. VEGF axis activation post-TKI may partially restore immune susceptibility, providing mechanistic rationale for bispecific use.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "A dedicated post-EGFR-TKI cohort or Phase 2 signal-finding study for pumilimag, with biomarker stratification by resistance mechanism, would generate first evidence to position the drug alongside or versus ivonescimab in label or real-world use.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
    {
      id:           "kdm-6",
      indication:   "2L mNSCLC",
      type:         "AI-Driven",
      gap:          "2L+ mNSCLC after anti-PD-L1 + platinum: Activity of pumilimag in patients progressing after first-line chemo-immunotherapy; cross-resistance and benefit predictors unknown",
      rationale:    "Addresses a major evidence gap in the post-IO setting, where poor real-world outcomes highlight unmet need and, despite mechanistic rationale for VEGF-mediated immune re-sensitization",
      priority:     "High",
      tags:         ["2L"],
      linkedEgoIds: ["ego-2", "ego-3"],
      detailedRationale: {
        gapId:        "kdm-6",
        gapStatement: "2L+ mNSCLC after anti-PD-L1 + platinum: Activity of pumilimag in patients progressing after first-line chemo-immunotherapy; cross-resistance and benefit predictors unknown",
        tabs: [
          {
            id:    "competitive",
            label: "Competitive Landscape",
            items: [
              {
                text: "The post-chemo-IO NSCLC setting lacks an established SoC beyond docetaxel ± ramucirumab or nintedanib. No IO retreatment strategy has demonstrated robust Phase 3 efficacy, creating a wide-open competitive space for agents with a differentiated mechanism like VEGF-mediated immune re-sensitization.",
                studyLinks: [],
              },
              {
                text: "Ramucirumab + docetaxel (REVEL trial) established anti-VEGFR2 activity post-platinum, indirectly validating the VEGF pathway as therapeutically actionable in 2L NSCLC and providing a competitive reference point for VEGF-targeting bispecifics.",
                studyLinks: ["https://pubmed.ncbi.nlm.nih.gov/29862955/"],
              },
            ],
          },
          {
            id:    "disease",
            label: "Disease & Treatment Landscape",
            items: [
              {
                text: "Patients progressing after first-line chemo-IO have an immunologically exhausted tumor microenvironment with upregulated co-inhibitory pathways. Cross-resistance to PD-1/PD-L1 re-challenge is common, but VEGF-mediated immune exclusion may be partially reversible with combined VEGF + PD-L1 blockade.",
                studyLinks: [],
              },
              {
                text: "Biomarkers predictive of benefit in the post-IO setting—including VEGF expression, angiogenic gene signatures, and residual T-cell infiltration—are poorly characterized, representing a foundational translational gap that must be addressed alongside clinical development.",
                studyLinks: [],
              },
            ],
          },
          {
            id:    "cdp",
            label: "CDP Complement",
            items: [
              {
                text: "A Phase 2 signal-seeking study of pumilimag in 2L+ post-chemo-IO NSCLC, with mandatory archival and fresh biopsy for translational endpoints, would generate hypothesis-generating data to define the biomarker-enriched subgroup most likely to benefit from VEGF-mediated immune re-sensitization.",
                studyLinks: [],
              },
            ],
          },
        ],
      },
    },
  ],
}
