"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface InventoryFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editData?: {
    inventory_stock_id: number
    quantity: number
    lot_number: string
    stock_date: string
    expiry_date: string
  }
  mode?: 'add' | 'edit'
}

export function InventoryForm({ onSuccess, onCancel, editData, mode = 'add' }: InventoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [stockDate, setStockDate] = useState<Date | undefined>(editData ? new Date(editData.stock_date) : undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(editData ? new Date(editData.expiry_date) : undefined)
  const [formData, setFormData] = useState({
    quantity: editData ? editData.quantity.toString() : "",
    lot_number: editData ? editData.lot_number : "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.quantity || !formData.lot_number || !stockDate || !expiryDate) {
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
        ? `http://localhost:3001/api/inventory/${editData?.inventory_stock_id}`
        : "http://localhost:3001/api/inventory"

      const response = await fetch(url, {
        method: mode === 'edit' ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, // Auto-populated from logged in user
          quantity: Number.parseInt(formData.quantity),
          lot_number: formData.lot_number,
          stock_date: format(stockDate, "yyyy-MM-dd"),
          expiry_date: format(expiryDate, "yyyy-MM-dd"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Inventory item added successfully",
        })

        // Reset form
        setFormData({
          quantity: "",
          lot_number: "",
        })
        setStockDate(undefined)
        setExpiryDate(undefined)

        onSuccess?.()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to add inventory item")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add inventory item",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit' : 'Add'} Inventory Item</CardTitle>
        <CardDescription>{mode === 'edit' ? 'Modify existing' : 'Add new'} ammunition stock to inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number *</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, lot_number: e.target.value }))}
                placeholder="Enter lot number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_date">Stock Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !stockDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {stockDate ? format(stockDate, "PPP") : "Pick stock date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={stockDate} onSelect={setStockDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Pick expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Item...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add to Inventory
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
