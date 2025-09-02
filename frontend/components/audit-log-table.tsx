"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Eye, Shield, User, Package, FileText, AlertTriangle, Settings } from "lucide-react"

// Audit log with only the 3 authorized personnel
const auditData = [
  {
    id: "AUD001",
    timestamp: "2024-01-15 14:30:25",
    user: "Captain Refa Jahan",
    userId: "USR002",
    action: "CREATE",
    resource: "Inventory Stock",
    resourceId: "INV005",
    details: "Added new stock: 5.56mm NATO - 1000 rounds",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Info",
    category: "Inventory",
  },
  {
    id: "AUD002",
    timestamp: "2024-01-15 10:15:42",
    user: "Sergeant Rafiq Islam",
    userId: "USR003",
    action: "UPDATE",
    resource: "Issue Record",
    resourceId: "ISS002",
    details: "Modified issue quantity from 100 to 150 rounds",
    ipAddress: "192.168.1.108",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Warning",
    category: "Issues",
  },
  {
    id: "AUD003",
    timestamp: "2024-01-15 09:45:18",
    user: "Lt Col Saima Tania",
    userId: "USR001",
    action: "LOGIN",
    resource: "Authentication",
    resourceId: "AUTH001",
    details: "Successful login from authorized device",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Info",
    category: "Authentication",
  },
  {
    id: "AUD004",
    timestamp: "2024-01-14 23:45:33",
    user: "Unknown User",
    userId: "UNKNOWN",
    action: "LOGIN_FAILED",
    resource: "Authentication",
    resourceId: "AUTH002",
    details: "Failed login attempt with username: admin_test",
    ipAddress: "203.0.113.45",
    userAgent: "curl/7.68.0",
    severity: "Critical",
    category: "Security",
  },
  {
    id: "AUD005",
    timestamp: "2024-01-14 16:20:11",
    user: "Captain Refa Jahan",
    userId: "USR002",
    action: "DELETE",
    resource: "Alert",
    resourceId: "ALT003",
    details: "Acknowledged and dismissed low stock alert",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Info",
    category: "Alerts",
  },
  {
    id: "AUD006",
    timestamp: "2024-01-14 14:55:07",
    user: "Lt Col Saima Tania",
    userId: "USR001",
    action: "CREATE",
    resource: "User Account",
    resourceId: "USR006",
    details: "System maintenance: Updated user permissions",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Info",
    category: "User Management",
  },
  {
    id: "AUD007",
    timestamp: "2024-01-14 11:30:44",
    user: "Sergeant Rafiq Islam",
    userId: "USR003",
    action: "EXPORT",
    resource: "Report",
    resourceId: "RPT002",
    details: "Generated and exported issue activity report (CSV)",
    ipAddress: "192.168.1.108",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "Info",
    category: "Reports",
  },
]

export function AuditLogTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filteredData = auditData.filter((item) => {
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesSeverity = severityFilter === "all" || item.severity.toLowerCase() === severityFilter.toLowerCase()
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            Warning
          </Badge>
        )
      case "info":
        return <Badge variant="default">Info</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return (
          <Badge variant="default" className="bg-green-500">
            CREATE
          </Badge>
        )
      case "UPDATE":
        return (
          <Badge variant="default" className="bg-blue-500">
            UPDATE
          </Badge>
        )
      case "DELETE":
        return <Badge variant="destructive">DELETE</Badge>
      case "LOGIN":
        return <Badge variant="secondary">LOGIN</Badge>
      case "LOGIN_FAILED":
        return <Badge variant="destructive">LOGIN_FAILED</Badge>
      case "EXPORT":
        return <Badge variant="outline">EXPORT</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "inventory":
        return <Package className="h-4 w-4 text-blue-500" />
      case "issues":
        return <FileText className="h-4 w-4 text-green-500" />
      case "authentication":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "security":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "user management":
        return <User className="h-4 w-4 text-orange-500" />
      case "alerts":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "reports":
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Log</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, details, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="issues">Issues</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="user management">User Management</SelectItem>
              <SelectItem value="alerts">Alerts</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {item.user !== "Unknown User"
                          ? item.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{item.user}</div>
                      <div className="text-xs text-muted-foreground">{item.userId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getActionBadge(item.action)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-sm">{item.category}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={item.details}>
                    {item.details}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.resource}: {item.resourceId}
                  </div>
                </TableCell>
                <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                <TableCell className="font-mono text-xs">{item.ipAddress}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
