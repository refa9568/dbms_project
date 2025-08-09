import { InventoryTable } from "@/components/inventory-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage ammunition stock and inventory levels</p>
        </div>
        <Button asChild>
          <Link href="/inventory/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </Link>
        </Button>
      </div>

      <InventoryTable />
    </div>
  )
}
