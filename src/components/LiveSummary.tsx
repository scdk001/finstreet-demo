import { Check, ChevronDown, CircleAlert, Pencil, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { categories } from '../data/fieldDefinitions'
import type { ApplicationField } from '../types'

const statusClass: Record<ApplicationField['status'], string> = {
  Confirmed: 'confirmed', 'AI interpreted': 'interpreted', Missing: 'missing', 'Needs review': 'review', 'Broker review required': 'broker',
}

export function LiveSummary({ fields, onUpdate, onConfirm, onExplain }: { fields: ApplicationField[]; onUpdate: (id: string, value: string) => void; onConfirm: (id: string) => void; onExplain: (field: ApplicationField) => void }) {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState<ApplicationField | null>(null)
  const [draft, setDraft] = useState('')
  return <aside className={`summary-panel glass-panel ${open ? 'is-open' : ''}`}>
    <button type="button" className="summary-heading" onClick={() => setOpen(!open)} aria-expanded={open}>
      <span><small>Structured intake</small>Live Application Summary</span><ChevronDown size={16} />
    </button>
    <div className="summary-content">
      {categories.map((category) => {
        const categoryFields = fields.filter((field) => field.category === category)
        const completed = categoryFields.filter((field) => field.value).length
        return <section key={category} className="summary-group"><div className="summary-group-title"><h3>{category}</h3><span>{completed}/{categoryFields.length}</span></div>
          {categoryFields.map((field) => <button type="button" key={field.id} className="summary-field" onClick={() => { setSelected(field); setDraft(field.value) }}>
            <span><strong>{field.label}</strong><small>{field.value || 'Not provided'}</small></span><em className={statusClass[field.status]}>{field.status === 'Confirmed' ? <Check size={10} /> : field.status === 'Missing' ? <CircleAlert size={10} /> : null}{field.status}</em>
          </button>)}
        </section>
      })}
    </div>
    {selected && <div className="field-editor-backdrop" onClick={() => setSelected(null)}><div className="field-editor" onClick={(event) => event.stopPropagation()}>
      <button type="button" aria-label="Close field editor" className="icon-button editor-close" onClick={() => setSelected(null)}><X size={15} /></button>
      <small>{selected.category}</small><h3>{selected.label}</h3>
      <label>Current value<input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Enter a value" /></label>
      <div className="field-meta"><span>Source</span><strong>{selected.source}</strong><span>Confidence</span><strong>{selected.confidence ? `${selected.confidence}%` : 'Not assessed'}</strong></div>
      <div className="editor-actions"><button type="button" className="secondary-button" onClick={() => onExplain(selected)}><RotateCcw size={13} /> Ask AI to explain</button><button type="button" className="secondary-button" onClick={() => { onUpdate(selected.id, draft); setSelected(null) }}><Pencil size={13} /> Save edit</button><button type="button" className="primary-button" disabled={!draft} onClick={() => { onUpdate(selected.id, draft); onConfirm(selected.id); setSelected(null) }}><Check size={13} /> Confirm</button></div>
    </div></div>}
  </aside>
}
