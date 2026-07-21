import type { CSSProperties, MouseEvent } from 'react'
import { Check, Sparkles } from 'lucide-react'
import type { OrbState } from '../types'

const labels: Record<OrbState, string> = {
  idle: 'Tap to begin', listening: 'Listening', typing: 'You are typing', thinking: 'Analysing your request', responding: 'Organising information', collecting: 'Collecting application details', validating: 'Validating information', completed: 'Application created', error: 'Please try again',
}

export function ConciergeOrb({ state, compact = false, progress = 0, onClick }: { state: OrbState; compact?: boolean; progress?: number; onClick: () => void }) {
  const move = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--orb-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 18}px`)
    event.currentTarget.style.setProperty('--orb-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 18}px`)
  }
  const reset = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--orb-x', '0px')
    event.currentTarget.style.setProperty('--orb-y', '0px')
  }
  const style = { '--progress': `${Math.max(4, progress)}%` } as CSSProperties
  return <div className={`orb-stage ${compact ? 'is-compact' : ''}`}>
    <button type="button" data-testid="concierge-orb" aria-label={compact ? 'Continue AI loan application' : 'Start AI loan application'} className={`concierge-orb state-${state}`} onMouseMove={move} onMouseLeave={reset} onClick={onClick} style={style}>
      <span className="orb-aura" />
      <span className="orb-shell">
        <span className="orb-light orb-light-one" />
        <span className="orb-light orb-light-two" />
        <span className="orb-light orb-light-three" />
        <span className="orb-particles" />
        <span className="orb-core">{state === 'completed' ? <Check size={compact ? 22 : 34} /> : <Sparkles size={compact ? 18 : 26} />}</span>
      </span>
      {(state === 'collecting' || state === 'validating') && <span className="orb-progress" />}
    </button>
    <p className="orb-status"><span />{labels[state]}</p>
  </div>
}
