import { IssuesTable } from "@/components/issues-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function IssuesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
          <p className="text-muted-foreground">Track ammunition issues and distributions</p>
        </div>
        <Button asChild>
          <Link href="/issues/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Issue
          </Link>
        </Button>
      </div>

      <IssuesTable />
    </div>
  )
}
