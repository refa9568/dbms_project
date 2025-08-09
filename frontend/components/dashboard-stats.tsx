import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    title: "Total Stock Items",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Low Stock Alerts",
    value: "23",
    change: "+5%",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
  {
    title: "Issues This Month",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Users",
    value: "12",
    change: "0%",
    changeType: "neutral" as const,
    icon: Users,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
