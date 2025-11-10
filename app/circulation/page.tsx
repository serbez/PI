"use client"

import React from "react"
import { AppHeader } from "@/components/app-header"
import { BookmasterLogo } from "@/components/bookmaster-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"
import { useCirculation } from "@/hooks/use-circulation"
import type { CirculationRecord } from "@/hooks/types/api"

export default function CirculationPage({
  searchParams,
}: {
  searchParams: { customerId?: string; bookId?: string }
}) {
  const unwrappedParams = React.use(searchParams)
  const customerId = unwrappedParams?.customerId
  const bookId = unwrappedParams?.bookId || ""

  const { currentIssues, history, loading, error, loadCurrent, loadHistory } = useCirculation()

  // Load data on mount or when customerId changes
  React.useEffect(() => {
    loadCurrent(customerId)
    loadHistory(customerId)
  }, [customerId, loadCurrent, loadHistory])

  const isOverdue = (returnDate: string) => {
    return new Date() > new Date(returnDate)
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Circulation" />

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <aside className="w-80 border-r-2 border-foreground bg-sidebar p-6 flex flex-col">
          <BookmasterLogo />

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium mb-1">
                Customer ID
              </label>
              <Input
                id="customerId"
                name="customerId"
                defaultValue={customerId}
                className="border-2 border-foreground rounded-none"
              />
            </div>

            <Button className="w-full border-2 border-foreground rounded-none bg-background text-foreground hover:bg-muted">
              Search
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6 overflow-auto">
          {/* Issue/Return Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Issue / Return</h2>
            <div className="flex items-end gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="bookId" className="block text-sm font-medium mb-1">
                  Book ID
                </label>
                <Input
                  id="bookId"
                  name="bookId"
                  defaultValue={bookId}
                  className="border-2 border-foreground rounded-none"
                />
              </div>
              <Button className="border-2 border-foreground rounded-none bg-muted text-foreground hover:bg-secondary">
                Issue
              </Button>
              <Button className="border-2 border-foreground rounded-none bg-background text-foreground hover:bg-muted">
                Return
              </Button>
            </div>
          </section>

          {/* Current Issues */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Current issues</h2>
            <table className="w-full border-collapse mb-4">
              <thead className="bg-muted">
                <tr>
                  <th className="border-2 border-foreground p-2 text-left font-semibold">Title</th>
                  <th className="border-2 border-foreground p-2 text-left font-semibold w-32">Date of issue</th>
                  <th className="border-2 border-foreground p-2 text-left font-semibold w-32">Return until</th>
                </tr>
              </thead>
              <tbody>
                {currentIssues.map((record: CirculationRecord) => (
                  <tr key={record.id} className="hover:bg-muted">
                    <td className="border border-foreground p-2">{record.book?.title}</td>
                    <td className="border border-foreground p-2">
                      {new Date(record.dateIssued).toLocaleDateString()}
                    </td>
                    <td className="border border-foreground p-2">
                      <div className="flex items-center gap-2">
                        {new Date(record.returnDate).toLocaleDateString()}
                        {isOverdue(record.returnDate) && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* History */}
          <section>
            <h2 className="text-xl font-bold mb-3">History</h2>
            <table className="w-full border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="border-2 border-foreground p-2 text-left font-semibold">Title</th>
                  <th className="border-2 border-foreground p-2 text-left font-semibold w-32">Date of issue</th>
                  <th className="border-2 border-foreground p-2 text-left font-semibold w-32">Return date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record: CirculationRecord) => (
                  <tr key={record.id} className="hover:bg-muted">
                    <td className="border border-foreground p-2">{record.book?.title}</td>
                    <td className="border border-foreground p-2">
                      {new Date(record.dateIssued).toLocaleDateString()}
                    </td>
                    <td className="border border-foreground p-2">
                      <div className="flex items-center gap-2">
                        {new Date(record.returnDate).toLocaleDateString()}
                        {!record.returned && isOverdue(record.returnDate) && (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  )
}
