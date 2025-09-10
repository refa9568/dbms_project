"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  inventory_stock_id: number
  quantity: number
  lot_number: string
  user_id: number
}

interface AmmoTypeLine {
  A_T_L_id: number
  // Add other fields as needed
}

interface IssueFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editData?: {
    issue_id: number
    inventory_stock_id: number
    issue_quantity: number
    issue_date: string
    A_T_L_id?: number
  }
  mode?: 'add' | 'edit'
}

export function IssueForm({ onSuccess, onCancel, editData, mode = 'add' }: IssueFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [ammoTypeLines, setAmmoTypeLines] = useState<AmmoTypeLine[]>([])
  const [issueDate, setIssueDate] = useState<Date | undefined>(editData ? new Date(editData.issue_date) : undefined)
  const [formData, setFormData] = useState({
    inventory_stock_id: editData ? editData.inventory_stock_id.toString() : "",
    issue_quantity: editData ? editData.issue_quantity.toString() : "",
    A_T_L_id: editData?.A_T_L_id ? editData.A_T_L_id.toString() : "",
  })
  const { toast } = useToast()

  // Fetch inventory items and ammo type lines on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryResponse, ammoResponse] = await Promise.all([
          fetch("http://localhost:3001/api/inventory"),
          // You'll need to add this endpoint to your server
          fetch("http://localhost:3001/api/ammo-type-lines"),
        ])

        if (inventoryResponse.ok) {
          const inventory = await inventoryResponse.json()
          setInventoryItems(inventory)
        }

        // For now, we'll use mock data for ammo type lines
        setAmmoTypeLines([{ A_T_L_id: 1 }, { A_T_L_id: 2 }, { A_T_L_id: 3 }, { A_T_L_id: 4 }, { A_T_L_id: 5 }])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.inventory_stock_id || !formData.issue_quantity || !issueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const url = mode === 'edit' 
        ? `http://localhost:3001/api/issues/${editData?.issue_id}`
        : "http://localhost:3001/api/issues"

      const response = await fetch(url, {
        method: mode === 'edit' ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_stock_id: Number.parseInt(formData.inventory_stock_id),
          user_id: 1, // Auto-populated from logged in user
          issue_date: format(issueDate, "yyyy-MM-dd"),
          issue_quantity: Number.parseInt(formData.issue_quantity),
          A_T_L_id: formData.A_T_L_id ? Number.parseInt(formData.A_T_L_id) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Issue created successfully",
        })

        // Reset form
        setFormData({
          inventory_stock_id: "",
          issue_quantity: "",
          A_T_L_id: "",
        })
        setIssueDate(undefined)

        onSuccess?.()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create issue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create issue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Issue</CardTitle>
        <CardDescription>Issue ammunition from inventory stock</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventory_stock_id">Inventory Stock *</Label>
              <Select
                value={formData.inventory_stock_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, inventory_stock_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inventory stock" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.inventory_stock_id} value={item.inventory_stock_id.toString()}>
                      ID: {item.inventory_stock_id} - {item.lot_number} ({item.quantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !issueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_quantity">Issue Quantity *</Label>
              <Input
                id="issue_quantity"
                type="number"
                min="1"
                value={formData.issue_quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, issue_quantity: e.target.value }))}
                placeholder="Enter quantity to issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="A_T_L_id">A_T_L ID</Label>
              <Select
                value={formData.A_T_L_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, A_T_L_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select A_T_L ID (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {ammoTypeLines.map((item) => (
                    <SelectItem key={item.A_T_L_id} value={item.A_T_L_id.toString()}>
                      A_T_L ID: {item.A_T_L_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Issue...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Issue
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
