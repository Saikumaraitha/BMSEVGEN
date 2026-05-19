import { useState } from 'react'
import CloseSmIcon from '../../assets/icons/close-sm.svg?react'
import type { Asset } from '../../types/home'

interface AddAssetModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (asset: Asset) => void
}

function AddAssetModal({ open, onClose, onSubmit }: AddAssetModalProps) {
  const [name, setName] = useState('')
  const [moa, setMoa] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Asset name is required.')
      return
    }
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newAsset: Asset = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: name.trim(),
      mechanismOfAction: moa.trim(),
      tags,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
      myAsset: true,
      archived: false,
    }
    onSubmit(newAsset)
    setName('')
    setMoa('')
    setTagsRaw('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-lg text-neutral-900">Add Asset</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close"
          >
            <CloseSmIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Asset Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Pumitamig"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
            {error && <p className="text-xs text-error mt-1">{error}</p>}
          </div>

          {/* Mechanism of Action */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Mechanism of Action</label>
            <textarea
              value={moa}
              onChange={(e) => setMoa(e.target.value)}
              placeholder="e.g. Bispecific antibody targeting PD-L1 and VEGF-A"
              rows={3}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tags <span className="text-neutral-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="e.g. Oncology, New Insights"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors"
            >
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAssetModal
