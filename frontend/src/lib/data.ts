// Mock data for the healthcare management system

// Doctors
export const doctors = [
  { id: 1, name: "Dr. Michael Chen", specialty: "Cardiology", available: true },
  { id: 2, name: "Dr. Sarah Williams", specialty: "Dermatology", available: true },
  { id: 3, name: "Dr. James Wilson", specialty: "Neurology", available: true },
  { id: 4, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", available: true },
  { id: 5, name: "Dr. David Kim", specialty: "Orthopedics", available: true },
  { id: 6, name: "Dr. Lisa Thompson", specialty: "Psychiatry", available: false },
  { id: 7, name: "Dr. Robert Johnson", specialty: "Oncology", available: true },
  { id: 8, name: "Dr. Maria Garcia", specialty: "Gynecology", available: true },
]

// Patients
export const patients = [
  { id: 1, name: "John Doe", dob: "1985-06-15", gender: "Male", phone: "(555) 123-4567" },
  { id: 2, name: "Jane Smith", dob: "1990-03-22", gender: "Female", phone: "(555) 234-5678" },
  { id: 3, name: "Emily Johnson", dob: "1978-11-30", gender: "Female", phone: "(555) 345-6789" },
  { id: 4, name: "Robert Smith", dob: "1982-04-12", gender: "Male", phone: "(555) 456-7890" },
  { id: 5, name: "Maria Garcia", dob: "1995-08-05", gender: "Female", phone: "(555) 567-8901" },
  { id: 6, name: "James Wilson", dob: "1972-01-25", gender: "Male", phone: "(555) 678-9012" },
  { id: 7, name: "Jessica Williams", dob: "1988-07-17", gender: "Female", phone: "(555) 789-0123" },
  { id: 8, name: "David Martinez", dob: "1965-09-08", gender: "Male", phone: "(555) 890-1234" },
]

// Appointments
export const appointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    date: "2025-05-15",
    time: "10:00 AM",
    reason: "Annual checkup",
    status: "Confirmed",
    notes: "Patient has history of high blood pressure",
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 2,
    date: "2025-05-22",
    time: "2:30 PM",
    reason: "Skin rash consultation",
    status: "Confirmed",
    notes: "",
  },
  {
    id: 3,
    patientId: 3,
    doctorId: 1,
    date: "2025-05-15",
    time: "11:30 AM",
    reason: "Follow-up",
    status: "Pending",
    notes: "Follow-up after medication change",
  },
  {
    id: 4,
    patientId: 4,
    doctorId: 3,
    date: "2025-05-16",
    time: "9:00 AM",
    reason: "Headache consultation",
    status: "Pending",
    notes: "Patient reports frequent migraines",
  },
  {
    id: 5,
    patientId: 5,
    doctorId: 8,
    date: "2025-05-17",
    time: "3:00 PM",
    reason: "Annual checkup",
    status: "Confirmed",
    notes: "",
  },
  {
    id: 6,
    patientId: 6,
    doctorId: 5,
    date: "2025-05-18",
    time: "1:00 PM",
    reason: "Knee pain",
    status: "Confirmed",
    notes: "Patient has history of knee surgery",
  },
  {
    id: 7,
    patientId: 7,
    doctorId: 4,
    date: "2025-05-19",
    time: "10:30 AM",
    reason: "Fever and cough",
    status: "Pending",
    notes: "Patient has had symptoms for 3 days",
  },
  {
    id: 8,
    patientId: 8,
    doctorId: 7,
    date: "2025-05-20",
    time: "11:00 AM",
    reason: "Follow-up",
    status: "Confirmed",
    notes: "Follow-up after treatment",
  },
]

// Test Results
export const testResults = [
  {
    id: 1,
    patientId: 1,
    name: "Blood Test Results",
    date: "2025-04-28",
    status: "Available",
    type: "Blood Test",
    uploadedBy: "Sarah Johnson",
    results: "Normal blood count. Cholesterol slightly elevated.",
  },
  {
    id: 2,
    patientId: 1,
    name: "X-Ray Results",
    date: "2025-04-15",
    status: "Available",
    type: "X-Ray",
    uploadedBy: "Sarah Johnson",
    results: "No abnormalities detected in chest X-ray.",
  },
  {
    id: 3,
    patientId: 2,
    name: "Allergy Test Results",
    date: "2025-04-20",
    status: "Available",
    type: "Allergy Test",
    uploadedBy: "Sarah Johnson",
    results: "Positive for pollen and dust mite allergies.",
  },
  {
    id: 4,
    patientId: 3,
    name: "ECG Results",
    date: "2025-04-25",
    status: "Available",
    type: "ECG",
    uploadedBy: "Sarah Johnson",
    results: "Normal sinus rhythm. No abnormalities detected.",
  },
  {
    id: 5,
    patientId: 4,
    name: "MRI Results",
    date: "2025-04-30",
    status: "Available",
    type: "MRI",
    uploadedBy: "Sarah Johnson",
    results: "No significant findings in brain MRI.",
  },
]

