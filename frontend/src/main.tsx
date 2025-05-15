import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './globals.css'
import App from './App.tsx'
import AdminDashboard from './dashboards/admin/AdminDashboard.tsx';
import AdminProfile from './dashboards/admin/AdminProfile.tsx';
import AdminSettings from './dashboards/admin/AdminSettings.tsx';
import AdminUsers from './dashboards/admin/AdminUsers.tsx';
import ReceptionistDashboard from './dashboards/receptionist/ReceptionistDashboard.tsx';
import ReceptionistAppointments from './dashboards/receptionist/ReceptionistAppointments.tsx';
import ReceptionistTestResults from './dashboards/receptionist/ReceptionistTestResults.tsx';
import ReceptionistProfile from './dashboards/receptionist/ReceptionistProfile.tsx';
import DoctorAppointments from './dashboards/doctor/DoctorAppointments.tsx';
import DoctorDashboard from './dashboards/doctor/DoctorDashboard.tsx';
import DoctorPatientRecords from './dashboards/doctor/DoctorPatientRecords.tsx';
import DoctorPrescriptions from './dashboards/doctor/DoctorPrescriptions.tsx';
import DoctorProfile from './dashboards/doctor/DoctorProfile.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<App />} />
        <Route path="/admin">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/receptionist">
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
          <Route path="test-results" element={<ReceptionistTestResults />} />
          <Route path="profile" element={<ReceptionistProfile />} />
        </Route>
        <Route path="/doctor">
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patient-records" element={<DoctorPatientRecords />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

