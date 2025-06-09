import { create } from 'zustand';

interface Appointment {
  id: number;
  appointment_date: string;
  reschedule_date: string | null;
  status: "PENDING" | "BOOKED" | "REJECTED" | "DONE";
  record_ids: number[];
  reason: string;
}

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  emergency_person: string;
  emergency_relation: string;
  emergency_number: string;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

interface Slot {
  id: number;
  available: boolean;
  slot_time: string;
  day: string;
}

export interface AppointmentData {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
  slot: Slot;
}

interface AppointmentStore {
  appointments: AppointmentData[];
  fetchAppointments: () => Promise<void>;
  updateAppointmentStatus: (appointmentId: number, status: "PENDING" | "BOOKED" | "REJECTED" | "DONE") => void;
  rescheduleAppointment: (appointmentId: number, date: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  fetchAppointments: async () => {
    try {
      const response = await fetch("http://localhost:8000/receptionist/appointment");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      set({ appointments: data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateAppointmentStatus: (appointmentId, status) => {
    set((state) => ({
      appointments: state.appointments.map((appt) => 
        appt.appointment.id === appointmentId 
          ? { ...appt, appointment: { ...appt.appointment, status } } 
          : appt
      ),
    }));
  },
  rescheduleAppointment: async (appointmentId, date) => {
    try {
      const response = await fetch("http://localhost:8000/receptionist/appointment/reschedule", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          date,
        }),
      });
      if (!response.ok) throw new Error("Failed to reschedule appointment");
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));