// Medical Documents
export const medicalDocuments = [
  {
    id: 1,
    patientId: 1,
    name: "Medical History.pdf",
    date: "2025-01-15",
    type: "Medical History",
    size: "1.2 MB",
  },
  {
    id: 2,
    patientId: 1,
    name: "Insurance Information.pdf",
    date: "2025-02-10",
    type: "Insurance",
    size: "0.8 MB",
  },
  {
    id: 3,
    patientId: 1,
    name: "Previous Surgery Records.pdf",
    date: "2025-03-05",
    type: "Surgery Records",
    size: "2.5 MB",
  },
  {
    id: 4,
    patientId: 2,
    name: "Allergy Documentation.pdf",
    date: "2025-02-15",
    type: "Allergy Records",
    size: "0.5 MB",
  },
  {
    id: 5,
    patientId: 3,
    name: "Medication History.pdf",
    date: "2025-03-20",
    type: "Medication Records",
    size: "1.0 MB",
  },
]

// Prescriptions
export const prescriptions = [
  {
    id: 1,
    patientId: 5,
    doctorId: 1,
    medication: "Amoxicillin 500mg",
    dosage: "1 tablet 3 times daily",
    duration: "7 days",
    date: "2025-05-08",
    notes: "Take with food. Complete full course.",
  },
  {
    id: 2,
    patientId: 6,
    doctorId: 5,
    medication: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    duration: "30 days",
    date: "2025-05-07",
    notes: "Take in the morning. Monitor blood pressure.",
  },
  {
    id: 3,
    patientId: 2,
    doctorId: 2,
    medication: "Hydrocortisone Cream 1%",
    dosage: "Apply to affected area twice daily",
    duration: "14 days",
    date: "2025-05-06",
    notes: "Avoid contact with eyes.",
  },
  {
    id: 4,
    patientId: 4,
    doctorId: 3,
    medication: "Sumatriptan 50mg",
    dosage: "1 tablet at onset of migraine",
    duration: "As needed",
    date: "2025-05-05",
    notes: "Do not exceed 2 tablets in 24 hours.",
  },
]

// Users
export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "patient",
    status: "Active",
    lastLogin: "2025-05-10 09:15:22",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@careflow.health",
    role: "receptionist",
    status: "Active",
    lastLogin: "2025-05-10 08:30:45",
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    email: "dr.chen@careflow.health",
    role: "doctor",
    status: "Active",
    lastLogin: "2025-05-10 10:05:18",
  },
  {
    id: 4,
    name: "Admin User",
    email: "admin@careflow.health",
    role: "admin",
    status: "Active",
    lastLogin: "2025-05-10 07:45:33",
  },
  {
    id: 5,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "patient",
    status: "Active",
    lastLogin: "2025-05-09 14:22:10",
  },
  {
    id: 6,
    name: "Dr. Sarah Williams",
    email: "dr.williams@careflow.health",
    role: "doctor",
    status: "Active",
    lastLogin: "2025-05-09 16:40:55",
  },
  {
    id: 7,
    name: "Alex Johnson",
    email: "alex.johnson@careflow.health",
    role: "receptionist",
    status: "Inactive",
    lastLogin: "2025-05-01 11:30:20",
  },
  {
    id: 8,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "patient",
    status: "Active",
    lastLogin: "2025-05-08 09:15:40",
  },
]

// Helper functions to get data
export function getPatientById(id: number) {
  return patients.find((patient) => patient.id === id)
}

export function getDoctorById(id: number) {
  return doctors.find((doctor) => doctor.id === id)
}

export function getAppointmentsForPatient(patientId: number) {
  return appointments.filter((appointment) => appointment.patientId === patientId)
}

export function getAppointmentsForDoctor(doctorId: number) {
  return appointments.filter((appointment) => appointment.doctorId === doctorId)
}

export function getTestResultsForPatient(patientId: number) {
  return testResults.filter((result) => result.patientId === patientId)
}

export function getDocumentsForPatient(patientId: number) {
  return medicalDocuments.filter((document) => document.patientId === patientId)
}

export function getPrescriptionsForPatient(patientId: number) {
  return prescriptions.filter((prescription) => prescription.patientId === patientId)
}

export function getPrescriptionsByDoctor(doctorId: number) {
  return prescriptions.filter((prescription) => prescription.doctorId === doctorId)
}

export function getUsersByRole(role: string) {
  return users.filter((user) => user.role === role)
}
