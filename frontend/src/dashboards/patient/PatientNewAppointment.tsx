import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { doctors } from "@/lib/data"
import { useCareFlowStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function PatientNewAppointment() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const addAppointment = useCareFlowStore((state) => state.addAppointment)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [doctorId, setDoctorId] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  // Filter available doctors (only those marked as available)
  const availableDoctors = doctors.filter((doctor) => doctor.available)

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
    }
  }, [currentUser, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time || !doctorId || !reason) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)

    // Create new appointment
    const newAppointment = {
      patientId: currentUser?.id || 0,
      doctorId: Number.parseInt(doctorId),
      date: format(date, "yyyy-MM-dd"),
      time,
      reason,
      notes,
      status: "Pending",
    }

    // Add appointment to store
    addAppointment(newAppointment)

    // Show success message
    toast("Appointment requested", {
      description: "Your appointment request has been submitted and is awaiting confirmation.",
    })

    // Redirect to appointments page
    setTimeout(() => {
      navigate("/patient/appointments")
    }, 1500)
  }

  if (!currentUser) {
    return null
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Book New Appointment</h1>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Please fill in the details below to request an appointment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select value={doctorId} onValueChange={setDoctorId}>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Appointment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date: Date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0 || date.getDay() === 6
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Brief description of your reason for visit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information that might be helpful for the doctor"
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/patient/appointments")}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Appointment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
