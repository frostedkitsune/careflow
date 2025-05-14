import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  appointments as initialAppointments,
  testResults as initialTestResults,
  medicalDocuments as initialDocuments,
  prescriptions as initialPrescriptions,
  users as initialUsers,
} from "./data"

interface Appointment {
  id: number
  patientId: number
  doctorId: number
  date: string
  time: string
  reason: string
  status: string
  notes: string
}

interface TestResult {
  id: number
  patientId: number
  name: string
  date: string
  status: string
  type: string
  uploadedBy: string
  results: string
}

interface Document {
  id: number
  patientId: number
  name: string
  date: string
  type: string
  size: string
}

interface Prescription {
  id: number
  patientId: number
  doctorId: number
  medication: string
  dosage: string
  duration: string
  date: string
  notes: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
}

interface CareFlowStore {
  // Data
  appointments: Appointment[]
  testResults: TestResult[]
  documents: Document[]
  prescriptions: Prescription[]
  users: User[]

  // Current user
  currentUser: { id: number; role: string } | null
  setCurrentUser: (user: { id: number; role: string } | null) => void

  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointment: (id: number, data: Partial<Appointment>) => void
  deleteAppointment: (id: number) => void

  // Test result actions
  addTestResult: (testResult: Omit<TestResult, "id">) => void
  updateTestResult: (id: number, data: Partial<TestResult>) => void
  deleteTestResult: (id: number) => void

  // Document actions
  addDocument: (document: Omit<Document, "id">) => void
  updateDocument: (id: number, data: Partial<Document>) => void
  deleteDocument: (id: number) => void

  // Prescription actions
  addPrescription: (prescription: Omit<Prescription, "id">) => void
  updatePrescription: (id: number, data: Partial<Prescription>) => void
  deletePrescription: (id: number) => void

  // User actions
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: number, data: Partial<User>) => void
  deleteUser: (id: number) => void
}

export const useCareFlowStore = create<CareFlowStore>()(
  persist(
    (set) => ({
      // Initial data
      appointments: initialAppointments,
      testResults: initialTestResults,
      documents: initialDocuments,
      prescriptions: initialPrescriptions,
      users: initialUsers,

      // Current user
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Appointment actions
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            { ...appointment, id: Math.max(0, ...state.appointments.map((a) => a.id)) + 1 },
          ],
        })),
      updateAppointment: (id, data) =>
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...data } : appointment,
          ),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        })),

      // Test result actions
      addTestResult: (testResult) =>
        set((state) => ({
          testResults: [
            ...state.testResults,
            { ...testResult, id: Math.max(0, ...state.testResults.map((t) => t.id)) + 1 },
          ],
        })),
      updateTestResult: (id, data) =>
        set((state) => ({
          testResults: state.testResults.map((testResult) =>
            testResult.id === id ? { ...testResult, ...data } : testResult,
          ),
        })),
      deleteTestResult: (id) =>
        set((state) => ({
          testResults: state.testResults.filter((testResult) => testResult.id !== id),
        })),

      // Document actions
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, { ...document, id: Math.max(0, ...state.documents.map((d) => d.id)) + 1 }],
        })),
      updateDocument: (id, data) =>
        set((state) => ({
          documents: state.documents.map((document) => (document.id === id ? { ...document, ...data } : document)),
        })),
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        })),

      // Prescription actions
      addPrescription: (prescription) =>
        set((state) => ({
          prescriptions: [
            ...state.prescriptions,
            { ...prescription, id: Math.max(0, ...state.prescriptions.map((p) => p.id)) + 1 },
          ],
        })),
      updatePrescription: (id, data) =>
        set((state) => ({
          prescriptions: state.prescriptions.map((prescription) =>
            prescription.id === id ? { ...prescription, ...data } : prescription,
          ),
        })),
      deletePrescription: (id) =>
        set((state) => ({
          prescriptions: state.prescriptions.filter((prescription) => prescription.id !== id),
        })),

      // User actions
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: Math.max(0, ...state.users.map((u) => u.id)) + 1 }],
        })),
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...data } : user)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
    }),
    {
      name: "careflow-storage",
    },
  ),
)
