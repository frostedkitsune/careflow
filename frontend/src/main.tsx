import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import App from './App.tsx';
import AdminDashboard from './dashboards/admin/AdminDashboard.tsx';
import AdminProfile from './dashboards/admin/AdminProfile.tsx';
import AdminSettings from './dashboards/admin/AdminSettings.tsx';
import AdminUsers from './dashboards/admin/AdminUsers.tsx';
import DoctorAppointmentsDetails from './dashboards/doctor/DoctorAppointmentDetails.tsx';
import DoctorAppointments from './dashboards/doctor/DoctorAppointments.tsx';
import DoctorDashboard from './dashboards/doctor/DoctorDashboard.tsx';
import DoctorPrescriptions from './dashboards/doctor/DoctorPrescriptions.tsx';
import DoctorProfile from './dashboards/doctor/DoctorProfile.tsx';
import PatientAppointments from './dashboards/patient/PatientAppointments.tsx';
import PatientDashboard from './dashboards/patient/PatientDashboard.tsx';
import PatientDocuments from './dashboards/patient/PatientDocuments.tsx';
import PatientNewAppointment from './dashboards/patient/PatientNewAppointment.tsx';
import PatientProfile from './dashboards/patient/PatientProfile.tsx';
import PatientTestResults from './dashboards/patient/PatientTestResults.tsx';
import ReceptionistAppointments from './dashboards/receptionist/ReceptionistAppointments.tsx';
import ReceptionistDashboard from './dashboards/receptionist/ReceptionistDashboard.tsx';
import ReceptionistProfile from './dashboards/receptionist/ReceptionistProfile.tsx';
import ReceptionistTestResults from './dashboards/receptionist/ReceptionistTestResults.tsx';
import './globals.css';
import Index from './Index.tsx';
import ReceptionistSlots from './dashboards/receptionist/ReceptionistSlots.tsx';
import ReceptionistSlotsManager from './dashboards/receptionist/ReceptionistSlotsManager.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
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
          <Route path="slots" element={<ReceptionistSlots />} />
          <Route path="slots/:doctor_id" element={<ReceptionistSlotsManager />} />
          <Route path="test-results" element={<ReceptionistTestResults />} />
          <Route path="profile" element={<ReceptionistProfile />} />
        </Route>
        <Route path="/doctor">
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="appointment/:appointment_id" element={<DoctorAppointmentsDetails />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
        <Route path="/patient">
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="appointments/new" element={<PatientNewAppointment />} />
          <Route path="documents" element={<PatientDocuments />} />
          <Route path="test-results" element={<PatientTestResults />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

