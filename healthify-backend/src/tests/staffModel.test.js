const { Staff } = require('../models');

describe('Staff Model Tests', () => {
    beforeAll(async () => {
        await Staff.sync({ force: true });
    });

    afterAll(async () => {
        await Staff.destroy({ where: {} });
    });

    test('Create Staff - Success', async () => {
        const staff = await Staff.create({ name: 'Jane Doe', phone: '9876543210', branch: 'Cardiology' });
        expect(staff.name).toBe('Jane Doe');
        expect(staff.phone).toBe('9876543210');
        expect(staff.branch).toBe('Cardiology');
    });

    test('Staff Validation - Fail if missing phone number', async () => {
        try {
            await Staff.create({ name: 'Jane Doe', branch: 'Cardiology' });
        } catch (error) {
            expect(error.message).toMatch('notNull Violation');
        }
    });

    test('Phone Number Unique Constraint - Fail if phone number already exists', async () => {
        await Staff.create({ name: 'Jane Doe', phone: '9876543210', branch: 'Cardiology' });

        try {
            await Staff.create({ name: 'John Smith', phone: '9876543210', branch: 'Pediatrics' });
        } catch (error) {
            expect(error.message).toMatch('Unique violation');
        }
    });
});
