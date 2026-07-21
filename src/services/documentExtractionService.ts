import type { UploadedFile } from '../types'

export async function processDemoDocument(file: File): Promise<UploadedFile> {
  await new Promise((resolve) => window.setTimeout(resolve, 900))
  const lower = file.name.toLowerCase()
  const category = lower.includes('bank') ? 'Bank statements' : lower.includes('tax') ? 'Tax returns' : lower.includes('licence') || lower.includes('passport') ? 'Identity' : 'Supporting document'
  return {
    id: `file-${Date.now()}`,
    name: file.name,
    category,
    status: 'Ready',
    pages: Math.max(1, Math.min(18, Math.round(file.size / 80_000) || 2)),
    extracted: 'Demo classification complete — no real OCR was performed.',
    confidence: 88,
  }
}
