export interface Book {
  id: string
  title: string
  author?: string
  isbn?: string
  publisher?: string
  publicationDate?: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  address?: string
  city?: string
}

export interface CirculationRecord {
  id: string
  bookId: string
  book?: Book
  customerId: string
  customer?: Customer
  dateIssued: string
  returnDate: string
  returned?: boolean
}

export type ApiResponse<T> = {
  data: T
  error?: string
}