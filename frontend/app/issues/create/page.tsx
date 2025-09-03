"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AddStockPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    ammoType: "",
    quantity: "",
    minThreshold: "",
    expiryDate: "",
    productionDate: "",
    assignedUser: "",
    manufacturer: "Bangladesh Ordnance Factories",
    lotNumber: "",
    storageLocation: "",
    unitCost: "",
    supplier: "",
    purchaseOrder: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateStockId = () => {
    const prefix = "INV"
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}${timestamp}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newStock = {
        id: generateStockId(),
        ...formData,
        quantity: Number.parseInt(formData.quantity),
        minThreshold: Number.parseInt(formData.minThreshold),
        unitCost: Number.parseFloat(formData.unitCost),
        status: Number.parseInt(formData.quantity) > Number.parseInt(formData.minThreshold) ? "Good" : "Low",
        lastUpdated: new Date().toISOString().split("T")[0],
      }

      console.log("Adding new stock:", newStock)

      toast({
        title: "Stock Added Successfully",
        description: `${formData.ammoType} has been added to inventory with ID: ${newStock.id}`,
      })

      router.push("/inventory")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Stock</h1>
          <p className="text-muted-foreground">Add new ammunition to the inventory system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ammoType">Ammunition Type *</Label>
                <Select value={formData.ammoType} onValueChange={(value) => handleInputChange("ammoType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ammunition type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5.56mm NATO">5.56mm NATO</SelectItem>
                    <SelectItem value="7.62mm NATO">7.62mm NATO</SelectItem>
                    <SelectItem value="9mm Parabellum">9mm Parabellum</SelectItem>
                    <SelectItem value=".50 BMG">.50 BMG</SelectItem>
                    <SelectItem value="12 Gauge Shotgun">12 Gauge Shotgun</SelectItem>
                    <SelectItem value="40mm Grenade">40mm Grenade</SelectItem>
                    <SelectItem value=".45 ACP">.45 ACP</SelectItem>
                    <SelectItem value="7.62x39mm">7.62x39mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="e.g., 1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minThreshold">Minimum Threshold *</Label>
                <Input
                  id="minThreshold"
                  type="number"
                  value={formData.minThreshold}
                  onChange={(e) => handleInputChange("minThreshold", e.target.value)}
                  placeholder="e.g., 200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost (USD) *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => handleInputChange("unitCost", e.target.value)}
                  placeholder="e.g., 2.50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionDate">Production Date *</Label>
                <Input
                  id="productionDate"
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => handleInputChange("productionDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                  placeholder="e.g., Bangladesh Ordnance Factories"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotNumber">Lot Number *</Label>
                <Input
                  id="lotNumber"
                  value={formData.lotNumber}
                  onChange={(e) => handleInputChange("lotNumber", e.target.value)}
                  placeholder="e.g., BOF-556-2024-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageLocation">Storage Location *</Label>
                <Select
                  value={formData.storageLocation}
                  onValueChange={(value) => handleInputChange("storageLocation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bunker A-1">Bunker A-1</SelectItem>
                    <SelectItem value="Bunker A-2">Bunker A-2</SelectItem>
                    <SelectItem value="Bunker B-1">Bunker B-1</SelectItem>
                    <SelectItem value="Bunker B-2">Bunker B-2</SelectItem>
                    <SelectItem value="Bunker C-1">Bunker C-1</SelectItem>
                    <SelectItem value="Bunker C-2">Bunker C-2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedUser">Assigned To *</Label>
                <Select
                  value={formData.assignedUser}
                  onValueChange={(value) => handleInputChange("assignedUser", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alpha Company">Alpha Company</SelectItem>
                    <SelectItem value="Bravo Company">Bravo Company</SelectItem>
                    <SelectItem value="Charlie Company">Charlie Company</SelectItem>
                    <SelectItem value="Delta Company">Delta Company</SelectItem>
                    <SelectItem value="Echo Company">Echo Company</SelectItem>
                    <SelectItem value="Foxtrot Company">Foxtrot Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                  placeholder="e.g., Defense Procurement Agency"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseOrder">Purchase Order</Label>
                <Input
                  id="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={(e) => handleInputChange("purchaseOrder", e.target.value)}
                  placeholder="e.g., PO-2024-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this stock..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Adding Stock..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Stock
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/inventory">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
