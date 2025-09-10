import { ConsistentLayout } from "@/components/layout/consistent-layout"
import { ReportsTable } from "@/components/reports-table"
import { ReportGenerator } from "@/components/report-generator"

export default function ReportsPage() {
  return (
    <ConsistentLayout title="Reports & Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and manage system reports</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ReportGenerator />
          </div>
          <div className="lg:col-span-2">
            <ReportsTable />
          </div>
        </div>
      </div>
    </ConsistentLayout>
  )
}
