import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./public/Home/index";
import ProtectedRoute from './ProtectedRoute'; // Ensure correct import

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

          {/* ✅ Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* ✅ Organization Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["organization"]} />}>
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
            <Route path="/doctor-management" element={<DoctorManagement doctors={doctors} />} />
            <Route path="/staff-management" element={<StaffManagement staff={staff} />} />
            <Route path="/patient-management" element={<PatientManagement patients={patients} />} />
            <Route path="/appointment-management" element={<AppointmentManagement appointments={appointments} />} />
            <Route path="/doctor-registration" element={<DoctorRegistration addDoctor={addDoctor} />} />
            <Route path="/staff-registration" element={<StaffRegistration addStaff={addStaff} />} />
            <Route path="/patient-registration" element={<PatientRegistration addPatient={addPatient} />} />
            <Route path="/appointment-registration" element={<AppointmentRegistration addAppointment={addAppointment} />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
