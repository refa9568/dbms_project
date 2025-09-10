import { ConsistentLayout } from "@/components/layout/consistent-layout"
import { AlertsTable } from "@/components/alerts-table"

export default function AlertsPage() {
  return (
    <ConsistentLayout title="Alerts & Notifications">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h2>
          <p className="text-muted-foreground">Monitor system alerts and critical notifications</p>
        </div>
        <AlertsTable />
      </div>
    </ConsistentLayout>
  )
}
