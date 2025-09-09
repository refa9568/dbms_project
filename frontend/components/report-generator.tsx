"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "./auth-provider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload } from "lucide-react"

export function ReportGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    type: "Custom",
    period: "",
    description: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0]
      if (uploadedFile.type === "application/pdf") {
        setFile(uploadedFile)
        // Auto-fill name from filename
        setFormData(prev => ({
          ...prev,
          name: uploadedFile.name.replace(".pdf", "")
        }))
      } else {
        alert("Please upload a PDF file only")
        e.target.value = ""
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !formData.name || !formData.type || !formData.period) {
      alert("Please fill in all required fields")
      return
    }

    setIsUploading(true)
    try {
      const submitData = new FormData()
      submitData.append('pdf', file)
      submitData.append('name', formData.name)
      submitData.append('type', formData.type)
      submitData.append('period', formData.period)
      submitData.append('description', formData.description)
      submitData.append('generated_by_appointment', user?.appointment || '')

      const response = await fetch('http://localhost:3001/api/reports/upload', {
        method: 'POST',
        body: submitData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      // Clear form after successful upload
      setFile(null)
      setFormData({
        name: "",
        type: "Custom",
        period: "",
        description: ""
      })
      alert("Report uploaded successfully!")
    } catch (error) {
      console.error('Upload error:', error)
      alert("Failed to upload report")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Report
        </CardTitle>
        <CardDescription>Upload existing reports to the system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Report PDF File *</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="cursor-pointer"
          />
          {file && (
            <p className="text-xs text-muted-foreground">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Report Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Monthly Inventory Report"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Report Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inventory">Inventory</SelectItem>
              <SelectItem value="Issues">Issues</SelectItem>
              <SelectItem value="Alerts">Alerts</SelectItem>
              <SelectItem value="Audit">Audit</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Report Period *</Label>
          <Input
            id="period"
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            placeholder="e.g., January 2024, Q1 2024, or Year 2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add a description for this report..."
            className="resize-none"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || !formData.name || !formData.type || !formData.period} 
          className="w-full"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>• Only PDF files are supported</p>
          <p>• Maximum file size: 16MB</p>
          <p>• Reports are retained for 3 years from generation date</p>
          <p>• Fields marked with * are required</p>
        </div>
      </CardContent>
    </Card>
  )
}
