import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, BarChart3, Users } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Add Stock",
    description: "Add new ammunition to inventory",
    icon: Plus,
    href: "/inventory/add",
    variant: "default" as const,
  },
  {
    title: "Create Issue",
    description: "Issue ammunition to personnel",
    icon: FileText,
    href: "/issues/create",
    variant: "secondary" as const,
  },
  {
    title: "Generate Report",
    description: "Create inventory or usage report",
    icon: BarChart3,
    href: "/reports",
    variant: "outline" as const,
  },
  {
    title: "Manage Users",
    description: "Add or modify user accounts",
    icon: Users,
    href: "/users",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action) => (
            <Button key={action.title} variant={action.variant} className="justify-start h-auto p-3" asChild>
              <Link href={action.href}>
                <action.icon className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
