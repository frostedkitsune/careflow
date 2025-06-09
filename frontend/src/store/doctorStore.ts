import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Doctor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
};

type DoctorState = {
  doctor: Doctor | null;
  setDoctor: (data: Doctor) => void;
};

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set) => ({
      doctor: null,
      setDoctor: (data: Doctor) => set({ doctor: data }),
    }),
    {
      name: "doctor-info",
    }
  )
);
