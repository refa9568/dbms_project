import { ConsistentLayout } from "@/components/layout/consistent-layout"
import { DashboardStats } from "@/components/dashboard-stats"

export default function DashboardPage() {
  return (
    <ConsistentLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your ammunition management system.</p>
        </div>
        <DashboardStats />
      </div>
    </ConsistentLayout>
  )
}
