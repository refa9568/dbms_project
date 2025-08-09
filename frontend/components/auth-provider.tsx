"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  name: string
  rank: string
  role: "CO" | "QM" | "NCO"
  appointment: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: Record<string, User> = {
  admin: {
    id: "1",
    username: "admin",
    name: "John Smith",
    rank: "Major",
    role: "CO",
    appointment: "Commanding Officer",
  },
  qm: {
    id: "2",
    username: "qm",
    name: "Sarah Johnson",
    rank: "Captain",
    role: "QM",
    appointment: "Quartermaster",
  },
  nco: {
    id: "3",
    username: "nco",
    name: "Mike Wilson",
    rank: "Sergeant",
    role: "NCO",
    appointment: "Ammunition NCO",
  },
}

const mockPasswords: Record<string, string> = {
  admin: "admin123",
  qm: "qm123",
  nco: "nco123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("ebek-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (mockUsers[username] && mockPasswords[username] === password) {
      const user = mockUsers[username]
      setUser(user)
      localStorage.setItem("ebek-user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ebek-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
