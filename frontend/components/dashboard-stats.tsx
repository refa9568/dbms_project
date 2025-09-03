import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Target, Shield, File as Rifle, Zap } from "lucide-react"

// Hardcoded data based on the database structure
const ammunitionData = [
  { id: 1, rifle: 500, lmg: 100, hmg: 50, pistol: 20 },
  { id: 2, rifle: 1000, lmg: 200, hmg: 100, pistol: 50 },
  { id: 3, rifle: 750, lmg: 150, hmg: 80, pistol: 40 },
  { id: 4, rifle: 1200, lmg: 250, hmg: 120, pistol: 60 },
  { id: 5, rifle: 300, lmg: 60, hmg: 30, pistol: 10 },
  { id: 6, rifle: 900, lmg: 180, hmg: 90, pistol: 45 },
  { id: 7, rifle: 600, lmg: 120, hmg: 70, pistol: 25 },
  { id: 8, rifle: 1100, lmg: 210, hmg: 110, pistol: 55 },
  { id: 9, rifle: 400, lmg: 80, hmg: 40, pistol: 20 },
  { id: 10, rifle: 1300, lmg: 260, hmg: 130, pistol: 65 },
]

const ammoTypeData = [
  { ammo_id: 1, live: 400, blank: 80, fcc: 20 },
  { ammo_id: 2, live: 800, blank: 150, fcc: 50 },
  { ammo_id: 3, live: 600, blank: 100, fcc: 50 },
  { ammo_id: 4, live: 1000, blank: 180, fcc: 20 },
  { ammo_id: 5, live: 200, blank: 70, fcc: 30 },
  { ammo_id: 6, live: 700, blank: 150, fcc: 50 },
  { ammo_id: 7, live: 500, blank: 100, fcc: 20 },
  { ammo_id: 8, live: 900, blank: 150, fcc: 50 },
  { ammo_id: 9, live: 300, blank: 80, fcc: 20 },
  { ammo_id: 10, live: 1100, blank: 180, fcc: 20 },
]

const lineTypeData = [
  { id: 1, first_line: 1, second_line: 0, training: 0 },
  { id: 2, first_line: 1, second_line: 0, training: 0 },
  { id: 3, first_line: 0, second_line: 1, training: 0 },
  { id: 4, first_line: 0, second_line: 1, training: 0 },
  { id: 5, first_line: 0, second_line: 0, training: 1 },
  { id: 6, first_line: 0, second_line: 0, training: 1 },
  { id: 7, first_line: 1, second_line: 0, training: 0 },
  { id: 8, first_line: 0, second_line: 1, training: 0 },
  { id: 9, first_line: 0, second_line: 0, training: 1 },
  { id: 10, first_line: 1, second_line: 0, training: 0 },
]

const inventoryData = [
  { id: 1, user_id: 1, quantity: 500, lot_number: "LOT-A1", stock_date: "2025-01-05", expiry_date: "2028-01-05" },
  { id: 2, user_id: 2, quantity: 300, lot_number: "LOT-B2", stock_date: "2025-02-10", expiry_date: "2027-02-10" },
  { id: 3, user_id: 3, quantity: 400, lot_number: "LOT-C3", stock_date: "2025-03-15", expiry_date: "2029-03-15" },
  { id: 4, user_id: 4, quantity: 600, lot_number: "LOT-D4", stock_date: "2025-04-20", expiry_date: "2028-04-20" },
  { id: 5, user_id: 5, quantity: 250, lot_number: "LOT-E5", stock_date: "2025-05-25", expiry_date: "2027-05-25" },
  { id: 6, user_id: 6, quantity: 700, lot_number: "LOT-F6", stock_date: "2025-06-01", expiry_date: "2029-06-01" },
  { id: 7, user_id: 7, quantity: 550, lot_number: "LOT-G7", stock_date: "2025-06-10", expiry_date: "2027-06-10" },
  { id: 8, user_id: 8, quantity: 450, lot_number: "LOT-H8", stock_date: "2025-07-15", expiry_date: "2028-07-15" },
  { id: 9, user_id: 9, quantity: 350, lot_number: "LOT-I9", stock_date: "2025-07-20", expiry_date: "2029-07-20" },
  { id: 10, user_id: 10, quantity: 800, lot_number: "LOT-J10", stock_date: "2025-08-01", expiry_date: "2028-08-01" },
]

