const request = require('supertest');
const app = require('../server');
const { Appointment } = require('../models/Appointment');
const jwt = require('jsonwebtoken');
jest.mock('../models/Appointment'); // Mock Sequelize models
jest.mock('jsonwebtoken'); // Mock JWT

describe('Appointment Controller', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should create an appointment successfully with valid JWT', async () => {
    const newAppointment = {
      doctorId: 1,
      patientId: 1,
      date: '2025-02-26T10:00:00Z',
    };

    Appointment.create.mockResolvedValue(newAppointment);

    const res = await request(app)
      .post('localhost:5000/api/appointment')
      .set('Authorization', `Bearer ${token}`)
      .send(newAppointment);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newAppointment);
    expect(Appointment.create).toHaveBeenCalledTimes(1);
  });

  it('should reject appointment creation without a valid JWT', async () => {
    const newAppointment = {
      doctorId: 1,
      patientId: 1,
      date: '2025-02-26T10:00:00Z',
    };

    const res = await request(app)
      .post('localhost:5000//api/appointment')
      .send(newAppointment);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should handle errors during appointment creation with JWT', async () => {
    const newAppointment = {
      doctorId: 1,
      patientId: 1,
      date: '2025-02-26T10:00:00Z',
    };

    Appointment.create.mockRejectedValue(new Error('Something went wrong'));

    const res = await request(app)
      .post('localhost:5000//api/appointment')
      .set('Authorization', `Bearer ${token}`)
      .send(newAppointment);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Something went wrong');
  });
});
