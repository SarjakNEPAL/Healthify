const { Doctor } = require('../models');

describe('Doctor Model Tests', () => {
    beforeAll(async () => {
        await Doctor.sync({ force: true });
    });

    afterAll(async () => {
        await Doctor.destroy({ where: {} });
    });

    test('Create Doctor - Success', async () => {
        const doctor = await Doctor.create({ name: 'Dr.shyam', specialization: 'Cardiology' });
        expect(doctor.name).toBe('Dr.shyam');
        expect(doctor.specialization).toBe('Cardiology');
    });

    test('Doctor Validation - Fail if missing name', async () => {
        try {
            await Doctor.create({ specialization: 'Cardiology' });
        } catch (error) {
            expect(error.message).toMatch('notNull Violation');
        }
    });

    test('Doctor Unique Constraint - Fail if doctor exists with same name and specialization', async () => {
        await Doctor.create({ name: 'Dr.shyam', specialization: 'Cardiology' });

        try {
            await Doctor.create({ name: 'Dr.shyam', specialization: 'Cardiology' });
        } catch (error) {
            expect(error.message).toMatch('Unique violation');
        }
    });
});
