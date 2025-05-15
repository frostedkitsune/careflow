import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, UserCheck, Settings, Activity } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Link } from "react-router"

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <Link to="/admin/users/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+42 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,024</div>
              <p className="text-xs text-muted-foreground">+36 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">260</div>
              <p className="text-xs text-muted-foreground">+6 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.2%</div>
              <p className="text-xs text-muted-foreground">Uptime in the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>User logins and actions over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                <p className="text-muted-foreground">Activity chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>New users in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jessica Williams</p>
                    <p className="text-xs text-muted-foreground">Patient • Registered 2 days ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">David Martinez</p>
                    <p className="text-xs text-muted-foreground">Patient • Registered 3 days ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Lisa Thompson</p>
                    <p className="text-xs text-muted-foreground">Doctor • Registered 5 days ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <p className="text-xs text-muted-foreground">Receptionist • Registered 6 days ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full">
                    View All Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Authentication Service</p>
                    <p className="text-sm text-muted-foreground">Last incident: 15 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Storage Service</p>
                    <p className="text-sm text-muted-foreground">Current usage: 42% of capacity</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full">
                  System Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
