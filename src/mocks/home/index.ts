import type { HomeData } from "../../types/home"

export const mockHomeData: HomeData = {
  assets: [
    {
      id:                "BMS-001",
      name:              "Deucravacitinib (Sotyktu)",
      tags:              ["Immunology", "Psoriasis", "TYK2"],
      mechanismOfAction: "Allosteric TYK2 inhibitor (pseudokinase domain)",
      lastUpdated:       "04/20/26",
      myAsset:           true,
      archived:          false,
      indications: [
        { id: "BMS-001-pso", name: "Psoriasis",   tags: ["Immunology", "Active Draft"],              lastUpdated: "01/25/26" },
        { id: "BMS-001-psa", name: "PsA",         tags: ["Immunology", "New Insights", "In Refresh"], lastUpdated: "01/25/26" },
      ],
    },
    {
      id:                "pumitamig",
      name:              "Pumitamig",
      tags:              ["Oncology", "New Insights"],
      mechanismOfAction: "Bispecific antibody targeting PD-L1 and VEGF-A",
      lastUpdated:       "01/25/26",
      myAsset:           true,
      archived:          false,
      indications: [
        { id: "pumitamig-rcc",   name: "RCC",   tags: ["Oncology", "New Insights", "In Refresh"], lastUpdated: "01/25/26" },
        { id: "pumitamig-tnbc",  name: "TNBC",  tags: ["Oncology", "Active Draft"],               lastUpdated: "01/25/26" },
        { id: "pumitamig-nsclc", name: "NSCLC", tags: ["Oncology", "New Insights", "Active Draft"], lastUpdated: "01/25/26" },
      ],
    },
    {
      id:                "nivolumab",
      name:              "Nivolumab",
      tags:              ["Oncology"],
      mechanismOfAction: "Bispecific antibody targeting PD-L1 and VEGF-A",
      lastUpdated:       "01/25/26",
      myAsset:           true,
      archived:          false,
      indications: [
        { id: "nivolumab-rcc",   name: "RCC",   tags: ["Oncology", "New Insights", "In Refresh"], lastUpdated: "01/25/26" },
        { id: "nivolumab-nsclc", name: "NSCLC", tags: ["Oncology", "In Refresh"],                 lastUpdated: "01/25/26" },
      ],
    },
    {
      id:                "sample-asset",
      name:              "Sample Asset",
      tags:              ["Oncology"],
      mechanismOfAction: "PD-1 x VEGF bispecific IgG4 antibody",
      lastUpdated:       "04/20/26",
      myAsset:           false,
      archived:          true,
      indications: [],
    },
  ],
}
