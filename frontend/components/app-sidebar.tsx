"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Package,
  FileText,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  Shield,
  ChevronUp,
  LogOut,
  User,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["CO", "QM", "NCO"],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    roles: ["CO", "QM", "NCO"],
  },
  {
    title: "Issues",
    url: "/issues",
    icon: FileText,
    roles: ["CO", "QM", "NCO"],
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: AlertTriangle,
    roles: ["CO", "QM", "NCO"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["CO", "QM", "NCO"],
  },
  {
    title: "Ammo Types",
    url: "/ammo-types",
    icon: Settings,
    roles: ["QM"],
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    roles: ["CO"],
  },
  {
    title: "Audit Log",
    url: "/audit",
    icon: Activity,
    roles: ["CO"],
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const filteredItems = navigationItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">EBEK</h2>
            <p className="text-xs text-muted-foreground">One Bullet One Enemy</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.rank} - {user?.role}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
