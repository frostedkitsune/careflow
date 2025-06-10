// pages/patient/dashboard.tsx
import { useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, PlusCircle, Stethoscope, Phone, Mail } from "lucide-react"
import { Link } from "react-router"
import { usePatientAppointmentStore } from "@/store/patientAppointmentStore"

export default function PatientDashboard() {
  const { appointments, setAppointments } = usePatientAppointmentStore()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:8000/patient/appointment")
        const data = await res.json()
        setAppointments(data)
      } catch (err) {
        console.error("Failed to fetch appointments:", err)
      }
    }

    fetchAppointments()
  }, [setAppointments])

  const bookedAppointments = appointments.filter(
    (item) => item.appointment.status === "BOOKED"
  )

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">All-time booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Marked as done</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookedAppointments.length}</div>
              <p className="text-sm text-muted-foreground">
                {bookedAppointments[0]
                  ? `Next: ${bookedAppointments[0].appointment.reschedule_date || bookedAppointments[0].appointment.appointment_date}`
                  : "No upcoming appointments"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-1 flex items-center">
                <Phone className="h-4 w-4 mr-2" /> +91 98765 43210
              </p>
              <p className="text-sm flex items-center">
                <Mail className="h-4 w-4 mr-2" /> help@careflow.health
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 ">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments with doctors</CardDescription>
            </CardHeader>
            <CardContent>
              {bookedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {bookedAppointments.map((item) => (
                    <div key={item.appointment.id} className="flex items-start space-x-4 rounded-md border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Stethoscope className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{item.doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{item.doctor.specialization}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{item.appointment.reschedule_date || item.appointment.appointment_date}</span>
                          <Clock className="ml-3 mr-1 h-4 w-4" />
                          <span>{item.slot.slot_time}</span>
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
        </div>
      </div>
    </DashboardLayout>
  )
}
