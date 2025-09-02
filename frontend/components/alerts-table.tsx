"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Filter, CheckCircle, X, Eye, AlertTriangle, Clock, Info, Trash2, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Enhanced alerts data with system-generated alerts
const initialAlertsData = [
  {
    id: "ALT001",
    stockId: "INV004",
    type: "Low Stock",
    severity: "Critical",
    message: ".50 BMG ammunition below minimum threshold (45/100)",
    dateCreated: "2024-01-15 14:30",
    status: "Open",
    acknowledgedBy: null,
    acknowledgedDate: null,
    ammoType: ".50 BMG",
    actionRequired: "Immediate restocking required",
    estimatedImpact: "High - Training operations may be affected",
    isSystemGenerated: true,
  },
  {
    id: "ALT002",
    stockId: "INV002",
    type: "Low Stock",
    severity: "High",
    message: "7.62mm NATO ammunition below minimum threshold (150/200)",
    dateCreated: "2024-01-15 10:15",
    status: "Open",
    acknowledgedBy: null,
    acknowledgedDate: null,
    ammoType: "7.62mm NATO",
    actionRequired: "Schedule restocking within 48 hours",
    estimatedImpact: "Medium - May affect upcoming exercises",
    isSystemGenerated: true,
  },
  {
    id: "ALT003",
    stockId: "INV003",
    type: "Expiry Warning",
    severity: "Medium",
    message: "9mm Parabellum ammunition expires in 30 days (2024-03-15)",
    dateCreated: "2024-01-14 16:45",
    status: "Acknowledged",
    acknowledgedBy: "Captain Refa Jahan",
    acknowledgedDate: "2024-01-15 09:00",
    ammoType: "9mm Parabellum",
    actionRequired: "Plan usage or disposal before expiry",
    estimatedImpact: "Low - Sufficient time for action",
    isSystemGenerated: true,
  },
  {
    id: "ALT004",
    stockId: "INV001",
    type: "Stock Update",
    severity: "Low",
    message: "5.56mm NATO ammunition successfully restocked (+1000 rounds)",
    dateCreated: "2024-01-13 11:20",
    status: "Resolved",
    acknowledgedBy: "Sergeant Rafiq Islam",
    acknowledgedDate: "2024-01-13 11:25",
    ammoType: "5.56mm NATO",
    actionRequired: "No action required",
    estimatedImpact: "Positive - Stock levels restored",
    isSystemGenerated: true,
  },
  {
    id: "ALT005",
    stockId: "N/A",
    type: "Security Alert",
    severity: "Critical",
    message: "Multiple failed login attempts detected for user: unknown_user",
    dateCreated: "2024-01-12 23:45",
    status: "Acknowledged",
    acknowledgedBy: "Lt Col Saima Tania",
    acknowledgedDate: "2024-01-13 08:00",
    ammoType: "N/A",
    actionRequired: "Monitor security logs and review access controls",
    estimatedImpact: "High - Potential security breach attempt",
    isSystemGenerated: true,
  },
]

// Mock inventory data for generating alerts
const inventoryData = [
  { id: "INV001", ammoType: "5.56mm NATO", quantity: 2500, minThreshold: 500 },
  { id: "INV002", ammoType: "7.62mm NATO", quantity: 150, minThreshold: 200 },
  { id: "INV003", ammoType: "9mm Parabellum", quantity: 800, minThreshold: 300, expiryDate: "2024-03-15" },
  { id: "INV004", ammoType: ".50 BMG", quantity: 45, minThreshold: 100 },
  { id: "INV005", ammoType: "12 Gauge Shotgun", quantity: 600, minThreshold: 200 },
]

