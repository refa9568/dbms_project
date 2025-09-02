import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Lt Col Saima Tania",
    action: "Added new stock",
    item: "5.56mm NATO - 1000 rounds",
    time: "2 hours ago",
    type: "stock" as const,
  },
  {
    id: 2,
    user: "Captain Refa Jahan",
    action: "Issued ammunition",
    item: "7.62mm NATO - 200 rounds to Alpha Company",
    time: "4 hours ago",
    type: "issue" as const,
  },
  {
    id: 3,
    user: "Sergeant Rafiq Islam",
    action: "Updated expiry date",
    item: "9mm Parabellum - Lot #A2024",
    time: "6 hours ago",
    type: "update" as const,
  },
  {
    id: 4,
    user: "System",
    action: "Low stock alert",
    item: ".50 BMG - Below minimum threshold",
    time: "8 hours ago",
    type: "alert" as const,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <Badge
                    variant={
                      activity.type === "stock"
                        ? "default"
                        : activity.type === "issue"
                          ? "secondary"
                          : activity.type === "update"
                            ? "outline"
                            : "destructive"
                    }
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action}: {activity.item}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
