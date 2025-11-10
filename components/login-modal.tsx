"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookmasterLogo } from "@/components/bookmaster-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    // Simple mock authentication
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true")
      onOpenChange(false)
      router.refresh()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[580px] border-4 border-black rounded-none bg-white p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b-2 border-black bg-white p-2 flex items-center justify-between">
          <h1 className="text-base font-normal">Login</h1>
        </div>

        {/* Logo Section */}
        <div className="border-b-2 border-black bg-white py-4 px-6 flex items-center justify-center gap-6">
          <div className="scale-[0.6] origin-center">
            <BookmasterLogo />
          </div>
          <h2 className="text-3xl font-normal">Login</h2>
        </div>

        {/* Form Section */}
        <div className="bg-[#c0c0c0] p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="username" className="text-sm w-20 text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 h-9 border-2 border-black rounded-none bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="password" className="text-sm w-20 text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 h-9 border-2 border-black rounded-none bg-white"
              />
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <Button
                onClick={handleLogin}
                className="w-24 h-9 border-2 border-black rounded-none bg-[#6b8e23] hover:bg-[#556b1d] text-white font-normal text-sm"
              >
                Login
              </Button>
              <Button
                onClick={handleCancel}
                className="w-24 h-9 border-2 border-black rounded-none bg-[#6b8e23] hover:bg-[#556b1d] text-white font-normal text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
