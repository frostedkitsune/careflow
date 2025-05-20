import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Search } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { useAppointmentStore } from "@/store/appointmentStore"

export default function DoctorAppointments() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const { appointments, setAppointments } = useAppointmentStore()

  const [searchTerm, setSearchTerm] = useState("")
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:8000/doctor/appointments")
        const data = await res.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [setAppointments])

  if (!currentUser) {
    navigate("/login")
    return null
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredAppointments = appointments.filter((a) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      a.patient.name.toLowerCase().includes(searchLower) ||
      a.appointment.appointment_date.toLowerCase().includes(searchLower) ||
      (a.slot.slot_time && formatTime(a.slot.slot_time).toLowerCase().includes(searchLower)) ||
      (a.appointment.reason && a.appointment.reason.toLowerCase().includes(searchLower)) ||
      a.appointment.status.toLowerCase().includes(searchLower)
    )
  })

  const bookedAppointments = filteredAppointments.filter((appointment) =>
    appointment.appointment.status.toLowerCase() === "booked"
  )

  const doneAppointments = filteredAppointments.filter((appointment) =>
    appointment.appointment.status.toLowerCase() === "done"
  )

  const renderCard = (appointment: any) => (
    <Card key={appointment.appointment.id} className="rounded-xl shadow-sm border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.patient.name}</CardTitle>
            <CardDescription className="mt-1">
              {appointment.appointment.reason || "No reason provided"}
            </CardDescription>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${appointment.appointment.status.toLowerCase() === "booked"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            {appointment.appointment.status === 'BOOKED' ? 'PENDING' : "DONE"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{appointment.appointment.appointment_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(appointment.slot.slot_time)}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-3 rounded-lg"
          onClick={() => navigate(`/doctor/appointment/${appointment.appointment.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Appointments</h1>

        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, date, status..."
            className="pl-10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="booked" className="space-y-4">
          <TabsList className="rounded-lg">
            <TabsTrigger value="booked" className="rounded-md">Upcoming</TabsTrigger>
            <TabsTrigger value="done" className="rounded-md">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="booked">
            {bookedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedAppointments.map(renderCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-2 rounded-lg border border-dashed">
                <Calendar className="w-12 h-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  No upcoming appointments
                </p>
                <p className="text-sm text-muted-foreground">
                  You don't have any booked appointments yet
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="done">
            {doneAppointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doneAppointments.map(renderCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-2 rounded-lg border border-dashed">
                <Calendar className="w-12 h-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  No past appointments
                </p>
                <p className="text-sm text-muted-foreground">
                  Your completed appointments will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}