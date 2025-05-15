import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Link } from "react-router"

export default function ReceptionistDashboard() {
  // Mock data for pending appointments
  const pendingAppointments = [
    {
      id: 1,
      patient: "Emily Johnson",
      doctor: "Dr. Michael Chen",
      date: "May 15, 2025",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Robert Smith",
      doctor: "Dr. Sarah Williams",
      date: "May 15, 2025",
      time: "11:30 AM",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Maria Garcia",
      doctor: "Dr. Michael Chen",
      date: "May 16, 2025",
      time: "9:00 AM",
      status: "Pending",
    },
  ]

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Receptionist Dashboard</h1>
          <Link to="/receptionist/appointments/manage">
            <Button className="bg-teal-600 hover:bg-teal-700">Manage Appointments</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 appointments remaining today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingAppointments.length > 0
                  ? `${pendingAppointments.length} appointments need approval`
                  : "No pending approvals"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Results Pending</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Need to be uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
              <p className="text-xs text-muted-foreground">8 new registrations this week</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Appointment Approvals</CardTitle>
            <CardDescription>Review and approve appointment requests</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Calendar className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">With: {appointment.doctor}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{appointment.date}</span>
                          <Clock className="ml-3 mr-1 h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending appointments to approve.</p>
            )}
            <div className="mt-4">
              <Link to="/receptionist/appointments">
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
