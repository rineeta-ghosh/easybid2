import React, { useRef, useState } from 'react'

export default function FileUploader({ onFile, accept = '*' , initialFile }) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState(initialFile ? initialFile.name || initialFile : '')

  function handleChoose() {
    inputRef.current?.click()
  }

  function onChange(e) {
    const f = e.target.files?.[0]
    if (f) {
      setFileName(f.name)
      onFile && onFile(f)
    }
  }

  return (
    <div className="w-full">
      <input id="file-uploader" ref={inputRef} type="file" accept={accept} onChange={onChange} className="hidden" />
      <div onClick={handleChoose} role="button" tabIndex={0} className="cursor-pointer rounded-lg p-3 bg-white/5 border border-white/5 text-sm text-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600/20 rounded flex items-center justify-center text-amber-400">�</div>
            <div>
              <div className="font-semibold">{fileName || 'Click to upload file'}</div>
              <div className="text-xs text-neutral-400">Accepted: {accept}</div>
            </div>
          </div>
          <div className="text-amber-300">Browse</div>
        </div>
      </div>
    </div>
  )
}
