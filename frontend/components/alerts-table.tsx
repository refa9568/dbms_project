"use client"

import { useState, useEffect } from "react"
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

// API functions for alerts
const fetchAlerts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/alerts');
    const data = await response.json();
    return data.map((alert: any) => ({
      id: alert.alert_id,
      stockId: alert.inventory_stock_id,
      type: alert.type,
      severity: alert.severity,
      message: alert.alert_message,
      dateCreated: new Date(alert.alert_date).toLocaleString(),
      status: alert.status,
      acknowledgedBy: alert.acknowledged_by_info,
      acknowledgedDate: alert.acknowledged_date ? new Date(alert.acknowledged_date).toLocaleString() : null,
      actionRequired: alert.action_required,
      estimatedImpact: alert.estimated_impact,
      isSystemGenerated: alert.is_system_generated,
      lotNumber: alert.lot_number
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

const acknowledgeAlert = async (alertId: string, userId: number, notes?: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, notes })
    });
    return response.ok;
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return false;
  }
};

const resolveAlert = async (alertId: string, userId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    return response.ok;
  } catch (error) {
    console.error('Error resolving alert:', error);
    return false;
  }
};

const deleteAlert = async (alertId: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/alerts/${alertId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting alert:', error);
    return false;
  }
};

const dismissAlert = async (alertId: string, userId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/alerts/${alertId}/dismiss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    return response.ok;
  } catch (error) {
    console.error('Error dismissing alert:', error);
    return false;
  }
};

const checkSystemAlerts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/alerts/check', {
      method: 'POST'
    });
    const data = await response.json();
    return data.alerts;
  } catch (error) {
    console.error('Error checking system alerts:', error);
    return [];
  }
};

export function AlertsTable() {
  const [alertsData, setAlertsData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAckDialogOpen, setIsAckDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [ackNotes, setAckNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch alerts on component mount
  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setIsLoading(true)
    const alerts = await fetchAlerts()
    setAlertsData(alerts)
    setIsLoading(false)
  }

  // Generate system alerts by checking with backend
  const generateSystemAlerts = async () => {
    try {
      setIsLoading(true)
      const newAlerts = await checkSystemAlerts()
      if (newAlerts && newAlerts.length > 0) {
        await loadAlerts() // Reload all alerts
        toast({
          title: "System Alerts Generated",
          description: `${newAlerts.length} new alert(s) generated based on current inventory data.`,
        })
      } else {
        toast({
          title: "No New Alerts",
          description: "No new system alerts were generated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate system alerts.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  const handleDismiss = async (item: any) => {
    if (confirm(`Are you sure you want to dismiss alert ${item.id}?`)) {
      try {
        // Currently using user_id 1 as example - should be replaced with actual logged-in user's ID
        const success = await dismissAlert(item.id, 1)
        if (success) {
          await loadAlerts() // Reload alerts to get updated data
          toast({
            title: "Alert Dismissed",
            description: `Alert ${item.id} has been dismissed.`,
          })
        } else {
          throw new Error("Failed to dismiss alert")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to dismiss alert.",
          variant: "destructive",
        })
      }
    }
  }

  const handleResolve = async (item: any) => {
    try {
      // Currently using user_id 1 as example - should be replaced with actual logged-in user's ID
      const success = await resolveAlert(item.id, 1)
      if (success) {
        await loadAlerts() // Reload alerts to get updated data
        toast({
          title: "Alert Resolved",
          description: `Alert ${item.id} has been resolved.`,
        })
      } else {
        throw new Error("Failed to resolve alert")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert.",
        variant: "destructive",
      })
    }
  }

  const handleRemove = async (item: any) => {
    if (confirm(`Are you sure you want to permanently remove alert ${item.id}?`)) {
      try {
        const success = await deleteAlert(item.id)
        if (success) {
          await loadAlerts() // Reload alerts to get updated data
          toast({
            title: "Alert Removed",
            description: `Alert ${item.id} has been permanently removed.`,
          })
        } else {
          throw new Error("Failed to remove alert")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove alert.",
          variant: "destructive",
        })
      }
    }
  }

  const submitAcknowledgment = async () => {
    if (selectedItem) {
      try {
        // Currently using user_id 1 as example - should be replaced with actual logged-in user's ID
        const success = await acknowledgeAlert(selectedItem.id, 1, ackNotes)
        if (success) {
          await loadAlerts() // Reload alerts to get updated data
          toast({
            title: "Alert Acknowledged",
            description: `Alert ${selectedItem.id} has been acknowledged.`,
          })
          setIsAckDialogOpen(false)
          setAckNotes("")
        } else {
          throw new Error("Failed to acknowledge alert")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to acknowledge alert.",
          variant: "destructive",
        })
      }
    }
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
