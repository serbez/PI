import type { Book, Customer, CirculationRecord, ApiResponse } from "@/hooks/types/api"

export const API_BASE = (() => {
  const env = (process?.env?.NEXT_PUBLIC_API_BASE as string) || ""
  return env || "https://localhost:7138/api"
})()

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}/${path.replace(/^\//, "")}`
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  })
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`)
  }

  const json = await res.json()
  return (json?.data ?? json) as T
}

export const api = {
  books: {
    getAll: () => apiFetch<Book[]>("books"),
    getById: (id: string) => apiFetch<Book>(`books/${id}`),
    search: (query: string) => apiFetch<Book[]>(`books?query=${encodeURIComponent(query)}`),
  },
  customers: {
    getAll: () => apiFetch<Customer[]>("customers"),
    getById: (id: string) => apiFetch<Customer>(`customers/${id}`),
    search: (query: string) => apiFetch<Customer[]>(`customers?query=${encodeURIComponent(query)}`),
  },
  circulation: {
    getCurrent: () => apiFetch<CirculationRecord[]>("circulation/current"),
    getHistory: () => apiFetch<CirculationRecord[]>("circulation/history"),
    getByCustomer: (customerId: string) => 
      apiFetch<CirculationRecord[]>(`circulation?bookId=${encodeURIComponent(customerId)}`),
    getBookHistory: (bookId: string) =>
      apiFetch<CirculationRecord[]>(`circulation?bookId=${encodeURIComponent(bookId)}&type=history`),
  }
}

export default api