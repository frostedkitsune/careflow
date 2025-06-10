import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect } from "react"
import { Calendar, Clock, PlusCircle, RotateCcw, Stethoscope } from "lucide-react"
import { Link } from "react-router"
import { usePatientAppointmentStore } from "@/store/patientAppointmentStore"

export default function PatientAppointmentsPage() {
  const { appointments, setAppointments } = usePatientAppointmentStore()

  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:8000/patient/appointment")
    const data = await res.json()
    setAppointments(data)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const pending = appointments.filter((a) => a.appointment.status === "PENDING")
  const upcoming = appointments.filter((a) => a.appointment.status === "BOOKED")
  const cancelled = appointments.filter((a) => a.appointment.status === "REJECTED")
  const completed = appointments.filter((a) => a.appointment.status === "DONE")

  const renderCard = (appt:any) => (
    <Card
      key={appt.appointment.id}
      className="border shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
    >
      <CardContent className="p-5 space-y-3 bg-white">
        <div className="flex items-center gap-2 text-teal-600">
          <Stethoscope className="w-5 h-5" />
          <span className="text-lg font-semibold">
            {appt.doctor.name} — {appt.doctor.specialization}
          </span>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            <Calendar className="inline w-4 h-4 mr-1" />
            {appt.appointment.appointment_date}
          </div>
          <div>
            <Clock className="inline w-4 h-4 mr-1" />
            {appt.slot.slot_time}
          </div>
          <div>Reason: {appt.appointment.reason}</div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            My Appointments
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAppointments} className="flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Link to="/patient/appointments/new">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Book New Appointment
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full space-y-4">
          <TabsList className="flex flex-wrap justify-center gap-2">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pending.length > 0 ? pending.map(renderCard) : (
                <p className="text-muted-foreground col-span-full text-center">
                  No pending appointments.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.length > 0 ? upcoming.map(renderCard) : (
                <p className="text-muted-foreground col-span-full text-center">
                  No upcoming appointments.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cancelled.length > 0 ? cancelled.map(renderCard) : (
                <p className="text-muted-foreground col-span-full text-center">
                  No cancelled appointments.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {completed.length > 0 ? completed.map(renderCard) : (
                <p className="text-muted-foreground col-span-full text-center">
                  No completed appointments.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}