import { useContext } from 'react'
import { CompareContext } from '../context/CompareContext'

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error('CompareProvider')
  return context
}
