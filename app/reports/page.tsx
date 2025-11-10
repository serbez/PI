"use client"

import React, { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/api-service"
import { enrichCirculationRecords } from "@/lib/utils"
import type { CirculationRecord } from "@/hooks/types/api"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("reminders")
  const [bookId, setBookId] = useState("OL4597468W")
  const [bookHistory, setBookHistory] = useState<CirculationRecord[]>([])
  const [overdueBooks, setOverdueBooks] = useState<CirculationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем просроченные книги
  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        setLoading(true)
        const records = await api.circulation.getCurrent()
        const enriched = await enrichCirculationRecords(records)
        setOverdueBooks(enriched)
      } catch (err) {
        setError("Не удалось загрузить просроченные книги")
      } finally {
        setLoading(false)
      }
    }
    fetchOverdue()
  }, [])

  // Загружаем историю книги
  useEffect(() => {
    const fetchHistory = async () => {
      if (!bookId) return
      try {
        setLoading(true)
        const records = await api.circulation.getByCustomer(bookId)
        const enriched = await enrichCirculationRecords(records)
        setBookHistory(enriched)
      } catch (err) {
        setError("Не удалось загрузить историю книги")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [bookId])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Загрузка...</div>
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center">Ошибка: {error}</div>
  }

  return (
    <div className="h-screen bg-[#c0c0c0] flex flex-col">
      <AppHeader title="Reports" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white border-2 border-black border-t-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b-2 border-black">
            <h2 className="text-2xl font-bold">Reports</h2>
            <Button className="h-10 px-6 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal">
              📄 Export
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-fit mx-4 mt-4 bg-transparent border-0 p-0 h-auto gap-0">
              <TabsTrigger value="reminders" className="rounded-none border-2 border-black border-b-0 bg-[#c0c0c0] data-[state=active]:bg-white px-6 py-2 font-normal">
                Reminders
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-none border-2 border-black border-b-0 border-l-0 bg-[#c0c0c0] data-[state=active]:bg-white px-6 py-2 font-normal">
                Book history
              </TabsTrigger>
            </TabsList>

            {/* Reminders Tab */}
            <TabsContent value="reminders" className="flex-1 border-t-2 border-black overflow-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Customer</th>
                    <th className="border p-2">Date of issue</th>
                    <th className="border p-2">Return until</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBooks.map((record) => (
                    <tr key={record.id}>
                      <td className="border p-2">{record.book?.title}</td>
                      <td className="border p-2">{record.customer?.name}</td>
                      <td className="border p-2">{formatDate(record.dateIssued)}</td>
                      <td className="border p-2">{formatDate(record.returnDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>

            {/* Book History Tab */}
            <TabsContent value="history" className="flex-1 border-t-2 border-black overflow-auto">
              <div className="p-4">
                <Label htmlFor="bookId">Book ID</Label>
                <Input
                  id="bookId"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border p-2">Customer</th>
                    <th className="border p-2">Date of issue</th>
                    <th className="border p-2">Return date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="border p-2">{record.customer?.name}</td>
                      <td className="border p-2">{formatDate(record.dateIssued)}</td>
                      <td className="border p-2">{formatDate(record.returnDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
