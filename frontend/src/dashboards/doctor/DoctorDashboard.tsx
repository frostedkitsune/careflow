// components/DoctorDashboard.tsx
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Users, Pill, CircleCheck } from "lucide-react"
import { Link, useNavigate } from "react-router"
import DashboardLayout from "@/components/dashboard-layout"
import { useAppointmentStore } from "@/store/appointmentStore"
import { toast } from "sonner"
import { useDoctorStore } from "@/store/doctorStore"

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const { appointments, setAppointments } = useAppointmentStore()
      const [loading, setLoading] = useState({
          prescription: false,
          record: false,
          complete: false
      });
  
  // fetching doctor info
  const { setDoctor } = useDoctorStore();

useEffect(() => {
  const fetchDoctorInfo = async () => {
    try {
      const res = await fetch("http://localhost:8000/doctor/me");
      if (!res.ok) throw new Error("Failed to fetch doctor info");
      const data = await res.json();
      setDoctor(data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  fetchDoctorInfo();
}, [setDoctor]);

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

  const today = new Date().toISOString().split("T")[0]
  const todaysAppointments = appointments.filter(
    ({ appointment }) => appointment.appointment_date === today
  )


  const handleComplete = async (appointmentId: number) => {
    try {
      setLoading(prev => ({ ...prev, complete: true }));
      const response = await fetch(
        `http://localhost:8000/doctor/appointment/${appointmentId}`,
        {
          method: "PATCH"
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update appointment status")
      }

      // Refresh the appointments
      const res = await fetch("http://localhost:8000/doctor/appointments")
      const data = await res.json()
      setAppointments(data)
      setLoading(prev => ({ ...prev, complete: false }));
      toast.success("Appointed update successfully")
      
    } catch (error) {
      console.error("Error marking appointment as done:", error)
      toast.error("Appointed update failed")
    }
  }

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
              <div className="space-y-4 overflow-y-scroll">
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
                            {appointment.status==="BOOKED"?"PENDING":`${appointment.status}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/doctor/appointment/${appointment.id}`)}
                      >
                        View Details
                      </Button>
                      {appointment.status === "BOOKED" && (
                        <Button 
                            className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white cursor-pointer" 
                            onClick={() => handleComplete(appointment.id)}
                            disabled={loading.complete}
                        >
                            {loading.complete ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <CircleCheck className="mr-2 h-4 w-4" /> 
                                    Mark as Done
                                </>
                            )}
                        </Button>
                    )}
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