import { useState, useMemo } from 'react'
import CloseSmIcon from '../../assets/icons/close-sm.svg?react'
import type { Asset, Indication } from '../../types/home'

interface AddAssetModalProps {
  open:     boolean
  onClose:  () => void
  assets:   Asset[]
  onSubmit: (assetId: string, indication: Indication) => void
}

function AddAssetModal({ open, onClose, assets, onSubmit }: AddAssetModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [indicationName, setIndicationName]   = useState('')
  const [selectedMoa, setSelectedMoa]         = useState('')
  // const [notes, setNotes]                     = useState('')
  const [error, setError]                     = useState('')

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  )

  if (!open) return null

  const handleAssetChange = (id: string) => {
    setSelectedAssetId(id)
    setIndicationName('')
    const asset = assets.find((a) => a.id === id) ?? null
    setSelectedMoa(asset?.mechanismOfAction ?? '')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssetId) { setError('Please select an asset.'); return }
    if (!indicationName)  { setError('Please select an indication.'); return }

    const indication: Indication = {
      id:          `${selectedAssetId}-${indicationName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name:        indicationName,
      tags:        selectedAsset ? [selectedAsset.tags[0] ?? 'Oncology'] : ['Oncology'],
      lastUpdated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
    }

    onSubmit(selectedAssetId, indication)
    setSelectedAssetId('')
    setIndicationName('')
    setSelectedMoa('')
    // setNotes('')
    setError('')
    onClose()
  }

  const selectClass =
    'w-full bg-neutral-100 rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 appearance-none cursor-pointer border-0'

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
              onClick={onClose}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Close"
            >
              <CloseSmIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Row 1: Asset | Therapeutic Area */}
          <div className="grid grid-cols-2 gap-4">
            {/* Asset */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Asset</label>
              <div className="relative">
                <select
                  value={selectedAssetId}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select</option>
                  {assets.filter((a) => !a.archived).map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>
            </div>

            {/* Therapeutic Area (read-only, auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Therapeutic Area</label>
              <input
                type="text"
                readOnly
                value={selectedAsset?.tags[0] ?? ''}
                className={readOnlyClass}
              />
            </div>
          </div>

          {/* Row 2: Indication | MoA */}
          <div className="grid grid-cols-2 gap-4">
            {/* Indication */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Indication</label>
              <div className="relative">
                <select
                  value={indicationName}
                  onChange={(e) => { setIndicationName(e.target.value); setError('') }}
                  className={selectClass}
                  disabled={!selectedAssetId}
                >
                  <option value="">Select</option>
                  {selectedAsset?.indications.map((ind) => (
                    <option key={ind.id} value={ind.name}>{ind.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>
            </div>

            {/* MoA */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">MoA</label>
              <div className="relative">
                <select
                  value={selectedMoa}
                  onChange={(e) => setSelectedMoa(e.target.value)}
                  className={selectClass}
                  disabled={!selectedAssetId}
                >
                  <option value="">Select</option>
                  {selectedAsset && (
                    <option value={selectedAsset.mechanismOfAction}>
                      {selectedAsset.mechanismOfAction}
                    </option>
                  )}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">▾</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {/* Commented for now - need to get clearer idea on functionality. */}
          {/* <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes"
              rows={4}
              className="w-full bg-neutral-100 rounded-lg px-3 py-2.5 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none border-0"
            />
          </div> */}

          {/* Validation error */}
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
              onClick={onClose}
              className="px-8 py-2.5 rounded-md font-heading border border-cancel text-cancel text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 rounded-md font-heading asset-create-btn text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors"
            >
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddAssetModal
