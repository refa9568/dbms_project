"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  inventory_stock_id: number
  quantity: number
  lot_number: string
  user_id: number
}

interface AlertFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AlertForm({ onSuccess, onCancel }: AlertFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [formData, setFormData] = useState({
    inventory_stock_id: "",
    alert_message: "",
  })
  const { toast } = useToast()

  // Fetch inventory items on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/inventory")
        if (response.ok) {
          const inventory = await response.json()
          setInventoryItems(inventory)
        }
      } catch (error) {
        console.error("Error fetching inventory:", error)
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        })
      }
    }

    fetchInventory()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.inventory_stock_id || !formData.alert_message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3001/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_stock_id: Number.parseInt(formData.inventory_stock_id),
          alert_message: formData.alert_message.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Alert created successfully",
        })

        // Reset form
        setFormData({
          inventory_stock_id: "",
          alert_message: "",
        })

        onSuccess?.()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create alert")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create alert",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Create Alert
        </CardTitle>
        <CardDescription>Create a new alert for inventory stock</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    ID: {item.inventory_stock_id} - {item.lot_number} ({item.quantity} units)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alert_message">Alert Message *</Label>
            <Textarea
              id="alert_message"
              value={formData.alert_message}
              onChange={(e) => setFormData((prev) => ({ ...prev, alert_message: e.target.value }))}
              placeholder="Enter alert message..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">Alert date will be automatically set to current timestamp</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Alert...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Alert
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
