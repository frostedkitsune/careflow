import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './globals.css'
import App from './App.tsx'
import AdminDashboard from './dashboards/admin/AdminDashboard.tsx';
import AdminProfile from './dashboards/admin/AdminProfile.tsx';
import AdminSettings from './dashboards/admin/AdminSettings.tsx';
import AdminUsers from './dashboards/admin/AdminUsers.tsx';

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
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

