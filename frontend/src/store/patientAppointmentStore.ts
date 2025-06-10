// lib/store/patientAppointmentStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Appointment {
  id: number
  appointment_date: string
  reschedule_date: string | null
  status: 'BOOKED' | 'DONE' | 'PENDING' | 'REJECTED'
  record_ids: number[]
  reason: string
}

export interface Slot {
  id: number
  available: boolean
  slot_time: string
  day: string
}

export interface Doctor {
  id: number
  name: string
  email: string
  phone: string
  specialization: string
}

export interface PatientAppointment {
  appointment: Appointment
  slot: Slot
  doctor: Doctor
}

interface PatientAppointmentState {
  appointments: PatientAppointment[]
  setAppointments: (appointments: PatientAppointment[]) => void
}

export const usePatientAppointmentStore = create<
  PatientAppointmentState
>()(
  persist(
    (set) => ({
      appointments: [],
      setAppointments: (appointments) => set({ appointments }),
    }),
    {
      name: 'patient-appointment-storage',
    }
  )
)
