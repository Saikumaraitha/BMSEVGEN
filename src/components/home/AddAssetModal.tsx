import { useState, useMemo } from "react";
import CloseSmIcon from "../../assets/icons/close-sm.svg?react";
import type {
  AssetsMetadataResponse,
  CreateIepResponseData,
} from "../../types/home";
import { createIep } from "../../services/home";
import Select from "../common/Select";

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
  metadata: AssetsMetadataResponse | null;
  onSuccess: (data: CreateIepResponseData, success: true | false) => void;
}

function AddAssetModal({
  open,
  onClose,
  metadata,
  onSuccess,
}: AddAssetModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedAsset = useMemo(
    () => metadata?.assets.find((a) => a.id === selectedAssetId) ?? null,
    [metadata, selectedAssetId],
  );

  const selectedMoa = useMemo(
    () =>
      metadata?.mechanisms_of_action.find((m) => m.id === selectedAsset?.moaId)
        ?.name ?? "",
    [metadata, selectedAsset],
  );

  const selectedDisease = useMemo(
    () =>
      metadata?.disease_areas.find((d) => d.id === selectedDiseaseId) ?? null,
    [metadata, selectedDiseaseId],
  );

  const selectedTherapeuticArea = useMemo(
    () =>
      metadata?.therapeutic_areas.find(
        (ta) => ta.id === selectedDisease?.theurapetic_area_id,
      )?.name ?? "",
    [metadata, selectedDisease],
  );

  if (!open) return null;

  const handleAssetChange = (id: string) => {
    setSelectedAssetId(id);
    setSelectedDiseaseId("");
    setError("");
  };

  const handleClose = () => {
    setSelectedAssetId("");
    setSelectedDiseaseId("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      setError("Please select an asset.");
      return;
    }
    if (!selectedDiseaseId) {
      setError("Please select an indication.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await createIep({
        asset_id: selectedAssetId,
        disease_area_id: selectedDiseaseId,
      });
      onSuccess(response.data, true);
      setSelectedAssetId("");
      setSelectedDiseaseId("");
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create IEP. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const readOnlyClass =
    "w-full bg-neutral-100 rounded-sm px-3 py-2.5 text-sm text-neutral-500 border-0 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1" />
          <h2 className="font-heading font-bold text-xl text-neutral-900 text-center flex-1 text-nowrap">
            Create Asset Indication Plan
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <CloseSmIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Row 1: Asset | MoA */}
          <div className="grid grid-cols-2 gap-4">
            {/* Asset */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Asset <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedAssetId}
                onChange={handleAssetChange}
                placeholder="Select"
                disabled={submitting}
                options={(metadata?.assets ?? []).map((a) => ({
                  value: a.id,
                  label: a.name,
                }))}
              />
            </div>

            {/* MoA (auto-filled from selected asset) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                MoA <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={selectedMoa}
                className={readOnlyClass}
              />
            </div>
          </div>

          {/* Row 2: Indication | Therapeutic Area */}
          <div className="grid grid-cols-2 gap-4">
            {/* Indication */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Indication <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedDiseaseId}
                onChange={(v) => {
                  setSelectedDiseaseId(v);
                  setError("");
                }}
                placeholder="Select"
                disabled={!selectedAssetId || submitting}
                options={(metadata?.disease_areas ?? []).map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
            </div>

            {/* Therapeutic Area (auto-filled from selected indication) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Therapeutic Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={selectedTherapeuticArea}
                className={readOnlyClass}
              />
            </div>
          </div>

          {/* Validation / API error */}
          {error && (
            <p className="text-xs text-red-500 text-center -mt-2">{error}</p>
          )}

          {/* Note text */}
          <p className="text-xs text-center text-neutral-500 leading-relaxed">
            <span className="font-semibold text-brand-primary-deep">
              Please note:
            </span>{" "}
            Asset Indication specific context generation may take up to
            &lt;X&gt; days.
            <br />
            You will receive an email notification once the data is available
            for review.
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-8 py-2.5 rounded-[5px] font-heading border-2 border-[#D70000] text-cancel text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 rounded-md font-heading asset-create-btn text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;
