import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, Search, Filter, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { getPatientById } from "@/lib/data"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export default function DoctorAppointments() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const appointments = useCareFlowStore((state) => state.appointments)
  const updateAppointment = useCareFlowStore((state) => state.updateAppointment)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter appointments for the current doctor
  const doctorAppointments = currentUser
    ? appointments.filter((appointment) => appointment.doctorId === currentUser.id)
    : []

  // Filter appointments based on search term
  const filteredAppointments = doctorAppointments.filter((appointment) => {
    const patient = getPatientById(appointment.patientId)

    return (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date.includes(searchTerm) ||
      appointment.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Separate appointments by status
  const upcomingAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "Confirmed" || appointment.status === "Pending",
  )

  const pastAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "Completed" || appointment.status === "Cancelled",
  )

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setNotes(appointment.notes || "")
  }

  const handleCompleteAppointment = () => {
    if (selectedAppointment) {
      setIsSubmitting(true)

      // Update appointment status and notes
      updateAppointment(selectedAppointment.id, {
        status: "Completed",
        notes: notes,
      })

      // Show success message
      toast("Appointment completed", {
        description: "The appointment has been marked as completed.",
      })

      // Reset state
      setTimeout(() => {
        setIsSubmitting(false)
        setSelectedAppointment(null)
        setNotes("")
      }, 1000)
    }
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)

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
                              <h3 className="font-medium">{patient?.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              <div className="flex items-center mt-1">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    appointment.status === "Confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                            View Details
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
                  <p className="text-muted-foreground">You have no upcoming appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)

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
                              <h3 className="font-medium">{patient?.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              <div className="flex items-center mt-1">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    appointment.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                            View Details
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

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View and manage appointment information</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Patient</h4>
                  <p className="text-sm text-muted-foreground">{getPatientById(selectedAppointment.patientId)?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date & Time</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Reason</h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.reason}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this appointment"
                  rows={4}
                  disabled={selectedAppointment.status === "Completed" || selectedAppointment.status === "Cancelled"}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
                {selectedAppointment.status === "Confirmed" && (
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleCompleteAppointment}
                    disabled={isSubmitting}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Mark as Completed"}
                  </Button>
                )}
                {selectedAppointment.status === "Completed" && (
                  <Button
                    variant="outline"
                    className="border-teal-500 text-teal-500 hover:bg-teal-50 hover:text-teal-600"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
