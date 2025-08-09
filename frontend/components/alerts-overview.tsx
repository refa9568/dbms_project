import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "Low Stock",
    message: ".50 BMG below minimum",
    severity: "high" as const,
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Expiry Warning",
    message: "9mm rounds expire in 30 days",
    severity: "medium" as const,
    time: "1 day ago",
  },
  {
    id: 3,
    type: "Stock Update",
    message: "5.56mm restocked successfully",
    severity: "low" as const,
    time: "2 days ago",
  },
]

export function AlertsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Active Alerts
        </CardTitle>
        <CardDescription>System notifications and warnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between space-x-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"
                    }
                  >
                    {alert.type}
                  </Badge>
                  {alert.severity === "high" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  {alert.severity === "medium" && <Clock className="h-3 w-3 text-yellow-500" />}
                  {alert.severity === "low" && <CheckCircle className="h-3 w-3 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
