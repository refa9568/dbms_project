"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Report {
  id: number
  name: string
  type: string
  dateGenerated: string
  generatedBy: string
  period: string
  format: string
  status: string
  fileSize: string
  description?: string
  retentionDate: string
  downloadCount: number
  lastAccessed: string | null
  isUploaded: boolean
}

interface UploadData {
  name: string
  type: string
  period: string
  description: string
}
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
import { Search, Filter, Download, Eye, FileText, BarChart3, Calendar, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// API functions for reports
const fetchReports = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/reports');
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
    return data.map((report: any) => ({
      id: report.report_id,
      name: report.name,
      type: report.type,
      dateGenerated: new Date(report.date_generated).toLocaleString(),
      generatedBy: report.generated_by_appointment,
      period: report.period,
      format: report.format,
      status: report.status,
      fileSize: report.file_size,
      description: report.description,
      retentionDate: report.retention_date,
      downloadCount: report.download_count,
      lastAccessed: report.last_accessed ? new Date(report.last_accessed).toLocaleString() : null,
      isUploaded: report.is_uploaded,
    }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export function ReportsTable() {
  const [reportsData, setReportsData] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState<UploadData>({
    name: "",
    type: "Custom",
    period: "",
    description: ""
  })
  const { toast } = useToast()

  // Fetch reports on component mount
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const reports = await fetchReports()
      setReportsData(reports)
    } catch (error) {
      console.error('Error loading reports:', error)
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

    const filteredReports = reportsData.filter((item) => {
      const matchesSearch = searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || item.type === typeFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
    
    const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "inventory":
        return <Badge variant="default">Inventory</Badge>
      case "issues":
        return <Badge variant="secondary">Issues</Badge>
      case "alerts":
        return <Badge variant="destructive">Alerts</Badge>
      case "audit":
        return <Badge variant="outline">Audit</Badge>
      case "analytics":
        return (
          <Badge variant="default" className="bg-purple-500">
            Analytics
          </Badge>
        )
      case "security":
        return (
          <Badge variant="default" className="bg-red-600">
            Security
          </Badge>
        )
      case "custom":
        return (
          <Badge variant="default" className="bg-blue-600">
            Custom
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "inventory":
        return <BarChart3 className="h-4 w-4 text-blue-500" />
      case "issues":
        return <FileText className="h-4 w-4 text-green-500" />
      case "alerts":
        return <Calendar className="h-4 w-4 text-red-500" />
      case "security":
        return <FileText className="h-4 w-4 text-red-600" />
      case "custom":
        return <Upload className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reports/${item.id}/download`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${item.name}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Refresh reports data to get updated download count
      await loadReports()

      toast({
        title: "Download Started",
        description: `Downloading ${item.name} (${item.fileSize})`,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setUploadFile(file)
        setUploadData((prev) => ({ ...prev, name: file.name.replace(".pdf", "") }))
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUploadSubmit = async () => {
    if (!uploadFile || !uploadData.name || !uploadData.period) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('metadata', JSON.stringify({
      name: uploadData.name,
      type: uploadData.type,
      date_generated: new Date().toISOString(),
      period: uploadData.period,
      format: "PDF",
      status: "Active",
      file_size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
      description: uploadData.description || "Uploaded PDF report",
      retention_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      download_count: 0,
      last_accessed: null,
      is_uploaded: true
    }))

    try {
      const response = await fetch('http://localhost:3001/api/reports/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      
      await loadReports() // Refresh the reports list
      setIsUploadDialogOpen(false)
      setUploadFile(null)
      setUploadData({ 
        name: "", 
        type: "Custom", 
        period: "", 
        description: ""
      })

      toast({
        title: "Report Uploaded Successfully",
        description: `${uploadData.name} has been uploaded successfully`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload report",
        variant: "destructive",
      })
    }
  }

  const isRetentionExpired = (retentionDate: string) => {
    return new Date(retentionDate) < new Date()
  }

  const getDaysUntilExpiry = (retentionDate: string) => {
    const today = new Date()
    const expiry = new Date(retentionDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Generated Reports</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Reports are retained for 3 years from generation date. Expired reports are automatically archived.
        </div>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by name, generator, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="issues">Issues</SelectItem>
              <SelectItem value="alerts">Alerts</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Generated By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Retention</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((item: Report) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.id}
                    {item.isUploaded && (
                      <Badge variant="outline" className="text-xs">
                        UPLOADED
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.format} • {item.fileSize} • {item.downloadCount} downloads
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(item.type)}</TableCell>
                <TableCell>{item.generatedBy}</TableCell>
                <TableCell>{item.dateGenerated}</TableCell>
                <TableCell>{item.period}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{item.retentionDate}</div>
                    <div className="text-xs text-muted-foreground">
                      {getDaysUntilExpiry(item.retentionDate) > 0
                        ? `${getDaysUntilExpiry(item.retentionDate)} days left`
                        : "Expired"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {item.status === "Completed" && !isRetentionExpired(item.retentionDate) && (
                      <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleDownload(item)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload PDF Report</DialogTitle>
              <DialogDescription>Upload a PDF report to the system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="upload-file">PDF File *</Label>
                <Input id="upload-file" type="file" accept=".pdf" onChange={handleFileUpload} />
                {uploadFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-name">Report Name *</Label>
                <Input
                  id="upload-name"
                  value={uploadData.name}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly Security Report"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-type">Report Type</Label>
                <Select
                  value={uploadData.type}
                  onValueChange={(value) => setUploadData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="Issues">Issues</SelectItem>
                    <SelectItem value="Alerts">Alerts</SelectItem>
                    <SelectItem value="Audit">Audit</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-period">Period *</Label>
                <Input
                  id="upload-period"
                  value={uploadData.period}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, period: e.target.value }))}
                  placeholder="e.g., January 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-description">Description</Label>
                <Input
                  id="upload-description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the report"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadSubmit}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>Complete information for report {selectedItem?.id}</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Report ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <div className="mt-1">{getTypeBadge(selectedItem.type)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Generated By</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.generatedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Generation Date</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.dateGenerated}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Period Covered</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.period}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">File Format</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.format}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">File Size</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.fileSize}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Download Count</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.downloadCount} times</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Retention Until</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.retentionDate} ({getDaysUntilExpiry(selectedItem.retentionDate)} days remaining)
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Accessed</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.lastAccessed || "Never"}</p>
                  </div>
                </div>
                {selectedItem.isUploaded && (
                  <div>
                    <Label className="text-sm font-medium">Source</Label>
                    <p className="text-sm text-muted-foreground">Uploaded by user</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              {selectedItem?.status === "Completed" && !isRetentionExpired(selectedItem.retentionDate) && (
                <Button onClick={() => handleDownload(selectedItem)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
