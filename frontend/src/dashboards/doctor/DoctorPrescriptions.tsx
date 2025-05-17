import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pill, Search, Filter } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { getPatientById } from "@/lib/data"
import { useNavigate } from "react-router"

export default function DoctorPrescriptions() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const prescriptions = useCareFlowStore((state) => state.prescriptions)

  const [searchTerm, setSearchTerm] = useState("")

  if (!currentUser) {
    navigate("/login")
    return null
  }

  // Filter prescriptions for the current doctor
  const doctorPrescriptions = prescriptions.filter((prescription) => prescription.doctorId === currentUser.id)

  // Filter prescriptions based on search term
  const filteredPrescriptions = doctorPrescriptions.filter((prescription) => {
    const patient = getPatientById(prescription.patientId)

    return (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.date.includes(searchTerm)
    )
  })

  // Sort prescriptions by date (recent first)
  const sortedPrescriptions = [...filteredPrescriptions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prescriptions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {sortedPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {sortedPrescriptions.map((prescription) => {
              const patient = getPatientById(prescription.patientId)

              return (
                <Card key={prescription.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <Pill className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">{prescription.medication}</h3>
                            <p className="text-sm text-muted-foreground">Patient: {patient?.name}</p>
                            <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage}</p>
                            <p className="text-sm text-muted-foreground">Duration: {prescription.duration}</p>
                            <p className="text-sm text-muted-foreground">Date: {prescription.date}</p>
                            {prescription.notes && (
                              <p className="text-sm text-muted-foreground">Notes: {prescription.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                        <Button variant="outline" size="sm">
                          Print
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Pill className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No prescriptions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
