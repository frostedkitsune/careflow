import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, Pill } from "lucide-react"
import {Link} from "react-router"
import DashboardLayout from "@/components/dashboard-layout"

export default function DoctorDashboard() {
  // Mock data for today's appointments
  const todaysAppointments = [
    { id: 1, patient: "Emily Johnson", time: "10:00 AM", reason: "Annual checkup", status: "Confirmed" },
    { id: 2, patient: "Robert Smith", time: "11:30 AM", reason: "Follow-up", status: "Confirmed" },
    { id: 3, patient: "Maria Garcia", time: "2:00 PM", reason: "Consultation", status: "Confirmed" },
  ]

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
          <Link to="/doctor/appointments">
            <Button className="bg-teal-600 hover:bg-teal-700">View All Appointments</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Next appointment at {todaysAppointments[0]?.time || "No appointments today"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">5 new patients this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Test Results</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Need to be reviewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">8 issued this week</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Clock className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{appointment.time}</span>
                          <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No appointments scheduled for today.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Patient Records</CardTitle>
              <CardDescription>Recently updated patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Emily Johnson</p>
                    <p className="text-sm text-muted-foreground">Updated: May 10, 2025</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Robert Smith</p>
                    <p className="text-sm text-muted-foreground">Updated: May 9, 2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/doctor/patient-records">
                  <Button variant="outline" className="w-full">
                    View All Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>Recently issued prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Pill className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Maria Garcia</p>
                    <p className="text-sm text-muted-foreground">Amoxicillin 500mg</p>
                    <p className="text-sm text-muted-foreground">Issued: May 8, 2025</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Pill className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">James Wilson</p>
                    <p className="text-sm text-muted-foreground">Lisinopril 10mg</p>
                    <p className="text-sm text-muted-foreground">Issued: May 7, 2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/doctor/prescriptions">
                  <Button variant="outline" className="w-full">
                    View All Prescriptions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
