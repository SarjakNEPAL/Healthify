const Appointment = require('../models/Appointment'); // Import the Appointment model

const sequelize = require('../src/database/connection'); // Sequelize instance
const { DataTypes } = require('sequelize');

describe('Appointment Model', () => {
  it('should validate the appointment data correctly', async () => {
    const newAppointment = {
      doctorName: 'Dr. Smith',
      patientNumber: '12345',
      date: '2025-02-26T10:00:00Z',
      time: '10:00:00',
    };

    // Create a new instance of Appointment
    const appointment = Appointment.build(newAppointment);

    // Validate if the instance is correct
    await expect(appointment.validate()).resolves.not.toThrow();
  });

  it('should throw validation error for missing doctorName', async () => {
    const invalidAppointment = {
      patientNumber: '12345',
      date: '2025-02-26T10:00:00Z',
      time: '10:00:00',
    };

    const appointment = Appointment.build(invalidAppointment);

    // Validate and expect an error for missing doctorName
    await expect(appointment.validate()).rejects.toThrow('doctorName cannot be null');
  });
});
