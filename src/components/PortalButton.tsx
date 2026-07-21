import { ExternalLink } from 'lucide-react'

export function PortalButton({ applicationId, onOpen }: { applicationId?: string; onOpen: () => void }) {
  return <button type="button" data-testid="application-portal-button" className={`portal-button ${applicationId ? 'is-active' : ''}`} title="Open Application Portal" aria-label="Open Application Portal" onClick={onOpen}>
    <span>A</span><ExternalLink size={11} />
  </button>
}
