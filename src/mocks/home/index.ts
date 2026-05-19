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
    },
    {
      id:                "pumitamig",
      name:              "Pumitamig",
      tags:              ["Oncology", "New Insights"],
      mechanismOfAction: "Bispecific antibody targeting PD-L1 and VEGF-A",
      lastUpdated:       "04/20/26",
      myAsset:           true,
      archived:          false,
    },
    {
      id:                "sample-asset",
      name:              "Sample Asset",
      tags:              ["Oncology"],
      mechanismOfAction: "PD-1 x VEGF bispecific IgG4 antibody",
      lastUpdated:       "04/20/26",
      myAsset:           false,
      archived:          true,
    },
  ],
}
