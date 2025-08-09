import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { AlertsOverview } from "@/components/alerts-overview"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to EK BULLET EK SHOTRU System</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <AlertsOverview />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
