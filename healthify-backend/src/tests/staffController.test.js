const request = require('supertest');
const app = require('../src/server');
const { Staff } = require('../src/models');
const jwt = require('jsonwebtoken');
jest.mock('../src/models'); // Mock Sequelize models
jest.mock('jsonwebtoken'); // Mock JWT

describe('Staff Controller', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should create a new staff member successfully with valid JWT', async () => {
    const newStaff = {
      name: 'Jane Doe',
      phone: '9876543210',
      branch: 'Cardiology',
    };

    Staff.create.mockResolvedValue(newStaff);

    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', `Bearer ${token}`)
      .send(newStaff);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newStaff.name);
    expect(Staff.create).toHaveBeenCalledTimes(1);
  });

  it('should reject staff creation without a valid JWT', async () => {
    const newStaff = {
      name: 'Jane Doe',
      phone: '9876543210',
      branch: 'Cardiology',
    };

    const res = await request(app)
      .post('/api/staff')
      .send(newStaff);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should handle errors during staff creation with JWT', async () => {
    const newStaff = {
      name: 'Jane Doe',
      phone: '9876543210',
      branch: 'Cardiology',
    };

    Staff.create.mockRejectedValue(new Error('Something went wrong'));

    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', `Bearer ${token}`)
      .send(newStaff);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Something went wrong');
  });
});
