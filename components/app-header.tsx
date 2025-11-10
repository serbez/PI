"use client"

import { useState } from "react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const [libraryMenuOpen, setLibraryMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      <header className="border-b-2 border-foreground bg-background">
        <div className="px-4 py-2">
          <h1 className="text-lg font-semibold">Bookmaster3000™ - {title}</h1>
        </div>
        <nav className="flex gap-6 px-4 py-2 text-sm border-t border-foreground">
          <DropdownMenu open={fileMenuOpen} onOpenChange={setFileMenuOpen}>
            <DropdownMenuTrigger className="hover:underline outline-none">File</DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-2 border-black">
              <DropdownMenuItem asChild>
                <Link href="/">Library</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLoginModalOpen(true)}>Login</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
              <DropdownMenuItem>Close</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={libraryMenuOpen} onOpenChange={setLibraryMenuOpen}>
            <DropdownMenuTrigger className="hover:underline outline-none">Library</DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-2 border-black">
              <DropdownMenuItem asChild>
                <Link href="/customers">Manage Customers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/circulation">Circulation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/reports">Reports</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}
