import { AlertsTable } from "@/components/alerts-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor system alerts and critical notifications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      <AlertsTable />
    </div>
  )
}
