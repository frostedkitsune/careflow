import { create } from 'zustand'

export interface AppointmentData {
  appointment: {
    id: number
    appointment_date: string // ISO date format (e.g., "2025-05-11")
    reschedule_date: string | null
    status: "BOOKED" | "CANCELLED" | "COMPLETED" | string // extend as needed
    record_ids: number[]
    reason: string
  }
  slot: {
    id: number
    available: boolean
    slot_time: string // ISO time format (e.g., "10:00:00Z")
    day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" | string
  }
  patient: {
    id: number
    name: string
    email: string
    phone: string
    dob: string // ISO date format (e.g., "1985-05-15")
    gender: "male" | "female" | "other" | string
    address: string
    emergency_person: string
    emergency_relation: string
    emergency_number: string
  }
}


interface AppointmentState {
  appointments: AppointmentData[]
  setAppointments: (data: AppointmentData[]) => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  setAppointments: (data) => set({ appointments: data })
}))
