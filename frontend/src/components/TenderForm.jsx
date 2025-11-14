import React, { useState } from 'react'
import InputField from './InputField'
import FileUploader from './FileUploader'
import ConfirmModal from './ConfirmModal'

const TENDER_CATEGORIES = [
  'Road Infrastructure',
  'Electricity & Power', 
  'Education',
  'Crops & Farming',
  'Pharmaceuticals',
  'Healthcare',
  'Construction',
  'IT & Technology',
  'Transportation',
  'Water & Sanitation',
  'Other'
]

export default function TenderForm({ initial = {}, onCancel, onSave, saving = false }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [category, setCategory] = useState(initial.category || '')
  const [customCategory, setCustomCategory] = useState(initial.customCategory || '')
  const [budget, setBudget] = useState(initial.budget || '')
  const [deadline, setDeadline] = useState(initial.deadline ? new Date(initial.deadline).toISOString().slice(0,16) : '')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)

  function validate() {
    const e = {}
    if (!title) e.title = 'Title is required'
    if (!deadline) e.deadline = 'Deadline is required'
    else if (new Date(deadline) <= new Date()) e.deadline = 'Deadline must be in the future'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(mode) {
    if (!validate()) return
    if (mode === 'publish') {
      setShowPublishConfirm(true)
      return
    }
    const payload = { 
      title, 
      description, 
      category, 
      customCategory: category === 'Other' ? customCategory : undefined,
      budget, 
      deadline, 
      file, 
      status: mode === 'publish' ? 'Open' : 'Draft' 
    }
    onSave(payload)
  }

  function confirmPublish() {
    const payload = { 
      title, 
      description, 
      category, 
      customCategory: category === 'Other' ? customCategory : undefined,
      budget, 
      deadline, 
      file, 
      status: 'Open' 
    }
    onSave(payload)
    setShowPublishConfirm(false)
  }

  return (
    <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Title" value={title} onChange={(e) => setTitle(e.target ? e.target.value : e)} error={errors.title} />
        
        <div>
          <label className="block text-sm text-amber-200 mb-1">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-black/20 text-amber-100 border border-white/10 focus:border-orange-400 focus:outline-none"
          >
            <option value="">Select Category</option>
            {TENDER_CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-black text-amber-100">{cat}</option>
            ))}
          </select>
        </div>

        {category === 'Other' && (
          <div className="md:col-span-2">
            <InputField 
              label="Custom Category Description" 
              value={customCategory} 
              onChange={(e) => setCustomCategory(e.target ? e.target.value : e)}
              placeholder="Please describe your tender category"
            />
          </div>
        )}

        <InputField label="Budget" value={budget} onChange={(e) => setBudget(e.target ? e.target.value : e)} type="number" />
        
        <div>
          <label className="block text-sm text-amber-200 mb-1">Deadline</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2 rounded bg-black/20 text-amber-100 border border-white/10 focus:border-orange-400 focus:outline-none" />
          {errors.deadline && <div className="text-sm text-red-300 mt-1">{errors.deadline}</div>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-amber-200 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded bg-black/20 text-amber-100 h-32"></textarea>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-amber-200 mb-2">Attachment</label>
        <FileUploader accept="*" onFile={setFile} initialFile={file} />
      </div>

      <div className="mt-6 flex gap-3">
        <button disabled={saving} onClick={() => handleSubmit('publish')} className="px-4 py-2 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white font-semibold hover:shadow-lg transition-all">{saving ? 'Saving…' : 'Publish'}</button>
        <button disabled={saving} onClick={() => handleSubmit('draft')} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-amber-200 hover:bg-white/20 transition-colors">Save Draft</button>
        <button disabled={saving} onClick={onCancel} className="px-4 py-2 rounded-lg bg-black/30 text-amber-200 hover:bg-black/40 transition-colors">Cancel</button>
      </div>

      <ConfirmModal
        isOpen={showPublishConfirm}
        title="Publish Tender"
        message="Are you sure you want to publish this tender? Once published, suppliers will be able to view and submit bids."
        confirmText="Publish"
        cancelText="Cancel"
        type="success"
        onConfirm={confirmPublish}
        onCancel={() => setShowPublishConfirm(false)}
      />
    </div>
  )
}
