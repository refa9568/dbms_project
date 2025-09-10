"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export function Header() {
  const { logout } = useAuth();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <Button 
        variant="ghost" 
        onClick={logout}
      >
        Logout
      </Button>
    </header>
  )
}
