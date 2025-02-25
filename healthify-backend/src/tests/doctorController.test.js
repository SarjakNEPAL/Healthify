const request = require('supertest');
const app = require('../src/server');
const { Doctor } = require('../src/models');
const jwt = require('jsonwebtoken');
jest.mock('../src/models'); // Mock Sequelize models
jest.mock('jsonwebtoken'); // Mock JWT

describe('Doctor Controller', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should create a new doctor successfully with valid JWT', async () => {
    const newDoctor = {
      name: 'Dr. Smith',
      specialization: 'Cardiology',
    };

    Doctor.create.mockResolvedValue(newDoctor);

    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${token}`)
      .send(newDoctor);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newDoctor.name);
    expect(Doctor.create).toHaveBeenCalledTimes(1);
  });

  it('should reject doctor creation without a valid JWT', async () => {
    const newDoctor = {
      name: 'Dr. Smith',
      specialization: 'Cardiology',
    };

    const res = await request(app)
      .post('/api/doctors')
      .send(newDoctor);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should handle errors during doctor creation with JWT', async () => {
    const newDoctor = {
      name: 'Dr. Smith',
      specialization: 'Cardiology',
    };

    Doctor.create.mockRejectedValue(new Error('Something went wrong'));

    const res = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${token}`)
      .send(newDoctor);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Something went wrong');
  });
});
