"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { BookmasterLogo } from "@/components/bookmaster-logo"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { searchBooks, type Book } from "@/lib/data"
import { BookDetailModal } from "@/components/book-detail-modal"
import { AuthorModal } from "@/components/author-modal"

export default function LibraryPage() {
  const [searchTitle, setSearchTitle] = useState("")
  const [searchAuthor, setSearchAuthor] = useState("")
  const [searchSubject, setSearchSubject] = useState("")
  const [results, setResults] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [authorModalOpen, setAuthorModalOpen] = useState(false)

  // load initial data from backend
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const initial = await searchBooks({})
        if (mounted) setResults(Array.isArray(initial) ? initial : [])
      } catch {
        if (mounted) setResults([])
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const itemsPerPage = 6
  const totalPages = Math.max(1, Math.ceil(results.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage)
  const selectedBook = paginatedResults[0]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchResults = await searchBooks({
      title: searchTitle,
      author: searchAuthor,
      subject: searchSubject,
    })
    setResults(Array.isArray(searchResults) ? searchResults : [])
    setCurrentPage(1)
  }

  const handleTitleClick = (book: Book) => {
    setSelectedBookForModal(book)
    setBookModalOpen(true)
  }

  const handleAuthorClick = (authorName: string) => {
    setSelectedAuthor(authorName)
    setAuthorModalOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <AppHeader title="Library" />

        <div className="flex h-[calc(100vh-120px)]">
          {/* Sidebar */}
          <aside className="w-80 border-r-2 border-foreground bg-sidebar p-6 flex flex-col">
            <BookmasterLogo />

            <form onSubmit={handleSearch} className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="border-2 border-foreground rounded-none"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">
                  Author
                </label>
                <Input
                  id="author"
                  name="author"
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  className="border-2 border-foreground rounded-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="border-2 border-foreground rounded-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full border-2 border-foreground rounded-none bg-background text-foreground hover:bg-muted"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Results Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="border-2 border-foreground p-2 text-left font-semibold">Title</th>
                    <th className="border-2 border-foreground p-2 text-left font-semibold w-64">Authors</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map((book, index) => (
                    <tr key={book.id} className={index === 0 ? "bg-accent text-accent-foreground" : "hover:bg-muted"}>
                      <td
                        className="border border-foreground p-2 cursor-pointer hover:underline"
                        onClick={() => handleTitleClick(book)}
                      >
                        {book.title}
                      </td>
                      <td
                        className="border border-foreground p-2 cursor-pointer hover:underline"
                        onClick={() => handleAuthorClick(book.author)}
                      >
                        {book.author}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t-2 border-foreground p-3 flex items-center justify-between bg-background">
              <div className="flex items-center gap-2">
                <span className="text-sm">Page</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-2 border-foreground rounded-none bg-transparent"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {"<"}
                </Button>
                <Input
                  type="number"
                  value={currentPage}
                  min={1}
                  max={totalPages}
                  className="w-16 h-8 text-center border-2 border-foreground rounded-none"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-2 border-foreground rounded-none bg-transparent"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {">"}
                </Button>
                <span className="text-sm">of {totalPages}</span>
              </div>
              <div className="text-sm font-medium">{results.length} Books found</div>
            </div>

            {/* Book Details */}
            {selectedBook && (
              <div className="border-t-2 border-foreground p-6 bg-background">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">{selectedBook.title}</h2>
                    <p className="text-sm text-muted-foreground mb-1">by {selectedBook.author}</p>
                    {selectedBook.firstPublished && (
                      <p className="text-sm text-muted-foreground mb-4">
                        first published: {selectedBook.firstPublished}
                      </p>
                    )}

                    {selectedBook.description && (
                      <>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm mb-4">{selectedBook.description}</p>
                      </>
                    )}

                    <h3 className="font-semibold mb-2">Subjects</h3>
                    <p className="text-sm">{selectedBook.subject}</p>
                  </div>

                  {selectedBook.coverUrl && (
                    <div className="flex flex-col gap-2">
                      <img
                        src={selectedBook.coverUrl || "/placeholder.svg"}
                        alt={selectedBook.title}
                        className="w-48 h-64 object-cover border-2 border-foreground"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-2 border-foreground rounded-none bg-transparent"
                        >
                          {"<"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-2 border-foreground rounded-none bg-transparent"
                        >
                          {">"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <BookDetailModal book={selectedBookForModal} open={bookModalOpen} onOpenChange={setBookModalOpen} />
      <AuthorModal authorName={selectedAuthor} open={authorModalOpen} onOpenChange={setAuthorModalOpen} />
    </>
  )
}
