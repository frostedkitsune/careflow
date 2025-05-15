import { useState, useEffect } from "react"

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Upload,
  ClipboardList,
  Settings, Users,
  Pill
} from "lucide-react"
import { useCareFlowStore } from "@/lib/store"
import { users } from "@/lib/data"
import { Toaster } from "@/components/ui/sonner"
import { Link, useLocation, useNavigate } from "react-router"
import { NavUser } from "./nav-user"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "patient" | "receptionist" | "doctor" | "admin"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const [userName, setUserName] = useState("")
  
  useEffect(() => {
    // Check if user is logged in with the correct role
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (currentUser.role !== role) {
      navigate(`/${currentUser.role}/dashboard`)
      return
    }

    // Get user name from the users array
    const user = users.find((u) => u.id === currentUser.id)
    if (user) {
      setUserName(user.name)
    } else {
      setUserName(getDefaultName(role))
    }
  }, [currentUser, role, navigate])

  function getDefaultName(role: string) {
    switch (role) {
      case "patient":
        return "John Doe"
      case "receptionist":
        return "Sarah Johnson"
      case "doctor":
        return "Dr. Michael Chen"
      case "admin":
        return "Admin User"
      default:
        return "User"
    }
  }

  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/${role}/dashboard`,
        icon: LayoutDashboard,
      },
    ]

    const roleSpecificItems = {
      patient: [
        {
          title: "Appointments",
          href: `/${role}/appointments`,
          icon: Calendar,
        },
        {
          title: "Test Results",
          href: `/${role}/test-results`,
          icon: FileText,
        },
        {
          title: "Documents",
          href: `/${role}/documents`,
          icon: Upload,
        },
      ],
      receptionist: [
        {
          title: "Manage Appointments",
          href: `/${role}/appointments`,
          icon: Calendar,
        },
        {
          title: "Upload Test Results",
          href: `/${role}/test-results`,
          icon: Upload,
        },
      ],
      doctor: [
        {
          title: "View Appointments",
          href: `/${role}/appointments`,
          icon: Calendar,
        },
        {
          title: "Patient Records",
          href: `/${role}/patient-records`,
          icon: ClipboardList,
        },
        {
          title: "Prescriptions",
          href: `/${role}/prescriptions`,
          icon: Pill,
        },
      ],
      admin: [
        {
          title: "User Management",
          href: `/${role}/users`,
          icon: Users,
        },
        {
          title: "System Settings",
          href: `/${role}/settings`,
          icon: Settings,
        },
      ],
    }

    return [...baseItems, ...roleSpecificItems[role]]
  }

  const navItems = getNavItems()

  return (
    <SidebarProvider>
      <Toaster />
      <div className="flex w-screen min-h-screen">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="flex flex-row items-center justify-center pt-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-transparent active:bg-transarent">
                  <div>💊</div>
                  <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold text-teal-600">CareFlow</h1>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.title}>
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <NavUser avatar={"https://github.com/torvalds.png"} name={userName} username={userName} role={role} />
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="border-b bg-white">
            <div className="flex h-16 items-center px-4 md:px-6">
              <SidebarTrigger />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </SidebarProvider >
  )
}
