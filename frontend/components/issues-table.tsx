"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Edit, Eye } from "lucide-react"

// Mock issues data
const issuesData = [
  {
    id: "ISS001",
    stockId: "INV001",
    ammoType: "5.56mm NATO",
    issuedTo: "Sgt. Shorif",
    unit: "Radio Company",
    quantity: 200,
    issueDate: "2024-01-15",
    purpose: "Training Exercise",
    status: "Completed",
    issuedBy: "QM Refa Jahan",
  },
  {
    id: "ISS002",
    stockId: "INV002",
    ammoType: "7.62mm NATO",
    issuedTo: "Lt. Smith",
    unit: "RR Company",
    quantity: 150,
    issueDate: "2024-01-14",
    purpose: "Live Fire Exercise",
    status: "Pending",
    issuedBy: "Sgt Kamal",
  },
  {
    id: "ISS003",
    stockId: "INV003",
    ammoType: "9mm Parabellum",
    issuedTo: "Cpl. Monir",
    unit: "Charlie Company",
    quantity: 100,
    issueDate: "2024-01-13",
    purpose: "Qualification",
    status: "Completed",
    issuedBy: "QM Refa Jahan",
  },
]

export function IssuesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = issuesData.filter((item) => {
    const matchesSearch =
      item.ammoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Records</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by issue ID, ammo type, or recipient..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue ID</TableHead>
              <TableHead>Ammo Type</TableHead>
              <TableHead>Issued To</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
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
                    <div className="font-medium">{item.issuedTo}</div>
                    <div className="text-xs text-muted-foreground">by {item.issuedBy}</div>
                  </div>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.quantity.toLocaleString()}</TableCell>
                <TableCell>{item.issueDate}</TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
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
