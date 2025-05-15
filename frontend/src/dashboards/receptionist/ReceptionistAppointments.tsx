import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, X, Search, AlertCircle, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { getDoctorById, getPatientById } from "@/lib/data"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export default function ReceptionistAppointments() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const appointments = useCareFlowStore((state) => state.appointments)
  const updateAppointment = useCareFlowStore((state) => state.updateAppointment)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [dialogAction, setDialogAction] = useState<"approve" | "decline" | null>(null)

  // Filter appointments based on status
  const pendingAppointments = appointments.filter((appointment) => appointment.status === "Pending")

  const confirmedAppointments = appointments.filter((appointment) => appointment.status === "Confirmed")

  const otherAppointments = appointments.filter(
    (appointment) => appointment.status !== "Pending" && appointment.status !== "Confirmed",
  )

  // Filter appointments based on search term
  const filteredPendingAppointments = pendingAppointments.filter((appointment) => {
    const patient = getPatientById(appointment.patientId)
    const doctor = getDoctorById(appointment.doctorId)

    return (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date.includes(searchTerm) ||
      appointment.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleApproveAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setDialogAction("approve")
  }

  const handleDeclineAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setDialogAction("decline")
  }

  const confirmAction = () => {
    if (selectedAppointment) {
      if (dialogAction === "approve") {
        updateAppointment(selectedAppointment.id, { status: "Confirmed" })
        toast("Appointment approved", {
          description: "The appointment has been successfully approved.",
        })
      } else if (dialogAction === "decline") {
        updateAppointment(selectedAppointment.id, { status: "Declined" })
        toast("Appointment declined", {
          description: "The appointment has been declined.",
        })
      }

      setSelectedAppointment(null)
      setDialogAction(null)
    }
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Appointments</h1>
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

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending Approval
              {pendingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {pendingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {filteredPendingAppointments.length > 0 ? (
              filteredPendingAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)
                const doctor = getDoctorById(appointment.doctorId)

                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                              <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {patient?.name} with {doctor?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground">Notes: {appointment.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleApproveAppointment(appointment)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeclineAppointment(appointment)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Decline
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
                  <p className="text-muted-foreground">No pending appointments to approve</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedAppointments.length > 0 ? (
              confirmedAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)
                const doctor = getDoctorById(appointment.doctorId)

                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                              <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {patient?.name} with {doctor?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground">Notes: {appointment.notes}</p>
                              )}
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
                  <p className="text-muted-foreground">No confirmed appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            {otherAppointments.length > 0 ? (
              otherAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)
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
                              <h3 className="font-medium">
                                {patient?.name} with {doctor?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>{appointment.date}</span>
                                <Clock className="ml-3 mr-1 h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                                  {appointment.status}
                                </span>
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
                  <p className="text-muted-foreground">No other appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={!!dialogAction}
        onOpenChange={() => {
          setDialogAction(null)
          setSelectedAppointment(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction === "approve" ? "Approve Appointment" : "Decline Appointment"}</DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? "Are you sure you want to approve this appointment?"
                : "Are you sure you want to decline this appointment?"}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4">
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Patient:</span>
                    <span className="text-sm">{getPatientById(selectedAppointment.patientId)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Doctor:</span>
                    <span className="text-sm">{getDoctorById(selectedAppointment.doctorId)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reason:</span>
                    <span className="text-sm">{selectedAppointment.reason}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null)
                setSelectedAppointment(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              className={dialogAction === "approve" ? "bg-teal-600 hover:bg-teal-700" : ""}
              onClick={confirmAction}
            >
              {dialogAction === "approve" ? "Approve" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
