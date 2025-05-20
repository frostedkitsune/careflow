import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppointmentData {
  appointment: {
    id: number
    appointment_date: string
    reschedule_date: string | null
    status: "BOOKED" | "CANCELLED" | "COMPLETED" | string
    record_ids: number[]
    reason: string
  }
  slot: {
    id: number
    available: boolean
    slot_time: string
    day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" | string
  }
  patient: {
    id: number
    name: string
    email: string
    phone: string
    dob: string
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

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: [],
      setAppointments: (data) => set({ appointments: data }),
    }),
    {
      name: 'appointment-storage',
     
    }
  )
)
