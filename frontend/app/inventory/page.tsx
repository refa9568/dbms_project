"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch("http://localhost:3001/api/inventory")
        const data = await res.json()
        setInventory(data)
      } catch (err) {
        console.error("Failed to fetch inventory:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [])

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

      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <p>Loading inventory...</p>
        ) : inventory.length === 0 ? (
          <p className="text-muted-foreground">No inventory found.</p>
        ) : (
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Lot Number</th>
                <th className="p-2 border">Stock Date</th>
                <th className="p-2 border">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.inventory_stock_id} className="text-center">
                  <td className="p-2 border">{item.inventory_stock_id}</td>
                  <td className="p-2 border">{item.user_id}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.lot_number}</td>
                  <td className="p-2 border">{item.stock_date}</td>
                  <td className="p-2 border">{item.expiry_date || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
