"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Filter, Edit, Eye, UserCheck, UserX, RotateCcw, Shield, Key } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Enhanced users data with login activity tracking
const usersData = [
  {
    id: "USR001",
    username: "admin",
    name: "Lt Col Saima Tania",
    rank: "Lieutenant Colonel",
    role: "CO",
    appointment: "Commanding Officer",
    email: "saima.tania@military.gov.bd",
    phone: "+880-1711-123456",
    status: "Active",
    lastLogin: "2024-01-15 08:30",
    dateCreated: "2023-06-15",
    createdBy: "System Admin",
    loginCount: 45,
    failedLoginAttempts: 0,
    accountLocked: false,
    passwordLastChanged: "2024-01-01",
    twoFactorEnabled: true,
    permissions: ["Full Access", "User Management", "System Administration"],
  },
  {
    id: "USR002",
    username: "qm",
    name: "Captain Refa Jahan",
    rank: "Captain",
    role: "QM",
    appointment: "Quartermaster",
    email: "refa.jahan@military.gov.bd",
    phone: "+880-1711-234567",
    status: "Active",
    lastLogin: "2024-01-15 09:15",
    dateCreated: "2023-07-20",
    createdBy: "Lt Col Saima Tania",
    loginCount: 38,
    failedLoginAttempts: 1,
    accountLocked: false,
    passwordLastChanged: "2023-12-15",
    twoFactorEnabled: true,
    permissions: ["Inventory Management", "Issue Management", "Reports"],
  },
  {
    id: "USR003",
    username: "nco",
    name: "Sergeant Rafiq Islam",
    rank: "Sergeant",
    role: "NCO",
    appointment: "Ammunition NCO",
    email: "rafiq.islam@military.gov.bd",
    phone: "+880-1711-345678",
    status: "Active",
    lastLogin: "2024-01-14 16:45",
    dateCreated: "2023-08-10",
    createdBy: "Lt Col Saima Tania",
    loginCount: 42,
    failedLoginAttempts: 0,
    accountLocked: false,
    passwordLastChanged: "2023-11-20",
    twoFactorEnabled: false,
    permissions: ["Inventory View", "Issue Processing", "Basic Reports"],
  },
]

export function UserManagementTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const filteredData = usersData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || item.role.toLowerCase() === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "CO":
        return <Badge variant="destructive">CO</Badge>
      case "QM":
        return <Badge variant="default">QM</Badge>
      case "NCO":
        return <Badge variant="secondary">NCO</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "locked":
        return <Badge variant="destructive">Locked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleChangePassword = (item: any) => {
    setSelectedItem(item)
    setIsChangePasswordDialogOpen(true)
  }

  const handleToggleStatus = (item: any) => {
    const newStatus = item.status === "Active" ? "Inactive" : "Active"
    console.log(`Changing user ${item.id} status to ${newStatus}`)
    toast({
      title: "Status Updated",
      description: `${item.name}'s status has been changed to ${newStatus}.`,
    })
    // In a real application, this would make an API call
  }

  const handleResetPassword = (item: any) => {
    if (confirm(`Reset password for ${item.name}?`)) {
      console.log("Resetting password for user:", item.id)
      toast({
        title: "Password Reset",
        description: `Password reset email sent to ${item.email}.`,
      })
      // In a real application, this would make an API call
    }
  }

  const handleUnlockAccount = (item: any) => {
    console.log("Unlocking account for user:", item.id)
    toast({
      title: "Account Unlocked",
      description: `${item.name}'s account has been unlocked.`,
    })
    // In a real application, this would make an API call
  }

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    console.log("Changing password for user:", selectedItem?.id)
    toast({
      title: "Password Changed",
      description: `Password for ${selectedItem?.name} has been updated successfully.`,
    })

    setIsChangePasswordDialogOpen(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    // In a real application, this would make an API call
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Authorized System Users</CardTitle>
          <Button onClick={() => setIsChangePasswordDialogOpen(true)}>
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>
        <div className="text-sm text-muted-foreground mb-4">Manage the 3 authorized personnel with system access</div>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, rank, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="co">CO</SelectItem>
              <SelectItem value="qm">QM</SelectItem>
              <SelectItem value="nco">NCO</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Login Activity</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.rank} • @{item.username}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {getRoleBadge(item.role)}
                    <div className="text-xs text-muted-foreground mt-1">{item.appointment}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{item.email}</div>
                    <div className="text-xs text-muted-foreground">{item.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {getStatusBadge(item.status)}
                    {item.accountLocked && <div className="text-xs text-red-600 mt-1">Account Locked</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">{item.loginCount} logins</div>
                    <div className="text-xs text-muted-foreground">Last: {item.lastLogin}</div>
                    {item.failedLoginAttempts > 0 && (
                      <div className="text-xs text-red-600">{item.failedLoginAttempts} failed attempts</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.twoFactorEnabled ? (
                      <Shield className="h-4 w-4 text-green-500" title="2FA Enabled" />
                    ) : (
                      <Shield className="h-4 w-4 text-gray-400" title="2FA Disabled" />
                    )}
                    <div className="text-xs text-muted-foreground">PWD: {item.passwordLastChanged}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleChangePassword(item)}>
                      <Key className="h-4 w-4" />
                    </Button>
                    {item.status === "Active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleToggleStatus(item)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleToggleStatus(item)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    {item.accountLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => handleUnlockAccount(item)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Change Password Dialog */}
        <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                {selectedItem ? `Change password for ${selectedItem.name}` : "Change your password"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password *</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>Include numbers and special characters</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange}>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>Complete information for {selectedItem?.name}</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm text-muted-foreground">@{selectedItem.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Rank</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.rank}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <div className="mt-1">{getRoleBadge(selectedItem.role)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Appointment</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.appointment}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Account Created</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.dateCreated} by {selectedItem.createdBy}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Login Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.loginCount} total logins
                      <br />
                      Last: {selectedItem.lastLogin}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Security</Label>
                    <p className="text-sm text-muted-foreground">
                      2FA: {selectedItem.twoFactorEnabled ? "Enabled" : "Disabled"}
                      <br />
                      Password changed: {selectedItem.passwordLastChanged}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Permissions</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedItem.permissions.map((permission: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
