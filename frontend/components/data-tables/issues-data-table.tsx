"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { IssueForm } from "@/components/forms/issue-form"
import { useToast } from "@/hooks/use-toast"

interface Issue {
  issue_id: number
  inventory_stock_id: number
  user_id: number
  issue_date: string
  issue_quantity: number
  A_T_L_id: number | null
}

export function IssuesDataTable() {
  const [data, setData] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Issue | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/issues")
      if (response.ok) {
        const issues = await response.json()
        setData(issues)
      } else {
        throw new Error("Failed to fetch issues")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load issues data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      item.issue_id.toString().includes(searchLower) ||
      item.inventory_stock_id.toString().includes(searchLower) ||
      item.user_id.toString().includes(searchLower) ||
      item.issue_date.toLowerCase().includes(searchLower) ||
      item.issue_quantity.toString().includes(searchLower) ||
      (item.A_T_L_id && item.A_T_L_id.toString().includes(searchLower))
    )
  })

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this issue?")) return

    try {
      const response = await fetch(`http://localhost:3001/api/issues/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Issue deleted successfully",
        })
        fetchData()
      } else {
        throw new Error("Failed to delete issue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete issue",
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
          <CardTitle>Issue Records</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
              </DialogHeader>
              <IssueForm
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
            placeholder="Search issues..."
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
              <TableHead>Inventory Stock ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Issue Quantity</TableHead>
              <TableHead>A_T_L ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.issue_id}>
                <TableCell className="font-medium">{item.issue_id}</TableCell>
                <TableCell>{item.inventory_stock_id}</TableCell>
                <TableCell>{item.user_id}</TableCell>
                <TableCell>{item.issue_date}</TableCell>
                <TableCell>{item.issue_quantity.toLocaleString()}</TableCell>
                <TableCell>{item.A_T_L_id || "-"}</TableCell>
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
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.issue_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Issue</DialogTitle>
            </DialogHeader>
            <IssueForm
              mode="edit"
              editData={selectedItem ? {
                ...selectedItem,
                A_T_L_id: selectedItem.A_T_L_id || undefined
              } : undefined}
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
