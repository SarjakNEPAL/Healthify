import React, { lazy, Suspense } from 'react';
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./public/Home/index";
import ProtectedRoute from './ProtectedRoute'; // Make sure to import the ProtectedRoute component

const Register = lazy(() => import('./public/HospitalRegistration/index'));
const Login = lazy(() => import('./public/Login/index'));
const About = lazy(() => import('./public/About/index'));
const AdminPanel = lazy(() => import('./private/adminPanel/AdminDashboard'));
const HospitalDashboard = lazy(() => import('./private/HospitalDashboard/index'));
const PatientManagement = lazy(() => import('./private/PatientManagement/index'));
const StaffManagement = lazy(() => import('./private/StaffManagement/index'));
const AppointmentManagement = lazy(() => import('./private/AppointmentManagment/index'));
const DoctorManagement = lazy(() => import('./private/DoctorManagement/index'));
const PatientRegistration = lazy(() => import('./private/PatientManagement/PatientReg'));
const StaffRegistration = lazy(() => import('./private/StaffManagement/StaffReg'));
const DoctorRegistration = lazy(() => import('./private/DoctorManagement/DoctorReg'));
const AppointmentRegistration = lazy(() => import('./private/AppointmentManagment/AppointmentBook'));

function App() {
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const addDoctor = (doctor) => setDoctors([...doctors, doctor]);
  const addStaff = (staffMember) => setStaff([...staff, staffMember]);
  const addPatient = (patient) => setPatients([...patients, patient]);
  const addAppointment = (appointment) => setAppointments([...appointments, appointment]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} 
          />
          <Route 
            path="/hospital-dashboard" 
            element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} 
          />
          <Route
            path="/doctor-management"
            element={<ProtectedRoute><DoctorManagement doctors={doctors} /></ProtectedRoute>}
          />
          <Route
            path="/staff-management"
            element={<ProtectedRoute><StaffManagement staff={staff} /></ProtectedRoute>}
          />
          <Route
            path="/patient-management"
            element={<ProtectedRoute><PatientManagement patients={patients} /></ProtectedRoute>}
          />
          <Route
            path="/appointment-management"
            element={<ProtectedRoute><AppointmentManagement appointments={appointments} /></ProtectedRoute>}
          />
          <Route
            path="/doctor-registration"
            element={<ProtectedRoute><DoctorRegistration addDoctor={addDoctor} /></ProtectedRoute>}
          />
          <Route
            path="/staff-registration"
            element={<ProtectedRoute><StaffRegistration addStaff={addStaff} /></ProtectedRoute>}
          />
          <Route
            path="/patient-registration"
            element={<ProtectedRoute><PatientRegistration addPatient={addPatient} /></ProtectedRoute>}
          />
          <Route
            path="/appointment-registration"
            element={<ProtectedRoute><AppointmentRegistration addAppointment={addAppointment} /></ProtectedRoute>}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
