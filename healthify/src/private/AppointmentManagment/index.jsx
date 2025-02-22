import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './AppointmentManagement.css';

const AppointmentManagement = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add appointment scheduling logic here
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav>
        <Link to="/" className="logo">
          <img src="../../../img/logo.png" alt="Healthify Logo" />
        </Link>
        <Link to="/" className="nav-title">
          <h1>Healthify</h1>
        </Link>
        <div id="trans">
          <Link to="/patients">Patients</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/staff">Staff</Link>
        </div>
      </nav>

      {/* Secondary Navigation (for smaller screens) */}
      <div id="subnav">
        <Link to="/patients">Patients</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/staff">Staff</Link>
      </div>

      {/* Main Content */}
      <div className="management">
        <h2>Manage Appointments</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="patientName">Patient Name</label>
          <input type="text" id="patientName" {...register('patientName', { required: true })} />
          <label htmlFor="doctorName">Doctor Name</label>
          <input type="text" id="doctorName" {...register('doctorName', { required: true })} />
          <label htmlFor="date">Date</label>
          <input type="date" id="date" {...register('date', { required: true })} />
          <label htmlFor="time">Time</label>
          <input type="time" id="time" {...register('time', { required: true })} />
          <button type="submit" className="button">Schedule Appointment</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentManagement;
