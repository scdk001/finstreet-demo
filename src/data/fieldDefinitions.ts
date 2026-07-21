import type { ApplicationField, FieldCategory } from '../types'

const definition = (id: string, label: string, category: FieldCategory, required = false): ApplicationField => ({
  id, label, category, required, value: '', status: 'Missing', source: 'User message',
})

export const fieldDefinitions: ApplicationField[] = [
  definition('loanPurpose', 'Loan purpose', 'Loan Request', true),
  definition('transactionType', 'Purchase or refinance', 'Loan Request', true),
  definition('propertyType', 'Residential or commercial', 'Security', true),
  definition('loanAmount', 'Requested loan amount', 'Loan Request', true),
  definition('propertyValue', 'Purchase price / property value', 'Security', true),
  definition('calculatedLvr', 'Calculated LVR', 'Loan Request'),
  definition('securityAddress', 'Security property address', 'Security'),
  definition('occupancy', 'Owner occupied or investment', 'Security', true),
  definition('borrowerType', 'Borrower type', 'Borrowers', true),
  definition('residency', 'Residency status', 'Borrowers', true),
  definition('employment', 'Employment type', 'Income', true),
  definition('income', 'PAYG / self-employed income', 'Income', true),
  definition('rentalIncome', 'Rental and other income', 'Income'),
  definition('liabilities', 'Existing liabilities', 'Liabilities'),
  definition('creditCards', 'Credit card limits', 'Liabilities'),
  definition('contribution', 'Deposit / available contribution', 'Assets'),
  definition('loanTerm', 'Desired loan term', 'Loan Request'),
  definition('interestOnly', 'Interest-only requirements', 'Loan Request'),
  definition('creditIssues', 'Known credit issues', 'Additional Notes'),
  definition('settlement', 'Settlement deadline', 'Additional Notes'),
  definition('documents', 'Available supporting documents', 'Documents'),
  definition('broker', 'Broker details', 'Borrowers'),
  definition('additionalNotes', 'Additional explanation', 'Additional Notes'),
]

export const categories: FieldCategory[] = ['Loan Request', 'Borrowers', 'Income', 'Assets', 'Liabilities', 'Security', 'Documents', 'Additional Notes']
