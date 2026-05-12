import type { ExecutiveSummaryPageData } from '../../types/executive-summary'
import DiseaseTreatmentLandscapeIcon from '../../assets/icons/DiseaseTreatmentLandscape.svg'
import CompetitiveBenchmarkIcon from '../../assets/icons/CompetitiveBenchmark.svg'
import AssetStrategyIcon from '../../assets/icons/AssetStrategy.svg'
import GapIdIcon from '../../assets/icons/GapId.svg'

export const mockExecutiveSummaryData: ExecutiveSummaryPageData = {
  modality: 'PD-L1 × VEGF bispecific antibody',

  sections: [
    {
      id:               'disease-treatment',
      iconSrc:        DiseaseTreatmentLandscapeIcon,
      title:            'Disease Treatment Landscape',
      viewDetailsRoute: '/asset/:assetId/disease-treatment/disease-pathophysiology',
      items: [
        {
          id:    'dt-01',
          body:  'Priority tumor settings for Pumitamig are characterized by high angiogenesis, immuno-suppressive tumor micro-environments, hypoxia, and steroid use, where current PD-1/PD-L1-based standards deliver limited durability.',
          url:   'https://pubmed.ncbi.nlm.nih.gov/31160710/',
          isNew: true,
        },
        {
          id:   'dt-02',
          body: 'In diseases such as GBM and post-IO NSCLC, treatment outcomes plateau due to immune-excluded or myeloid-dominant biology, creating persistent unmet need despite multiple approved options.',
          url:  'https://pubmed.ncbi.nlm.nih.gov/31160710/',
        },
        {
          id:   'dt-03',
          body: 'These landscapes highlight a clear gap in therapies that can address both immune suppression and VEGF-driven disease biology simultaneously.',
        },
      ],
    },
    {
      id:               'competitive-benchmark',
      iconSrc:        CompetitiveBenchmarkIcon,
      title:            'Competitive Benchmark',
      viewDetailsRoute: '/asset/:assetId/competitive-benchmark/competitor-overview',
      items: [
        {
          id:    'cb-01',
          title: 'Established mechanism, competitive space',
          body:  'Pumitamig (PD-L1 × VEGF-A) aligns with the validated IO + anti-angiogenesis approach, competing against PD-1/PD-L1 + bevacizumab combinations and similar bispecifics like ivonescimab (PD-1 × VEGF).',
          url:   'https://pubmed.ncbi.nlm.nih.gov/32971001/',
          isNew: true,
        },
        {
          id:    'cb-02',
          title: 'Bispecific class is expanding',
          body:  'Multiple PD-(L)1 × VEGF bispecifics are in development, with ivonescimab already in late-stage trials, making relative clinical performance an important differentiator.',
          url:   'https://pubmed.ncbi.nlm.nih.gov/40114411/',
        },
        {
          id:    'cb-03',
          title: 'Development strategy includes combinations',
          body:  'Ongoing trials include both monotherapy and combinations (e.g., with TROP2 ADCs like BNT325), indicating a role both as a standalone option and within combination regimens.',
        },
      ],
    },
    {
      id:               'asset-strategy',
      iconSrc:        AssetStrategyIcon,
      title:            'BMS Asset Strategy',
      viewDetailsRoute: '/asset/:assetId/asset-strategy-evidence/tpp',
      items: [
        {
          id:    'as-01',
          body:  "Pumitamig's PD-L1 × VEGF-A bispecific design enables targeted VEGF suppression within PD-L1–rich tumour niches, addressing angiogenesis, oedema, and immune suppression in parallel.",
          isNew: true,
        },
        {
          id:   'as-02',
          body: 'The asset is positioned to maximise impact by selective prioritisation of indications where current options are least effective and biological rationale is strongest.',
          url:  'https://pubmed.ncbi.nlm.nih.gov/28588061/',
        },
        {
          id:   'as-03',
          body: 'Strategic focus is placed on post-standard-of-care and biologically defined populations where differentiation is driven by mechanism-to-biology fit rather than line-of-therapy expansion alone.',
        },
      ],
    },
    {
      id:               'gap-id',
      iconSrc:        GapIdIcon,
      title:            'Gap ID & Prioritization',
      viewDetailsRoute: '/asset/:assetId/gap-identification/evidence-gap-prioritization',
      items: [
        {
          id:    'gi-01',
          body:  'Highest-priority gaps relate to demonstrating benefit in settings where PD-1-based therapies underperform, including post-IO progression, steroid-dependent disease, and immune-excluded tumors.',
          url:   'https://pubmed.ncbi.nlm.nih.gov/33542110/',
          isNew: true,
        },
        {
          id:    'gi-02',
          body:  'Additional gaps exist in biomarker-defined sub-populations that are poorly served by existing standards despite high disease burden.',
          isNew: true,
        },
        {
          id:   'gi-03',
          body: 'Closing these gaps is critical to establishing clear, defensible differentiation for Pumitamig in competitive and crowded treatment landscapes.',
        },
      ],
    },
  ],

  sparcRecommendations: [
    {
      id:   'sr-01',
      text: 'Post-EGFR TKI and post-chemo-IO NSCLC remains a high unmet-need setting, particularly in EGFR-mutant, PD-L1-low/negative, liver-metastatic, and post-IO populations with poor durability on current standards.',
    },
    {
      id:   'sr-02',
      text: 'Competitive benchmarks are dominated by PD-1 × VEGF approaches, but evidence is largely cross-trial and does not clearly establish advantage versus modern chemo-IO regimens in these settings.',
    },
    {
      id:   'sr-03',
      text: 'Pumitamig is well positioned for post-TKI and post-IO NSCLC, targeting immune resistance and angiogenic escape through its PD-L1 × VEGF-A mechanism.',
    },
    {
      id:   'sr-04',
      text: 'Platinum-based chemotherapy combinations are a high-impact strategy, enabling direct comparison to current standards across PD-L1 strata and histologies.',
    },
    {
      id:   'sr-05',
      text: 'The key evidence gap is robust comparative data, clarifying differentiation versus chemo-IO and PD-1 × VEGF competitors and identifying predictors of benefit to support positioning and access.',
    },
  ],
}
