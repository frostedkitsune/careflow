import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Link } from "react-router"
import { useAppointmentStore } from "@/store/receptionistAppointmentStore"
import { useState } from "react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function ReceptionistDashboard() {
  const { appointments, fetchAppointments } = useAppointmentStore()
  const [isLoading, setIsLoading] = useState(true)
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0)
  const [remainingTodayCount, setRemainingTodayCount] = useState(0)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Fetch appointments on mount and when status changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await fetchAppointments()
      } catch (error) {
        toast.error("Failed to load appointments")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fetchAppointments]) // Removed appointments from dependencies

  // Calculate today's appointments and remaining count whenever appointments change
  useEffect(() => {
    if (appointments.length === 0) return

    // Calculate today's appointments
    const today = new Date().toISOString().split('T')[0]
    const todayApps = appointments.filter(
      appt => appt.appointment.appointment_date === today
    )
    
    setTodayAppointmentsCount(todayApps.length)
    
    // Calculate remaining appointments today
    const now = new Date()
    const remaining = todayApps.filter(appt => {
      const [startTime] = appt.slot.slot_time.split('-')
      const [hours, minutes] = startTime.split(':').map(Number)
      const apptTime = new Date()
      apptTime.setHours(hours, minutes, 0, 0)
      return apptTime > now
    })
    
    setRemainingTodayCount(remaining.length)
  }, [appointments]) // This runs only when appointments change

  // Handle appointment status change
  const handleStatusChange = async (appointmentId: number, action: "approve" | "decline") => {
    try {
      setProcessingId(appointmentId)
      
      const response = await fetch("http://localhost:8000/receptionist/appointment/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          action: action
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} appointment`)
      }

      // Refresh appointments after successful update
      await fetchAppointments()
      
      toast.success(`Appointment ${action}d successfully`)
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error)
      toast.error(`Failed to ${action} appointment`)
    } finally {
      setProcessingId(null)
    }
  }

  // Get pending appointments (limited to 3)
  const pendingAppointments = appointments
    .filter(appt => appt.appointment.status === "PENDING")
    .slice(0, 3)

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    const [start, end] = timeString.split('-')
    return `${start.substring(0, 5)} - ${end.substring(0, 5)}`
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Receptionist Dashboard</h1>
          <Link to="/receptionist/appointments">
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
              <div className="text-2xl font-bold">
                {isLoading ? "--" : todayAppointmentsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Loading..." : `${remainingTodayCount} appointments remaining today`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : pendingAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading 
                  ? "Loading..." 
                  : pendingAppointments.length > 0
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
            {isLoading ? (
              <p className="text-muted-foreground">Loading appointments...</p>
            ) : pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment.appointment.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Calendar className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient.name}</p>
                        <p className="text-sm text-muted-foreground">With: Dr. {appointment.doctor.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{formatDate(appointment.appointment.appointment_date)}</span>
                          <Clock className="ml-3 mr-1 h-4 w-4" />
                          <span>{formatTime(appointment.slot.slot_time)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                        onClick={() => handleStatusChange(appointment.appointment.id, "approve")}
                        disabled={processingId === appointment.appointment.id}
                      >
                        {processingId === appointment.appointment.id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleStatusChange(appointment.appointment.id, "decline")}
                        disabled={processingId === appointment.appointment.id}
                      >
                        {processingId === appointment.appointment.id ? "Processing..." : "Decline"}
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