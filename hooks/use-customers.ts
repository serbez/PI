import { useCallback, useState } from "react"
import { searchCustomers as searchCustomersApi, getAllCustomers as getAllCustomersApi } from "@/lib/data"
import type { Customer } from "./types/api"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = (process?.env?.NEXT_PUBLIC_API_BASE as string) || "/api"
  const normalizedApiBase = apiBase.replace(/\/$/, "")

  const search = useCallback(
    async (params: { id?: string | null; name?: string | null } = {}) => {
      setLoading(true)
      setError(null)
      try {
        let res
        // If no filters provided -> fetch all customers
        if ((!params.id || params.id === "") && (!params.name || params.name === "")) {
          res = await getAllCustomersApi()
        } else {
          res = await searchCustomersApi({
            id: params.id ?? undefined,
            name: params.name ?? undefined,
          } as any)
        }
        setCustomers(Array.isArray(res) ? res : [])
      } catch (err) {
        console.error("useCustomers.search failed", err)
        setError(err instanceof Error ? err.message : String(err))
        setCustomers([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createCustomer = useCallback(async (customer: Customer) => {
    const url = `${normalizedApiBase}/customers`
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
    if (!resp.ok) throw new Error(`Create failed: ${resp.status}`)
    const created = (await resp.json()) as Customer
    // refresh list after create (search with no params -> getAllCustomers)
    await search({})
    return created
  }, [normalizedApiBase, search])

  const updateCustomer = useCallback(
    async (id: string, customer: Customer) => {
      const url = `${normalizedApiBase}/customers/${encodeURIComponent(id)}`
      const resp = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      })
      if (!resp.ok) throw new Error(`Update failed: ${resp.status}`)
      const updated = (await resp.json()) as Customer
      // refresh list after update
      await search({})
      return updated
    },
    [normalizedApiBase, search]
  )

  return {
    customers,
    loading,
    error,
    search,
    createCustomer,
    updateCustomer,
  }
}