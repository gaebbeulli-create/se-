import { supabase } from '@/lib/supabase'

const BUCKET = 'attachments'

/**
 * 파일 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} folder - 폴더 경로 (예: 'messages', 'vehicles', 'profiles', 'meetings')
 * @returns {Promise<{url: string, path: string, name: string, size: number, type: string}>}
 */
export async function uploadFile(file, folder = 'general') {
  const ext = file.name.split('.').pop()
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, '_')
  const path = `${folder}/${timestamp}_${safeName}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path,
    name: file.name,
    size: file.size,
    type: ext.toLowerCase(),
  }
}

/**
 * 여러 파일 업로드
 */
export async function uploadFiles(files, folder = 'general') {
  const results = []
  for (const file of files) {
    const result = await uploadFile(file, folder)
    results.push(result)
  }
  return results
}

/**
 * 파일 삭제
 */
export async function deleteFile(path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path])
  if (error) throw error
}

/**
 * 이미지 파일인지 확인
 */
export function isImage(filename) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
}

/**
 * 파일 사이즈 포맷
 */
export function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}
