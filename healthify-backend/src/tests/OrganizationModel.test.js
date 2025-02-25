const { Organization } = require('../models');

describe('Organization Model Tests', () => {
    beforeAll(async () => {
        await Organization.sync({ force: true });
    });

    afterAll(async () => {
        await Organization.destroy({ where: {} });
    });

    test('Create Organization - Success', async () => {
        const organization = await Organization.create({ name: 'Org1', email: 'org1@example.com', address: '123 Main St', password: 'password123' });
        expect(organization.name).toBe('Org1');
        expect(organization.email).toBe('org1@example.com');
    });

    test('Organization Validation - Fail if missing email', async () => {
        try {
            await Organization.create({ name: 'Org1', address: '123 Main St', password: 'password123' });
        } catch (error) {
            expect(error.message).toMatch('notNull Violation');
        }
    });

    test('Email Unique Constraint - Fail if email already exists', async () => {
        await Organization.create({ name: 'Org1', email: 'org1@example.com', address: '123 Main St', password: 'password123' });

        try {
            await Organization.create({ name: 'Org2', email: 'org1@example.com', address: '456 Oak St', password: 'password456' });
        } catch (error) {
            expect(error.message).toMatch('Unique violation');
        }
    });
});
