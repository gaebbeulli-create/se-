import { useState, useRef } from 'react'
import { uploadFile, isImage, formatSize } from '@/lib/storage'

/**
 * FileUploader — 파일/이미지 업로드 컴포넌트
 * @param {string} folder - 업로드 폴더 (messages, vehicles, meetings 등)
 * @param {function} onUpload - 업로드 완료 콜백 ({url, path, name, size, type})
 * @param {boolean} multiple - 다중 파일 허용
 * @param {string} accept - 허용 파일 타입 (예: "image/*" 또는 "*")
 */
export default function FileUploader({ folder = 'general', onUpload, multiple = true, accept = '*' }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState([]) // [{name, url, size, type, status}]
  const inputRef = useRef(null)

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)

    const items = Array.from(files).map(f => ({
      file: f, name: f.name, size: f.size,
      type: f.name.split('.').pop().toLowerCase(),
      previewUrl: isImage(f.name) ? URL.createObjectURL(f) : null,
      status: 'uploading',
    }))

    setPreview(prev => [...prev, ...items])

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await uploadFile(items[i].file, folder)
        setPreview(prev => prev.map(p =>
          p.name === items[i].name && p.status === 'uploading'
            ? { ...p, status: 'done', url: result.url, path: result.path }
            : p
        ))
        if (onUpload) onUpload(result)
      } catch (err) {
        console.error('업로드 실패:', err)
        setPreview(prev => prev.map(p =>
          p.name === items[i].name && p.status === 'uploading'
            ? { ...p, status: 'error' }
            : p
        ))
      }
    }
    setUploading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeItem = (idx) => {
    setPreview(prev => prev.filter((_, i) => i !== idx))
  }

  const fileColors = { xlsx: '#217346', pdf: '#DC2626', doc: '#2B579A', jpg: '#0EA5E9', png: '#0EA5E9', jpeg: '#0EA5E9', gif: '#F59E0B', webp: '#8B5CF6' }

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          padding: '20px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
          border: dragging ? '2px dashed #3B82F6' : '2px dashed #D1D5DB',
          background: dragging ? '#EFF6FF' : '#FAFBFC',
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 6 }}>{uploading ? '⏳' : '📎'}</div>
        <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
          {uploading ? '업로드 중...' : '클릭하거나 파일을 끌어다 놓으세요'}
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
          이미지, PDF, 엑셀 등 · 최대 50MB
        </div>
        <input ref={inputRef} type="file" multiple={multiple} accept={accept}
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Preview list */}
      {preview.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {preview.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              background: '#fff', borderRadius: 8, border: '1px solid #ECEDF0',
            }}>
              {/* Thumbnail or icon */}
              {item.previewUrl ? (
                <img src={item.previewUrl} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: fileColors[item.type] || '#6B7280',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                }}>{item.type}</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1E1E1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                  {formatSize(item.size)}
                  {item.status === 'uploading' && ' · 업로드 중...'}
                  {item.status === 'done' && ' · ✅ 완료'}
                  {item.status === 'error' && ' · ❌ 실패'}
                </div>
              </div>

              {/* Status / Remove */}
              {item.status === 'uploading' && (
                <div style={{ width: 16, height: 16, border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              )}
              {item.status !== 'uploading' && (
                <button onClick={() => removeItem(i)} style={{
                  width: 24, height: 24, borderRadius: 6, border: 'none', background: '#F3F4F6',
                  color: '#9CA3AF', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/**
 * ImagePreview — 업로드된 이미지 미리보기 (메시지/차량/회의록 등에서 사용)
 */
export function ImagePreview({ url, name, onClick }) {
  if (!url) return null
  return (
    <div onClick={onClick} style={{
      marginTop: 6, borderRadius: 8, overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
      border: '1px solid #ECEDF0', maxWidth: 280,
    }}>
      <img src={url} alt={name || ''} style={{ width: '100%', display: 'block' }}
        onError={e => { e.target.style.display = 'none' }} />
    </div>
  )
}
