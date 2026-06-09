import { useState, useMemo } from 'react'
import CloseSmIcon from '../../assets/icons/close-sm.svg?react'
import type { AssetsMetadataResponse, CreateIepResponseData } from '../../types/home'
import { createIep } from '../../services/home'

interface AddAssetModalProps {
  open:      boolean
  onClose:   () => void
  metadata:  AssetsMetadataResponse | null
  onSuccess: (data: CreateIepResponseData) => void
}

function AddAssetModal({ open, onClose, metadata, onSuccess }: AddAssetModalProps) {
  const [selectedAssetId,   setSelectedAssetId]   = useState('')
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('')
  const [error,             setError]             = useState('')
  const [submitting,        setSubmitting]         = useState(false)

  const selectedAsset = useMemo(
    () => metadata?.assets.find((a) => a.id === selectedAssetId) ?? null,
    [metadata, selectedAssetId],
  )

  const selectedMoa = useMemo(
    () => metadata?.mechanisms_of_action.find((m) => m.id === selectedAsset?.moaId)?.name ?? '',
    [metadata, selectedAsset],
  )

  const selectedDisease = useMemo(
    () => metadata?.disease_areas.find((d) => d.id === selectedDiseaseId) ?? null,
    [metadata, selectedDiseaseId],
  )

  const selectedTherapeuticArea = useMemo(
    () => metadata?.therapeutic_areas.find((ta) => ta.id === selectedDisease?.theurapetic_area_id)?.name ?? '',
    [metadata, selectedDisease],
  )

  if (!open) return null

  const handleAssetChange = (id: string) => {
    setSelectedAssetId(id)
    setSelectedDiseaseId('')
    setError('')
  }

  const handleClose = () => {
    setSelectedAssetId('')
    setSelectedDiseaseId('')
    setError('')
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssetId)   { setError('Please select an asset.'); return }
    if (!selectedDiseaseId) { setError('Please select an indication.'); return }

    setSubmitting(true)
    setError('')

    try {
      const response = await createIep({ asset_id: selectedAssetId, disease_area_id: selectedDiseaseId })
      onSuccess(response.data)
      setSelectedAssetId('')
      setSelectedDiseaseId('')
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create IEP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectClass =
    'w-full bg-[#F2F6FB] rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 appearance-none cursor-pointer border-0'

  const readOnlyClass =
    'w-full bg-neutral-100 rounded-lg px-3 py-2.5 text-sm text-neutral-500 border-0 focus:outline-none'

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
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Asset</label>
              <div className="relative">
                <select
                  value={selectedAssetId}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className={selectClass}
                  disabled={submitting}
                >
                  <option value="">Select</option>
                  {(metadata?.assets ?? []).map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>
            </div>

            {/* MoA (auto-filled from selected asset) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">MoA</label>
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
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Indication</label>
              <div className="relative">
                <select
                  value={selectedDiseaseId}
                  onChange={(e) => { setSelectedDiseaseId(e.target.value); setError('') }}
                  className={selectClass}
                  disabled={!selectedAssetId || submitting}
                >
                  <option value="">Select</option>
                  {(metadata?.disease_areas ?? []).map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>
            </div>

            {/* Therapeutic Area (auto-filled from selected indication) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Therapeutic Area</label>
              <input
                type="text"
                readOnly
                value={selectedTherapeuticArea}
                className={readOnlyClass}
              />
            </div>
          </div>

          {/* Validation / API error */}
          {error && <p className="text-xs text-red-500 text-center -mt-2">{error}</p>}

          {/* Note text */}
          <p className="text-xs text-center text-neutral-500 leading-relaxed">
            <span className="font-semibold text-brand-primary-deep">Please note:</span>{' '}
            Asset Indication specific context generation may take up to &lt;X&gt; days.
            <br />
            You will receive an email notification once the data is available for review.
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-8 py-2.5 rounded-[5px] font-heading border-2 border-[#D70000] text-cancel text-sm font-bold hover:bg-red-50 transition-colors font-['Roboto'] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 rounded-md font-heading asset-create-btn text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddAssetModal
