import { useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCareFlowStore } from "@/lib/store"
import { useAllDoctorStore } from "@/store/AlldoctorStore"
import { User } from "lucide-react"
import { Link, useNavigate } from "react-router"

export default function ReceptionistSlots() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const doctors = useAllDoctorStore((state) => state.doctors)
  const setDoctors = useAllDoctorStore((state) => state.setDoctors)

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8000/receptionist/doctors")
        const data = await response.json()
        setDoctors(data.doctors)
      } catch (error) {
        console.error("Failed to fetch doctors", error)
      }
    }

    // Fetch only if not already present
    if (doctors.length === 0) {
      fetchDoctors()
    }
  }, [currentUser, doctors.length, navigate, setDoctors])

  if (!currentUser) return null

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Slots</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <Link to={`${doctor.id}`} key={doctor.id}>
              <Card>
                <CardHeader className="flex flex-col justify-between space-y-0">
                  <span>
                    <User className="inline h-8 w-8 p-2 mr-2 mb-1 text-teal-700 bg-teal-700/10 rounded" />
                    <CardTitle className="inline text-sm font-medium">
                      {doctor.name}
                    </CardTitle>
                  </span>
                  <CardDescription className="ml-10">
                    {doctor.specialization ?? "N/A"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
