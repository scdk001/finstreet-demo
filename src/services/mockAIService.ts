import type { ApplicationField } from '../types'

type FieldUpdate = { id: string; value: string; confidence: number; sourceMessageId: string }

const formatAud = (value: number) => `A$${Math.round(value).toLocaleString('en-AU')}`

function money(text: string, pattern: RegExp) {
  const match = text.match(pattern)
  if (!match) return null
  const numeric = Number(match[1].replace(/,/g, ''))
  const multiplier = /^(?:million|m)$/i.test(match[2] ?? '') ? 1_000_000 : /^(?:k|thousand)$/i.test(match[2] ?? '') ? 1_000 : 1
  return Number.isFinite(numeric) ? numeric * multiplier : null
}

export function analyseApplicantMessage(text: string, fields: ApplicationField[], messageId: string) {
  const lower = text.toLowerCase()
  const updates: FieldUpdate[] = []
  const add = (id: string, value: string, confidence = 94) => updates.push({ id, value, confidence, sourceMessageId: messageId })

  if (lower.includes('refinanc')) { add('loanPurpose', 'Refinance'); add('transactionType', 'Refinance') }
  else if (lower.includes('purchas') || lower.includes('buy')) { add('loanPurpose', lower.includes('commercial') ? 'Commercial property purchase' : 'Property purchase'); add('transactionType', 'Purchase') }
  if (lower.includes('investment')) add('occupancy', 'Investment')
  else if (lower.includes('owner occupied') || lower.includes('own home')) add('occupancy', 'Owner occupied')
  if (lower.includes('commercial')) add('propertyType', 'Commercial')
  else if (lower.includes('residential') || lower.includes('property')) add('propertyType', 'Residential')
  if (lower.includes('self-employed') || lower.includes('self employed')) add('employment', 'Self-employed')
  else if (lower.includes('payg') || lower.includes('employed')) add('employment', 'PAYG employed')
  if (lower.includes('company borrower') || lower.includes('company')) add('borrowerType', 'Company')
  else if (lower.includes('trust')) add('borrowerType', 'Trust')
  else if (lower.includes('individual') || lower.includes('myself') || lower.includes('i am')) add('borrowerType', 'Individual', 88)
  if (lower.includes('australian citizen')) add('residency', 'Australian citizen')
  else if (lower.includes('permanent resident') || lower.includes(' pr ')) add('residency', 'Australian permanent resident')
  else if (lower.includes('expat')) add('residency', 'Australian expat')

  const propertyValue = money(text, /(?:valued at|property value(?: is| of)?|purchase price(?: is| of)?)\s*(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?/i)
  if (propertyValue) add('propertyValue', formatAud(propertyValue), 97)
  const loanAmount = money(text, /(?:need|seeking|request(?:ed)?|loan(?: amount)?(?: is| of)?)\s*(?:an?\s+)?(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?(?:\s+loan)?/i)
  if (loanAmount) add('loanAmount', formatAud(loanAmount), 97)
  const annualIncome = money(text, /(?:earn|income(?: is| of)?|salary(?: is| of)?)\s*(?:approximately|around|about)?\s*(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?/i)
  if (annualIncome) add('income', `${formatAud(annualIncome)} p.a.`, 94)
  const rentalIncome = money(text, /(?:rental income|rent)(?: is| of)?\s*(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?/i)
  if (rentalIncome) add('rentalIncome', `${formatAud(rentalIncome)} p.a.`, 91)
  const creditLimit = money(text, /credit card(?: limit|s)?(?: is| of| total)?\s*(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?/i)
  if (creditLimit) add('creditCards', formatAud(creditLimit), 91)
  const contribution = money(text, /(?:deposit|contribution|available funds)(?: is| of)?\s*(?:a\$|\$)?\s*([\d,.]+)\s*(million|m|k|thousand)?/i)
  if (contribution) add('contribution', formatAud(contribution), 91)

  const term = text.match(/(\d{1,2})[- ]year loan/i)
  if (term) add('loanTerm', `${term[1]} years`, 93)
  const io = text.match(/(\d{1,2})[- ]year interest[- ]only/i)
  if (io) add('interestOnly', `${io[1]} years`, 93)
  if (lower.includes('no credit issue') || lower.includes('clean credit')) add('creditIssues', 'No known credit issues disclosed', 90)
  if (lower.includes('payslip') || lower.includes('bank statement') || lower.includes('tax return')) add('documents', text.trim(), 86)

  const amountValues = Object.fromEntries(fields.map((field) => [field.id, field.value]))
  const finalLoan = loanAmount ?? Number(String(amountValues.loanAmount ?? '').replace(/[^\d]/g, ''))
  const finalValue = propertyValue ?? Number(String(amountValues.propertyValue ?? '').replace(/[^\d]/g, ''))
  if (finalLoan && finalValue) add('calculatedLvr', `${((finalLoan / finalValue) * 100).toFixed(1)}%`, 99)

  const pendingAfter = fields.filter((field) => field.required && !field.value && !updates.some((item) => item.id === field.id))
  const recognised = updates.length
  const next = pendingAfter.slice(0, 2).map((field) => field.label.toLowerCase())
  const reply = recognised
    ? `I’ve organised ${recognised} item${recognised === 1 ? '' : 's'} from that. ${next.length ? `Next, please confirm ${next.join(' and ')}.` : 'The core application information is ready for your confirmation.'}`
    : `I haven’t applied that to a field yet. Please add a little more detail. ${next.length ? `We still need ${next.join(' and ')}.` : ''}`

  return { updates, reply }
}

export function suggestedReplies(fields: ApplicationField[]) {
  const missing = new Set(fields.filter((field) => field.status === 'Missing').map((field) => field.id))
  if (missing.has('borrowerType') || missing.has('residency')) return ['Individual, Australian citizen', 'Company borrower', 'Australian expat']
  if (missing.has('propertyType') || missing.has('occupancy')) return ['Residential investment', 'Owner-occupied residential', 'Commercial investment']
  if (missing.has('creditIssues')) return ['No known credit issues', 'I need to explain a credit issue']
  if (missing.has('documents')) return ['I have bank statements and tax returns', 'I will upload documents later']
  return ['Use the remaining demo details', 'What information is still missing?']
}
