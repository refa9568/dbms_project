"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Edit, Trash2, Eye } from "lucide-react"

// Mock inventory data
const inventoryData = [
  {
    id: "INV001",
    ammoType: "5.56mm NATO",
    quantity: 2500,
    minThreshold: 500,
    expiryDate: "2025-12-31",
    productionDate: "2023-01-15",
    assignedUser: "Alpha Company",
    status: "Good",
    lastUpdated: "2024-01-15",
  },
  {
    id: "INV002",
    ammoType: "7.62mm NATO",
    quantity: 150,
    minThreshold: 200,
    expiryDate: "2024-06-30",
    productionDate: "2022-03-10",
    assignedUser: "Bravo Company",
    status: "Low",
    lastUpdated: "2024-01-14",
  },
  {
    id: "INV003",
    ammoType: "9mm Parabellum",
    quantity: 800,
    minThreshold: 300,
    expiryDate: "2024-03-15",
    productionDate: "2021-08-20",
    assignedUser: "Charlie Company",
    status: "Expiring",
    lastUpdated: "2024-01-13",
  },
  {
    id: "INV004",
    ammoType: ".50 BMG",
    quantity: 45,
    minThreshold: 100,
    expiryDate: "2026-01-31",
    productionDate: "2023-06-05",
    assignedUser: "Delta Company",
    status: "Critical",
    lastUpdated: "2024-01-12",
  },
]

export function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.ammoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
        return (
          <Badge variant="default" className="bg-green-500">
            Good
          </Badge>
        )
      case "low":
        return <Badge variant="secondary">Low</Badge>
      case "expiring":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Expiring
          </Badge>
        )
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Stock</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ammo type or stock ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="expiring">Expiring</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock ID</TableHead>
              <TableHead>Ammo Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.ammoType}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.quantity.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Min: {item.minThreshold.toLocaleString()}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.expiryDate}</TableCell>
                <TableCell>{item.assignedUser}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
