import { ConsistentLayout } from "@/components/layout/consistent-layout"
import { AuditLogTable } from "@/components/audit-log-table"

export default function AuditPage() {
  return (
    <ConsistentLayout title="Audit Log">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground">System activity and security audit trail</p>
        </div>
        <AuditLogTable />
      </div>
    </ConsistentLayout>
  )
}
