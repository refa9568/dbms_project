"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { InventoryForm } from "@/components/forms/inventory-form"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  inventory_stock_id: number
  user_id: number
  quantity: number
  lot_number: string
  stock_date: string
  expiry_date: string
}

export function InventoryDataTable() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/inventory")
      if (response.ok) {
        const inventory = await response.json()
        setData(inventory)
      } else {
        throw new Error("Failed to fetch inventory")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatus = (expiryDate: string, quantity: number) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (quantity <= 100) return "Critical"
    if (quantity <= 300) return "Low"
    if (daysUntilExpiry <= 365) return "Expiring"
    return "Good"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Good":
        return (
          <Badge variant="default" className="bg-green-500">
            Good
          </Badge>
        )
      case "Low":
        return <Badge variant="secondary">Low</Badge>
      case "Expiring":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Expiring
          </Badge>
        )
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredData = data.filter((item) => {
    const status = getStatus(item.expiry_date, item.quantity)
    const searchLower = searchTerm.toLowerCase()

    return (
      item.inventory_stock_id.toString().includes(searchLower) ||
      item.user_id.toString().includes(searchLower) ||
      item.quantity.toString().includes(searchLower) ||
      item.lot_number.toLowerCase().includes(searchLower) ||
      item.stock_date.toLowerCase().includes(searchLower) ||
      item.expiry_date.toLowerCase().includes(searchLower) ||
      status.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`http://localhost:3001/api/inventory/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item deleted successfully",
        })
        fetchData()
      } else {
        throw new Error("Failed to delete item")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Inventory Stock</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <InventoryForm
                onSuccess={() => {
                  setIsAddDialogOpen(false)
                  fetchData()
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Lot Number</TableHead>
              <TableHead>Stock Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const status = getStatus(item.expiry_date, item.quantity)
              return (
                <TableRow key={item.inventory_stock_id}>
                  <TableCell className="font-medium">{item.inventory_stock_id}</TableCell>
                  <TableCell>{item.user_id}</TableCell>
                  <TableCell>{item.quantity.toLocaleString()}</TableCell>
                  <TableCell>{item.lot_number}</TableCell>
                  <TableCell>{item.stock_date}</TableCell>
                  <TableCell>{item.expiry_date}</TableCell>
                  <TableCell>{getStatusBadge(status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedItem(item)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.inventory_stock_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
            </DialogHeader>
            <InventoryForm
              mode="edit"
              editData={selectedItem || undefined}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedItem(null)
                fetchData()
              }}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedItem(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
