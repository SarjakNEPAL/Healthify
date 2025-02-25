const request = require('supertest');
const app = require('../src/server');
const { Patient } = require('../src/models');
const jwt = require('jsonwebtoken');
jest.mock('../src/models'); // Mock Sequelize models
jest.mock('jsonwebtoken'); // Mock JWT

describe('Patient Controller', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should create a new patient successfully with valid JWT', async () => {
    const newPatient = {
      name: 'John Doe',
      phone: '1234567890',
      disease: 'Flu',
      address: '123 Main St',
    };

    Patient.create.mockResolvedValue(newPatient);

    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send(newPatient);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newPatient.name);
    expect(Patient.create).toHaveBeenCalledTimes(1);
  });

  it('should reject patient creation without a valid JWT', async () => {
    const newPatient = {
      name: 'John Doe',
      phone: '1234567890',
      disease: 'Flu',
      address: '123 Main St',
    };

    const res = await request(app)
      .post('/api/patients')
      .send(newPatient);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should handle errors during patient creation with JWT', async () => {
    const newPatient = {
      name: 'John Doe',
      phone: '1234567890',
      disease: 'Flu',
      address: '123 Main St',
    };

    Patient.create.mockRejectedValue(new Error('Something went wrong'));

    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send(newPatient);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Something went wrong');
  });
});
