"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AuthorModalProps {
  authorName: string | null
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export function AuthorModal(props: AuthorModalProps) {
  const { authorName, open, onOpenChange } = props

  // read searchParams on client and open modal if `authorName` param is present
  const searchParams = useSearchParams()

  useEffect(() => {
    const a = searchParams?.get?.("customerId") || searchParams?.get?.("authorName")
    if (a && onOpenChange) {
      onOpenChange(true)
    }
  }, [searchParams, onOpenChange])

  if (!authorName) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-4 border-black rounded-none bg-white p-0">
        {/* Header */}
        <div className="border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-normal">Authors of {authorName}</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <select className="w-full h-12 border-2 border-black rounded-none bg-white px-3">
              <option>{authorName}</option>
            </select>
          </div>

          <p className="text-sm text-gray-600 mb-6">31 July 1965 -</p>

          <h3 className="font-bold mb-3">Bio</h3>
          <p className="text-sm mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>

          <a href="#" className="text-blue-600 underline text-sm mb-6 block">
            Learn more on Wikipedia
          </a>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-32 h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
