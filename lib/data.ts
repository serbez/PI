export interface Book {
  id: string
  title: string
  author: string
  subject: string
  firstPublished?: number
  description?: string
  coverUrl?: string
}

export interface Customer {
  id: string
  name: string
  address: string
  zip: string
  city: string
  phone?: string
  email?: string
}

export interface CirculationRecord {
  id: string
  bookId: string
  customerId: string
  dateIssued: Date
  returnDate: Date
  returned: boolean
}

// TEMP DEBUG: force absolute backend URL so client calls go directly to backend.
// Replace with environment-based logic after verification.
const API_BASE = 'https://localhost:7138/api'
console.debug('DEBUG forced API_BASE =', API_BASE)
// ...remove TEMP DEBUG above when done...

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const normalizedBase = (API_BASE || "").replace(/\/$/, "")
  const normalizedPath = path.replace(/^\//, "")
  const url = `${normalizedBase}/${normalizedPath}`
  // Debug: show the final full URL in the browser console (remove after verification)
  try {
    // This will appear in the browser console when apiFetch runs client-side
    console.debug('apiFetch fullUrl =', url, ' API_BASE(client) =', API_BASE)
  } catch (e) {}
  const fetchOpts: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  }
  const res = await fetch(url, fetchOpts)
  if (!res.ok) {
    throw new Error(`API error ${res.status}`)
  }
  return (await res.json()) as T
}

function normalizeStringField(obj: any, camel: string, pascal: string) {
  return obj[camel] ?? obj[pascal] ?? undefined
}

function parseCirculationRecord(raw: any): CirculationRecord {
  const bookId = normalizeStringField(raw, 'bookId', 'BookId') ?? ''
  const customerId = normalizeStringField(raw, 'customerId', 'CustomerId') ?? ''
  const dateIssuedRaw = normalizeStringField(raw, 'dateIssued', 'DateIssued')
  const returnDateRaw = normalizeStringField(raw, 'returnDate', 'ReturnDate')
  return {
    id: normalizeStringField(raw, 'id', 'Id') ?? '',
    bookId,
    customerId,
    dateIssued: dateIssuedRaw ? new Date(dateIssuedRaw) : new Date(NaN),
    returnDate: returnDateRaw ? new Date(returnDateRaw) : new Date(NaN),
    returned: !!(raw.returned ?? raw.Returned),
  }
}

export async function searchBooks(query: { title?: string; author?: string; subject?: string }): Promise<Book[]> {
  // Если нет фильтров — не делать POST автоматически (избежим поиска при маунте).
  if (!query.title && !query.author && !query.subject) {
    return getAllBooks().catch(() => [])
  }

  // backend expects POST /api/books/search with a Book-like body
  try {
    const res = await apiFetch<any>('books/search', {
      method: 'POST',
      body: JSON.stringify({ title: query.title, author: query.author, subject: query.subject }),
    })
    // Handle different response shapes: array, { results: [] }, { items: [] }
    if (Array.isArray(res)) return res as Book[]
    if (res && Array.isArray(res.results)) return res.results as Book[]
    if (res && Array.isArray(res.items)) return res.items as Book[]
    console.warn('searchBooks: unexpected response shape', res)
    return []
  } catch (err) {
    console.error('searchBooks failed:', err)
    return []
  }
}

export async function getBookById(id: string): Promise<Book | undefined> {
  try {
    return await apiFetch<Book>(`books/${encodeURIComponent(id)}`)
  } catch {
    return undefined
  }
}

export async function getAllBooks(): Promise<Book[]> {
  return apiFetch<Book[]>('books')
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  try {
    return await apiFetch<Customer>(`customers/${encodeURIComponent(id)}`)
  } catch {
    return undefined
  }
}

export async function searchCustomers(query: { id?: string; name?: string }): Promise<Customer[]> {
  return apiFetch<Customer[]>('customers/search', {
    method: 'POST',
    body: JSON.stringify({ id: query.id, name: query.name }),
  })
}

export async function getAllCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>('customers')
}

export async function getCustomerCirculation(customerId: string): Promise<(CirculationRecord & { book?: Book | null })[]> {
  const raw = await apiFetch<any[]>('circulation')
  const filtered = raw.filter((r) => {
    const cId = normalizeStringField(r, 'customerId', 'CustomerId')
    return cId === customerId
  })
  // load books map to attach book info
  const books = await getAllBooks().catch(() => [])
  const bookMap = new Map(books.map((b) => [b.id, b]))
  return filtered.map((r) => {
    const parsed = parseCirculationRecord(r)
    return { ...parsed, book: bookMap.get(parsed.bookId) ?? null }
  })
}

export async function getCurrentIssues(customerId?: string) {
  // backend provides /api/circulation/current?customerId=...
  const q = customerId ? `current?customerId=${encodeURIComponent(customerId)}` : 'current'
  const raw = await apiFetch<any[]>(`circulation/${q}`)
  const books = await getAllBooks().catch(() => [])
  const bookMap = new Map(books.map((b) => [b.id, b]))
  return raw.map((r) => {
    const parsed = parseCirculationRecord(r)
    return { ...parsed, book: bookMap.get(parsed.bookId) ?? null }
  })
}

export async function getHistory(customerId?: string) {
  const q = customerId ? `history?customerId=${encodeURIComponent(customerId)}` : 'history'
  const raw = await apiFetch<any[]>(`circulation/${q}`)
  const books = await getAllBooks().catch(() => [])
  const bookMap = new Map(books.map((b) => [b.id, b]))
  return raw.map((r) => {
    const parsed = parseCirculationRecord(r)
    return { ...parsed, book: bookMap.get(parsed.bookId) ?? null }
  })
}

export async function getAllOverdueBooks(): Promise<(CirculationRecord & { book?: Book | null; customer?: Customer | null })[]> {
  const raw = await apiFetch<any[]>('circulation')
  const books = await getAllBooks().catch(() => [])
  const customers = await getAllCustomers().catch(() => [])
  const bookMap = new Map(books.map((b) => [b.id, b]))
  const customerMap = new Map(customers.map((c) => [c.id, c]))
  const today = new Date()
  return raw
    .map(parseCirculationRecord)
    .filter((r) => !r.returned && r.returnDate < today)
    .map((r) => ({ ...r, book: bookMap.get(r.bookId) ?? null, customer: customerMap.get(r.customerId) ?? null }))
}

export async function getBookHistory(bookId: string) {
  // backend has no direct book history endpoint; fetch circulation and filter
  const raw = await apiFetch<any[]>('circulation')
  const customers = await getAllCustomers().catch(() => [])
  const customerMap = new Map(customers.map((c) => [c.id, c]))
  return raw
    .map(parseCirculationRecord)
    .filter((r) => r.bookId === bookId)
    .map((r) => ({ ...r, customer: customerMap.get(r.customerId) ?? null }))
}