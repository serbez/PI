import { useState, useCallback } from "react"
import api from "@/lib/api-service"
import type { Book } from "./types/api"

export function useBooks() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[]>([])

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.books.getAll()
      setBooks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books")
    } finally {
      setLoading(false)
    }
  }, [])

  const searchBooks = useCallback(async (query: string) => {
    try {
      setLoading(true)
      const data = await api.books.search(query)
      setBooks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search books")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    books,
    loading,
    error,
    loadBooks,
    searchBooks
  }
}