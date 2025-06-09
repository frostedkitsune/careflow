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
import { CalendarIcon, Upload } from "lucide-react"
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [patientId, setPatientId] = useState("")
  const [testName, setTestName] = useState("")
  const [testType, setTestType] = useState("")
  const [testResultText, setTestResultText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available time slots
  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ]

  // Filter available doctors (only those marked as available)
  const availableDoctors = doctors.filter((doctor) => doctor.available);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId || !testName || !testType || !testResultText) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      // Create new test result
      const newTestResult = {
        patientId: Number.parseInt(patientId),
        name: testName,
        date: new Date().toISOString().split("T")[0],
        status: "Available",
        type: testType,
        uploadedBy: currentUser ? "Sarah Johnson" : "Unknown",
        results: testResultText,
      }

      // Add test result to store
      addTestResult(newTestResult)

      // Reset form
      setPatientId("")
      setTestName("")
      setTestType("")
      setTestResultText("")
      setFile(null)
      setIsUploading(false)
      setUploadDialogOpen(false)

      // Show success message
      toast("Test results uploaded", {
        description: "The test results have been successfully uploaded.",
      })
    }, 1500)
  }

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
              <Label htmlFor="file">Attach File (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {file && (
                <div className="text-sm text-muted-foreground mt-2">
                  Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
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
