import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, PlusCircle } from "lucide-react"
import { Link } from "react-router"

export default function PatientDashboard() {
  // Mock data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Michael Chen", specialty: "Cardiology", date: "May 15, 2025", time: "10:00 AM" },
    { id: 2, doctor: "Dr. Sarah Williams", specialty: "Dermatology", date: "May 22, 2025", time: "2:30 PM" },
  ]

  // Mock data for recent test results
  const recentTestResults = [
    { id: 1, name: "Blood Test Results", date: "April 28, 2025", status: "Available" },
    { id: 2, name: "X-Ray Results", date: "April 15, 2025", status: "Available" },
  ]

  return (
    <DashboardLayout role="patient">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
          <Link to="/patient/appointments/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Next appointment on {upcomingAppointments[0]?.date || "No upcoming appointments"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Results</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentTestResults.length}</div>
              <p className="text-xs text-muted-foreground">
                {recentTestResults.length > 0
                  ? `${recentTestResults.length} available results`
                  : "No test results available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Last updated on May 1, 2025</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments with healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start space-x-4 rounded-md border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Calendar className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{appointment.date}</span>
                          <Clock className="ml-3 mr-1 h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
              )}
              <div className="mt-4">
                <Link to="/patient/appointments">
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Your latest medical test results</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTestResults.length > 0 ? (
                <div className="space-y-4">
                  {recentTestResults.map((result) => (
                    <div key={result.id} className="flex items-start space-x-4 rounded-md border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-muted-foreground">Date: {result.date}</p>
                        <div className="flex items-center">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {result.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No test results available.</p>
              )}
              <div className="mt-4">
                <Link to="/patient/test-results">
                  <Button variant="outline" className="w-full">
                    View All Test Results
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
