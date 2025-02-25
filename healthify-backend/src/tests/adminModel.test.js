const { Admin } = require('../../src/models/Admin'); // Import the Admin model
const sequelize = require('../database/connection'); // Sequelize instance
const { DataTypes } = require('sequelize');

describe('Admin Model', () => {
  beforeAll(async () => {
    // Sync Sequelize models with in-memory SQLite for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close(); // Close the database connection after tests
  });

  it('should validate the admin data correctly', async () => {
    // Admin model is created through sequelize.define in your src/models/Admin.js
    const newAdmin = {
      email: 'admin@example.com',
      password: 'password123',
    };

    // Validate the model using `Admin.build()` instead of calling `Admin(sequelize, DataTypes)`
    const admin = Admin.build(newAdmin);

    // Validate if the instance is correct
    await expect(admin.validate()).resolves.not.toThrow();
  });

  it('should throw validation error for missing email', async () => {
    const invalidAdmin = {
      password: 'password123',
    };

    const admin = Admin.build(invalidAdmin);

    // Validate and expect an error for missing email
    await expect(admin.validate()).rejects.toThrow('email cannot be null');
  });
});