const issueData = [
  { id: 1, inventory_stock_id: 1, user_id: 5, issue_date: "2025-02-01", issue_quantity: 100, A_T_L_id: 1 },
  { id: 2, inventory_stock_id: 2, user_id: 6, issue_date: "2025-02-05", issue_quantity: 50, A_T_L_id: 2 },
  { id: 3, inventory_stock_id: 3, user_id: 7, issue_date: "2025-03-01", issue_quantity: 70, A_T_L_id: 3 },
  { id: 4, inventory_stock_id: 4, user_id: 8, issue_date: "2025-03-10", issue_quantity: 120, A_T_L_id: 4 },
  { id: 5, inventory_stock_id: 5, user_id: 9, issue_date: "2025-04-01", issue_quantity: 60, A_T_L_id: 5 },
  { id: 6, inventory_stock_id: 6, user_id: 10, issue_date: "2025-04-15", issue_quantity: 90, A_T_L_id: 6 },
  { id: 7, inventory_stock_id: 7, user_id: 4, issue_date: "2025-05-05", issue_quantity: 150, A_T_L_id: 7 },
  { id: 8, inventory_stock_id: 8, user_id: 3, issue_date: "2025-05-20", issue_quantity: 200, A_T_L_id: 8 },
  { id: 9, inventory_stock_id: 9, user_id: 2, issue_date: "2025-06-01", issue_quantity: 80, A_T_L_id: 9 },
  { id: 10, inventory_stock_id: 10, user_id: 1, issue_date: "2025-06-10", issue_quantity: 250, A_T_L_id: 10 },
]

// Calculate statistics from hardcoded data
const totalRifleAmmo = ammunitionData.reduce((sum, item) => sum + item.rifle, 0)
const totalLMGAmmo = ammunitionData.reduce((sum, item) => sum + item.lmg, 0)
const totalHMGAmmo = ammunitionData.reduce((sum, item) => sum + item.hmg, 0)
const totalPistolAmmo = ammunitionData.reduce((sum, item) => sum + item.pistol, 0)
const totalAmmo = totalRifleAmmo + totalLMGAmmo + totalHMGAmmo + totalPistolAmmo

const totalLiveAmmo = ammoTypeData.reduce((sum, item) => sum + item.live, 0)
const totalBlankAmmo = ammoTypeData.reduce((sum, item) => sum + item.blank, 0)
const totalFCCAmmo = ammoTypeData.reduce((sum, item) => sum + item.fcc, 0)

const totalInventoryQuantity = inventoryData.reduce((sum, item) => sum + item.quantity, 0)
const totalIssueQuantity = issueData.reduce((sum, item) => sum + item.issue_quantity, 0)

const firstLineCount = lineTypeData.filter((item) => item.first_line === 1).length
const secondLineCount = lineTypeData.filter((item) => item.second_line === 1).length
const trainingCount = lineTypeData.filter((item) => item.training === 1).length

const userLoginCounts = {
  "Lt Col Saima Tania": 45,
  "Captain Refa Jahan": 38,
  "Sergeant Rafiq Islam": 42,
}

const stats = [
  {
    title: "Total Ammunition",
    value: totalAmmo.toLocaleString(),
    change: "+5%",
    changeType: "positive" as const,
    icon: Package,
    description: "All weapon categories combined",
  },
  {
    title: "Live Ammunition",
    value: totalLiveAmmo.toLocaleString(),
    change: "+8%",
    changeType: "positive" as const,
    icon: Zap,
    description: "Combat-ready ammunition",
  },
  {
    title: "Total Issues",
    value: totalIssueQuantity.toLocaleString(),
    change: "+12%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Ammunition distributed to units",
  },
  {
    title: "Inventory Stock",
    value: totalInventoryQuantity.toLocaleString(),
    change: "-3%",
    changeType: "negative" as const,
    icon: Shield,
    description: "Current stock in inventory",
  },
]

const weaponCategories = [
  { name: "Rifle", total: totalRifleAmmo, icon: Rifle, color: "text-green-400" },
  { name: "LMG", total: totalLMGAmmo, icon: Target, color: "text-blue-400" },
  { name: "HMG", total: totalHMGAmmo, icon: Shield, color: "text-red-400" },
  { name: "Pistol", total: totalPistolAmmo, icon: Zap, color: "text-yellow-400" },
]

const ammoTypes = [
  {
    name: "Live",
    total: totalLiveAmmo,
    percentage: ((totalLiveAmmo / (totalLiveAmmo + totalBlankAmmo + totalFCCAmmo)) * 100).toFixed(1),
  },
  {
    name: "Blank",
    total: totalBlankAmmo,
    percentage: ((totalBlankAmmo / (totalLiveAmmo + totalBlankAmmo + totalFCCAmmo)) * 100).toFixed(1),
  },
  {
    name: "FCC",
    total: totalFCCAmmo,
    percentage: ((totalFCCAmmo / (totalLiveAmmo + totalBlankAmmo + totalFCCAmmo)) * 100).toFixed(1),
  },
]

