import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDoctorById } from "@/lib/data"
import { useCareFlowStore } from "@/lib/store"
import { AlertCircle, Calendar, Check, Clock, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

export default function PatientAppointments() {
  const navigate = useNavigate()
  const [cancelAppointmentId, setCancelAppointmentId] = useState<number | null>(null)
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const appointments = useCareFlowStore((state) => state.appointments)
  const updateAppointment = useCareFlowStore((state) => state.updateAppointment)

  // Filter appointments for the current patient
  const patientAppointments = currentUser
    ? appointments.filter((appointment) => appointment.patientId === currentUser.id)
    : []

  // Separate appointments by status
  const upcomingAppointments = patientAppointments.filter(
    (appointment) => appointment.status === "Confirmed" || appointment.status === "Pending",
  )
  const pastAppointments = patientAppointments.filter(
    (appointment) => appointment.status === "Completed" || appointment.status === "Cancelled",
  )

  const handleCancelAppointment = (id: number) => {
    setCancelAppointmentId(id)
  }

  const confirmCancelAppointment = () => {
    if (cancelAppointmentId) {
      updateAppointment(cancelAppointmentId, { status: "Cancelled" })
      toast("Appointment cancelled", {
        description: "Your appointment has been successfully cancelled.",
      })
      setCancelAppointmentId(null)
    }
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <Link to="/patient/appointments/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                const doctor = getDoctorById(appointment.doctorId)
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                              <Calendar className="h-6 w-6 text-teal-600" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">{doctor?.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              {appointment.status === "Pending" && (
                                <div className="flex items-center mt-1">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="text-xs text-yellow-500">Awaiting confirmation</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                          {appointment.status === "Confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">You have no upcoming appointments</p>
                  <Link to="/patient/appointments/new">
                    <Button className="bg-teal-600 hover:bg-teal-700 mt-2">Book an Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => {
                const doctor = getDoctorById(appointment.doctorId)
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                              <Calendar className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">{doctor?.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              <div className="flex items-center mt-1">
                                {appointment.status === "Completed" ? (
                                  <>
                                    <Check className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-xs text-green-500">Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="h-4 w-4 text-red-500 mr-1" />
                                    <span className="text-xs text-red-500">Cancelled</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You have no past appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={cancelAppointmentId !== null} onOpenChange={() => setCancelAppointmentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelAppointmentId(null)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancelAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
