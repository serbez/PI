import { useState, useCallback } from "react"
import api from "@/lib/api-service"
import type { CirculationRecord } from "./types/api"
import { enrichCirculationRecords } from "@/lib/utils"

export function useCirculation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIssues, setCurrentIssues] = useState<CirculationRecord[]>([])
  const [history, setHistory] = useState<CirculationRecord[]>([])

  const loadCurrent = useCallback(async (customerId?: string) => {
    try {
      setLoading(true)
      const records = customerId ? 
        await api.circulation.getByCustomer(customerId) :
        await api.circulation.getCurrent()
      const enriched = await enrichCirculationRecords(records)
      setCurrentIssues(enriched)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load current issues")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async (customerId?: string) => {
    try {
      setLoading(true)
      const records = customerId ?
        await api.circulation.getByCustomer(customerId) :
        await api.circulation.getHistory()
      const enriched = await enrichCirculationRecords(records)
      setHistory(enriched)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    currentIssues,
    history,
    loading,
    error,
    loadCurrent,
    loadHistory
  }
}