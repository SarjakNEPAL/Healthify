const { authMiddleware } = require('../src/middleware/authMiddleware');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken'); // Mock the JWT module

describe('Auth Middleware', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Mock JWT token
  });

  it('should validate the token and attach the user to the request', async () => {
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: 1, role: 'admin' });
    });

    await authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: 1, role: 'admin' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    await authMiddleware(req, res, next);

    expect(res.status).toBe(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should throw an error if no token is provided', async () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toBe(401); // Unauthorized if no token
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});
