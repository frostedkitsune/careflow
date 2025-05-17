import { create } from 'zustand'

interface Appointment {
  appointment: {
    id: number
    appointment_date: string
    status: string
    [key: string]: any
  }
  slot: {
    slot_time: string
    [key: string]: any
  }
  patient: {
    name: string
    [key: string]: any
  }
}

interface AppointmentState {
  appointments: Appointment[]
  setAppointments: (data: Appointment[]) => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  setAppointments: (data) => set({ appointments: data })
}))
