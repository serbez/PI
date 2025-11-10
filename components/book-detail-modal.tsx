"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/data"

interface BookDetailModalProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookDetailModal(props: {
  book: Book | null
  open: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { book, open, onOpenChange } = props

  // watch client-side URL search params instead of reading a server `searchParams.bookId` directly
  const searchParams = useSearchParams()

  useEffect(() => {
    // safely read param via client hook and open modal if present
    const bookId = searchParams?.get?.("bookId")
    if (bookId && onOpenChange) {
      onOpenChange(true)
    }
    // do not set state in render — useEffect prevents sync loop
  }, [searchParams, onOpenChange])

  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-4 border-black rounded-none bg-white p-0">
        {/* Header */}
        <div className="border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-normal">Book Information</h1>
        </div>

        {/* Content */}
        <div className="p-8 flex gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
            {book.firstPublished && (
              <p className="text-sm text-gray-600 mb-1">Subtitle placeholder</p>
            )}

            <p className="text-blue-600 mb-1">by {book.author}</p>
            {book.firstPublished && (
              <p className="text-sm mb-6">first published: {book.firstPublished}</p>
            )}

            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-sm mb-6">
              {book.description || "No description available"}
            </p>

            <h3 className="font-bold mb-2">Subjects</h3>
            <p className="text-sm">{book.subject}</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-48 h-64 border-2 border-black bg-gray-100 flex items-center justify-center">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-6xl">✕</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal">
                {"<"}
              </Button>
              <Button className="flex-1 h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal">
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}