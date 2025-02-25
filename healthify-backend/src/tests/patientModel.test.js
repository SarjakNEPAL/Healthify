const { Patient } = require('../models');

describe('Patient Model Tests', () => {
    beforeAll(async () => {
        await Patient.sync({ force: true });
    });

    afterAll(async () => {
        await Patient.destroy({ where: {} });
    });

    test('Create Patient - Success', async () => {
        const patient = await Patient.create({ name: 'Ram', phone: '1234567890', disease: 'Flu', address: 'lalitpur' });
        expect(patient.name).toBe('John Doe');
        expect(patient.phone).toBe('1234567890');
    });

    test('Patient Validation - Fail if missing phone number', async () => {
        try {
            await Patient.create({ name: 'Ram', disease: 'Flu', address: 'lalitpur' });
        } catch (error) {
            expect(error.message).toMatch('notNull Violation');
        }
    });

    test('Phone Number Unique Constraint - Fail if phone number already exists', async () => {
        await Patient.create({ name: 'Ram', phone: '1234567890', disease: 'Flu', address: 'lalitpur' });

        try {
            await Patient.create({ name: 'Ram', phone: '1234567890', disease: 'Cold', address: 'lalitpur' });
        } catch (error) {
            expect(error.message).toMatch('Unique violation');
        }
    });
});
