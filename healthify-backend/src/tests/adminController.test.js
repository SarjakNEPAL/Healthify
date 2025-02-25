const request = require('supertest');
const app = require('../../src/server');
const { Admin } = require('../../src/models/Admin'); // Sequelize Admin model
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/Admin'); // Mock Sequelize models properly
jest.mock('jsonwebtoken'); // Mock JWT

describe('Admin Controller', () => {
  let token;

  beforeEach(() => {
    Admin.mockReset();
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should register a new admin successfully', async () => {
    const newAdmin = {
      email: 'admin@example.com',
      password: 'password123',
    };

    // Mock the behavior of Admin.create
    Admin.create.mockResolvedValue(newAdmin);

    const res = await request(app)
      .post('http://localhost:5000/api/auth/register') // Correct URL with protocol
      .send(newAdmin);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(newAdmin.email);
    expect(Admin.create).toHaveBeenCalledTimes(1); // Ensure Admin.create was called once
  });

  it('should handle errors during admin registration', async () => {
    const newAdmin = {
      email: 'admin@example.com',
      password: 'password123',
    };

    // Mock rejection for Admin.create
    Admin.create.mockRejectedValue(new Error('Something went wrong'));

    const res = await request(app)
      .post('http://localhost:5000/api/auth/register') // Correct URL with protocol
      .send(newAdmin);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Something went wrong');
  });

  it('should allow admin to view a list of organizations with a valid JWT token', async () => {
    const res = await request(app)
      .get('http://localhost:5000/api/organization') // Correct URL with protocol
      .set('Authorization', `Bearer ${token}`); // Add the Authorization header with the token

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Assuming the response contains an array of organizations
  });

  it('should reject admin access without a valid JWT token', async () => {
    const res = await request(app)
      .get('http://localhost:5000/api/organization'); // No token in the header

    expect(res.status).toBe(401); // Unauthorized if no token
    expect(res.body.message).toBe('Unauthorized');
  });
});