const lineTypes = [
  { name: "First Line", count: firstLineCount, color: "text-red-400" },
  { name: "Second Line", count: secondLineCount, color: "text-yellow-400" },
  { name: "Training", count: trainingCount, color: "text-green-400" },
]

const recentActivities = [
  {
    id: 1,
    user: "Lt Col Saima Tania",
    action: "Issued ammunition",
    item: `${issueData[9].issue_quantity} rounds to User ${issueData[9].user_id}`,
    time: "2 hours ago",
    type: "issue" as const,
  },
  {
    id: 2,
    user: "Captain Refa Jahan",
    action: "Added new stock",
    item: `${inventoryData[9].quantity} rounds - ${inventoryData[9].lot_number}`,
    time: "4 hours ago",
    type: "stock" as const,
  },
  {
    id: 3,
    user: "Sergeant Rafiq Islam",
    action: "Processed issue",
    item: `${issueData[7].issue_quantity} rounds distributed`,
    time: "6 hours ago",
    type: "issue" as const,
  },
  {
    id: 4,
    user: "System",
    action: "Stock alert",
    item: "Low inventory detected for multiple lots",
    time: "8 hours ago",
    type: "alert" as const,
  },
]

export function DashboardStats() {
  return (
    <div className="space-y-6">
      {/* Military themed header */}
      <div className="military-dark-theme rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="h-12 w-12 military-accent" />
          <div>
            <h1 className="text-3xl font-bold">EK BULLET EK SHOTRU</h1>
            <p className="text-lg opacity-90">One Bullet One Enemy - Command Dashboard</p>
          </div>
          <Target className="h-8 w-8 ml-auto military-accent" />
        </div>

        {/* Main Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="military-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 military-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : stat.changeType === "negative"
                        ? "text-red-400"
                        : "text-gray-300"
                  }`}
                >
                  {stat.change} from last month
                </p>
                <p className="text-xs text-gray-300 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weapon Categories */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {weaponCategories.map((weapon) => (
            <Card key={weapon.name} className="military-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{weapon.name}</p>
                    <p className="text-2xl font-bold text-white">{weapon.total.toLocaleString()}</p>
                  </div>
                  <weapon.icon className={`h-8 w-8 ${weapon.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Ammunition Types */}
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="text-white">Ammunition Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ammoTypes.map((type) => (
                <div key={type.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 military-accent-bg rounded-full"></div>
                    <span className="text-sm font-medium text-white">{type.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{type.total.toLocaleString()}</div>
                    <div className="text-xs text-gray-300">{type.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Line Types */}
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="text-white">Line Classifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lineTypes.map((line) => (
                <div key={line.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 military-accent-bg rounded-full"></div>
                    <span className="text-sm font-medium text-white">{line.name}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{line.count} units</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Login Activity */}
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="text-white">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(userLoginCounts).map(([user, count]) => (
                <div key={user} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 military-accent-bg rounded-full"></div>
                    <span className="text-sm font-medium text-white">{user}</span>
                  </div>
                  <div className="text-sm text-gray-300">{count} logins</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {activity.type === "stock" && <Package className="h-6 w-6 text-green-400" />}
                  {activity.type === "issue" && <TrendingUp className="h-6 w-6 text-blue-400" />}
                  {activity.type === "alert" && <AlertTriangle className="h-6 w-6 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {activity.user} - {activity.action}
                  </p>
                  <p className="text-xs text-gray-300">
                    {activity.item} - {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="text-white">Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Lots</span>
                <span className="text-sm font-bold text-white">{inventoryData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Quantity</span>
                <span className="text-sm font-bold text-white">{totalInventoryQuantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Issued Quantity</span>
                <span className="text-sm font-bold text-white">{totalIssueQuantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Remaining Stock</span>
                <span className="text-sm font-bold text-white">
                  {(totalInventoryQuantity - totalIssueQuantity).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="military-card">
          <CardHeader>
            <CardTitle className="text-white">Issue Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Issues</span>
                <span className="text-sm font-bold text-white">{issueData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Average Issue Size</span>
                <span className="text-sm font-bold text-white">
                  {Math.round(totalIssueQuantity / issueData.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Latest Issue</span>
                <span className="text-sm font-bold text-white">{issueData[issueData.length - 1].issue_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Issue Rate</span>
                <span className="text-sm font-bold text-white">
                  {((totalIssueQuantity / totalInventoryQuantity) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
