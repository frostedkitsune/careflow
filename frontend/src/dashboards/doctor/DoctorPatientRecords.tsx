import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, User, FileText, Calendar, Pill } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { patients, getTestResultsForPatient, getAppointmentsForPatient, getPrescriptionsForPatient } from "@/lib/data"
import { useNavigate } from "react-router"

export default function DoctorPatientRecords() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.dob.includes(searchTerm) ||
      patient.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Patient Records</h1>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">DOB: {patient.dob}</p>
                      <p className="text-sm text-muted-foreground">Gender: {patient.gender}</p>
                      <p className="text-sm text-muted-foreground">Phone: {patient.phone}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => handleViewPatient(patient)}>
                      View Patient Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Record: {selectedPatient?.name}</DialogTitle>
            <DialogDescription>View complete patient information and medical history</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="test-results">Test Results</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Full Name</h4>
                          <p className="text-sm text-muted-foreground">{selectedPatient.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Date of Birth</h4>
                          <p className="text-sm text-muted-foreground">{selectedPatient.dob}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Gender</h4>
                          <p className="text-sm text-muted-foreground">{selectedPatient.gender}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Phone</h4>
                          <p className="text-sm text-muted-foreground">{selectedPatient.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Allergies</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === 1 ? "Penicillin" : "None reported"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Chronic Conditions</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === 1 ? "Hypertension" : "None reported"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Current Medications</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === 1 ? "Lisinopril 10mg daily" : "None reported"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Past Surgeries</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === 1 ? "Appendectomy (2018)" : "None reported"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                  {getAppointmentsForPatient(selectedPatient.id).length > 0 ? (
                    getAppointmentsForPatient(selectedPatient.id).map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                              <Calendar className="h-5 w-5 text-teal-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <h3 className="font-medium">{appointment.date}</h3>
                                <span className="mx-2">•</span>
                                <span className="text-sm text-muted-foreground">{appointment.time}</span>
                                <span
                                  className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                                    appointment.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : appointment.status === "Confirmed"
                                        ? "bg-blue-100 text-blue-800"
                                        : appointment.status === "Cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground">Notes: {appointment.notes}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No appointment history found</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="test-results" className="space-y-4">
                  {getTestResultsForPatient(selectedPatient.id).length > 0 ? (
                    getTestResultsForPatient(selectedPatient.id).map((result) => (
                      <Card key={result.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <h3 className="font-medium">{result.name}</h3>
                                <span className="mx-2">•</span>
                                <span className="text-sm text-muted-foreground">{result.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Type: {result.type}</p>
                              <p className="text-sm text-muted-foreground">Results: {result.results}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No test results found</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                  {getPrescriptionsForPatient(selectedPatient.id).length > 0 ? (
                    getPrescriptionsForPatient(selectedPatient.id).map((prescription) => (
                      <Card key={prescription.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                              <Pill className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <h3 className="font-medium">{prescription.medication}</h3>
                                <span className="mx-2">•</span>
                                <span className="text-sm text-muted-foreground">{prescription.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage}</p>
                              <p className="text-sm text-muted-foreground">Duration: {prescription.duration}</p>
                              {prescription.notes && (
                                <p className="text-sm text-muted-foreground">Notes: {prescription.notes}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <Pill className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No prescriptions found</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
