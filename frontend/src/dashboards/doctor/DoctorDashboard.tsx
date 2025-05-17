import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Pill,
} from "lucide-react"
import { Link } from "react-router"
import DashboardLayout from "@/components/dashboard-layout"

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:8000/doctor/appointments")
        const data = await res.json()
        console.log(data)
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [])

  // Get today's date in yyyy-mm-dd
  const today = new Date().toISOString().split("T")[0]
  console.log(today);
  

  const todaysAppointments = appointments.filter(({ appointment }) => {
    return appointment.appointment_date === today
  })

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
                Next appointment at {todaysAppointments[0]?.slot?.slot_time?.slice(0, 5) || "N/A"}
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
                {todaysAppointments.map(({ appointment, patient, slot }) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Clock className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">Checkup / Consultation</p>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {slot.slot_time?.slice(0, 5)}
                          </span>
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
      </div>
    </DashboardLayout>
  )
}