export function AlertsTable() {
  const [alertsData, setAlertsData] = useState(initialAlertsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAckDialogOpen, setIsAckDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [ackNotes, setAckNotes] = useState("")
  const { toast } = useToast()

  // Generate system alerts based on inventory data
  const generateSystemAlerts = () => {
    const newAlerts: any[] = []
    const currentDate = new Date()

    inventoryData.forEach((item) => {
      // Low stock alerts
      if (item.quantity < item.minThreshold) {
        const severity = item.quantity < item.minThreshold * 0.5 ? "Critical" : "High"
        const alertId = `ALT${Date.now()}_${item.id}`

        // Check if alert already exists
        const existingAlert = alertsData.find(
          (alert) => alert.stockId === item.id && alert.type === "Low Stock" && alert.status === "Open",
        )

        if (!existingAlert) {
          newAlerts.push({
            id: alertId,
            stockId: item.id,
            type: "Low Stock",
            severity,
            message: `${item.ammoType} ammunition below minimum threshold (${item.quantity}/${item.minThreshold})`,
            dateCreated: currentDate.toISOString().slice(0, 16).replace("T", " "),
            status: "Open",
            acknowledgedBy: null,
            acknowledgedDate: null,
            ammoType: item.ammoType,
            actionRequired:
              severity === "Critical" ? "Immediate restocking required" : "Schedule restocking within 48 hours",
            estimatedImpact:
              severity === "Critical" ? "High - Operations may be affected" : "Medium - May affect upcoming activities",
            isSystemGenerated: true,
          })
        }
      }

      // Expiry warnings
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
          const alertId = `ALT${Date.now()}_EXP_${item.id}`

          const existingAlert = alertsData.find(
            (alert) => alert.stockId === item.id && alert.type === "Expiry Warning" && alert.status !== "Resolved",
          )

          if (!existingAlert) {
            newAlerts.push({
              id: alertId,
              stockId: item.id,
              type: "Expiry Warning",
              severity: daysUntilExpiry <= 30 ? "High" : "Medium",
              message: `${item.ammoType} ammunition expires in ${daysUntilExpiry} days (${item.expiryDate})`,
              dateCreated: currentDate.toISOString().slice(0, 16).replace("T", " "),
              status: "Open",
              acknowledgedBy: null,
              acknowledgedDate: null,
              ammoType: item.ammoType,
              actionRequired: "Plan usage or disposal before expiry",
              estimatedImpact:
                daysUntilExpiry <= 30 ? "Medium - Action needed soon" : "Low - Sufficient time for action",
              isSystemGenerated: true,
            })
          }
        }
      }
    })

    if (newAlerts.length > 0) {
      setAlertsData((prev) => [...newAlerts, ...prev])
      toast({
        title: "System Alerts Generated",
        description: `${newAlerts.length} new alert(s) generated based on current inventory data.`,
      })
    }
  }

  const filteredData = alertsData.filter((item) => {
    const matchesSearch =
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ammoType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSeverity = severityFilter === "all" || item.severity.toLowerCase() === severityFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        )
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge variant="destructive">Open</Badge>
      case "acknowledged":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Acknowledged
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            Resolved
          </Badge>
        )
      case "dismissed":
        return <Badge variant="secondary">Dismissed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "low stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "expiry warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "stock update":
        return <Info className="h-4 w-4 text-blue-500" />
      case "security alert":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleAcknowledge = (item: any) => {
    setSelectedItem(item)
    setIsAckDialogOpen(true)
  }

  const handleDismiss = (item: any) => {
    if (confirm(`Are you sure you want to dismiss alert ${item.id}?`)) {
      setAlertsData((prev) =>
        prev.map((alert) =>
          alert.id === item.id
            ? {
                ...alert,
                status: "Dismissed",
                acknowledgedBy: "Current User",
                acknowledgedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
              }
            : alert,
        ),
      )
      toast({
        title: "Alert Dismissed",
        description: `Alert ${item.id} has been dismissed.`,
      })
    }
  }

  const handleResolve = (item: any) => {
    setAlertsData((prev) =>
      prev.map((alert) =>
        alert.id === item.id
          ? {
              ...alert,
              status: "Resolved",
              acknowledgedBy: "Current User",
              acknowledgedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : alert,
      ),
    )
    toast({
      title: "Alert Resolved",
      description: `Alert ${item.id} has been resolved.`,
    })
  }

  const handleRemove = (item: any) => {
    if (confirm(`Are you sure you want to permanently remove alert ${item.id}?`)) {
      setAlertsData((prev) => prev.filter((alert) => alert.id !== item.id))
      toast({
        title: "Alert Removed",
        description: `Alert ${item.id} has been permanently removed.`,
      })
    }
  }

  const submitAcknowledgment = () => {
    if (selectedItem) {
      setAlertsData((prev) =>
        prev.map((alert) =>
          alert.id === selectedItem.id
            ? {
                ...alert,
                status: "Acknowledged",
                acknowledgedBy: "Current User",
                acknowledgedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
                notes: ackNotes,
              }
            : alert,
        ),
      )
      toast({
        title: "Alert Acknowledged",
        description: `Alert ${selectedItem.id} has been acknowledged.`,
      })
    }
    setIsAckDialogOpen(false)
    setAckNotes("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>System Alerts</CardTitle>
          <Button onClick={generateSystemAlerts} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate System Alerts
          </Button>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts by message, type, ID, or ammo type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
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
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Stock ID</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.id}
                    {item.isSystemGenerated && (
                      <Badge variant="outline" className="text-xs">
                        AUTO
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    {item.type}
                  </div>
                </TableCell>
                <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={item.message}>
                    {item.message}
                  </div>
                  {item.acknowledgedBy && (
                    <div className="text-xs text-muted-foreground mt-1">Ack by: {item.acknowledgedBy}</div>
                  )}
                </TableCell>
                <TableCell>{item.stockId}</TableCell>
                <TableCell>{item.dateCreated}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {item.status === "Open" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleAcknowledge(item)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDismiss(item)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {item.status === "Acknowledged" && (
                      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleResolve(item)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemove(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alert Details</DialogTitle>
              <DialogDescription>Complete information for alert {selectedItem?.id}</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Alert ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Stock ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.stockId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedItem.type)}
                      <span className="text-sm text-muted-foreground">{selectedItem.type}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Severity</Label>
                    <div className="mt-1">{getSeverityBadge(selectedItem.severity)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Message</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.message}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action Required</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.actionRequired}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estimated Impact</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.estimatedImpact}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date Created</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.dateCreated}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>
                {selectedItem.acknowledgedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Acknowledged By</Label>
                      <p className="text-sm text-muted-foreground">{selectedItem.acknowledgedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Acknowledged Date</Label>
                      <p className="text-sm text-muted-foreground">{selectedItem.acknowledgedDate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Acknowledge Dialog */}
        <Dialog open={isAckDialogOpen} onOpenChange={setIsAckDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Acknowledge Alert</DialogTitle>
              <DialogDescription>Acknowledge alert {selectedItem?.id} and add notes</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="ack-notes">Acknowledgment Notes</Label>
                <Textarea
                  id="ack-notes"
                  value={ackNotes}
                  onChange={(e) => setAckNotes(e.target.value)}
                  placeholder="Add notes about the acknowledgment or actions taken..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAckDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitAcknowledgment}>Acknowledge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
