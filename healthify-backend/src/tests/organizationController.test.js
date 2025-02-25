const request = require('supertest');
const app = require('../app');  // Assuming your Express app is exported from here
const { Organization } = require('../models');

describe('Organization Controller Tests', () => {
    beforeAll(async () => {
        await Organization.sync({ force: true });
    });

    afterAll(async () => {
        await Organization.destroy({ where: {} });
    });

    test('Create Organization - Success', async () => {
        const response = await request(app)
            .post('localhost:5000/api/organization')
            .send({
                name: 'Health Org',
                email: 'healthorg@example.com',
                address: '123 Health St',
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Organization created successfully');
        expect(response.body.organization.name).toBe('Health Org');
    });

    test('Create Organization - Fail if missing email', async () => {
        const response = await request(app)
            .post('localhost:5000/api/organization')
            .send({
                name: 'Health Org',
                address: '123 Health St',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email is required');
    });

    test('Delete Organization - Success', async () => {
        const organization = await Organization.create({
            name: 'Health Org',
            email: 'healthorg@example.com',
            address: '123 Health St',
            password: 'password123'
        });

        const response = await request(app)
            .delete(`localhost:5000/api/organization/${organization.email}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Organization deleted successfully');
    });

    test('Delete Organization - Fail if Organization not found', async () => {
        const response = await request(app)
            .delete('localhost:5000/api/organization/nonexistent@example.com');  // Non-existent email

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Organization not found');
    });
});
