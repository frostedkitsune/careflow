import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pill, Search, Filter, Plus } from "lucide-react"
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
import { patients, getPatientById } from "@/lib/data"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export default function DoctorPrescriptions() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const prescriptions = useCareFlowStore((state) => state.prescriptions)
  const addPrescription = useCareFlowStore((state) => state.addPrescription)

  const [searchTerm, setSearchTerm] = useState("")
  const [newPrescriptionDialogOpen, setNewPrescriptionDialogOpen] = useState(false)
  const [patientId, setPatientId] = useState("")
  const [medication, setMedication] = useState("")
  const [dosage, setDosage] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter prescriptions for the current doctor
  const doctorPrescriptions = currentUser
    ? prescriptions.filter((prescription) => prescription.doctorId === currentUser.id)
    : []

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

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId || !medication || !dosage || !duration) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)

    // Create new prescription
    const newPrescription = {
      patientId: Number.parseInt(patientId),
      doctorId: currentUser?.id || 0,
      medication,
      dosage,
      duration,
      date: new Date().toISOString().split("T")[0],
      notes,
    }

    // Add prescription to store
    addPrescription(newPrescription)

    // Reset form
    setPatientId("")
    setMedication("")
    setDosage("")
    setDuration("")
    setNotes("")
    setIsSubmitting(false)
    setNewPrescriptionDialogOpen(false)

    // Show success message
    toast("Prescription created", {
      description: "The prescription has been successfully created.",
    })
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setNewPrescriptionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
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
              <p className="text-muted-foreground mb-2">You haven't created any prescriptions yet</p>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => setNewPrescriptionDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={newPrescriptionDialogOpen} onOpenChange={setNewPrescriptionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Prescription</DialogTitle>
            <DialogDescription>Create a new prescription for a patient.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePrescription} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Input
                id="medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="e.g., Amoxicillin 500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 1 tablet 3 times daily"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7 days, 30 days, As needed"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Take with food, Avoid alcohol"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewPrescriptionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Prescription"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
