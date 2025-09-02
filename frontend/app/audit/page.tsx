import { AuditLogTable } from "@/components/audit-log-table"

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">System activity and security audit trail</p>
      </div>

      <AuditLogTable />
    </div>
  )
}
