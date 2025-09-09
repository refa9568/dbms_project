import { ConsistentLayout } from "@/components/layout/consistent-layout"
import { UserManagementTable } from "@/components/user-management-table"

export default function UsersPage() {
  return (
    <ConsistentLayout title="User Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <UserManagementTable />
      </div>
    </ConsistentLayout>
  )
}
