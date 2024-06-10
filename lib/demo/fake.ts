import { faker } from '@faker-js/faker';
import { PropertyType, ChargeType } from '@prisma/client';

export const cities = Array.from({ length: 10 }).map(() => faker.location.city());
export const fakeProperty = (postalCode?: string) => {
    return {
        name: faker.word.noun(),
        address: faker.location.streetAddress(),
        city: cities[Math.floor(Math.random() * cities.length)],
        propertyType: PropertyType.COMMERCIAL,
        postalCode: postalCode ?? faker.location.zipCode(),
        country: faker.location.country(),
        surface: faker.number.int({ max: 5000, min: 100 }),
    };
};

export const fakeLease = (propertyId: string) => {
    return {
        propertyId,
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        rentAmount: faker.number.float({ min: 5, max: 50 }),
    };
};

export const fakeTenant = ({ userId, leaseId }: { userId: string; leaseId: string }) => {
    return {
        leaseId,
        userId,
    };
};
export const fakePayment = (leaseId: string) => {
    return {
        leaseId,
        amount: faker.number.bigInt({ min: 500, max: 5000 }),
        date: faker.date.past(),
    };
};

const fakeCharge = ({ propertyId, leaseId }: { propertyId: string; leaseId: string }) => {
    return {
        propertyId,
        leaseId,
        chargeType: ChargeType.UTILITIES,
        amount: faker.number.bigInt({ min: 5, max: 100 }),
        dueDate: faker.date.future(),
        description: faker.lorem.sentence(),
    };
};

export const generateData = ({ length }: { length: number }) => {
    const prefix = `demo_${Date.now()}_`;

    const dashboards = Array.from({ length }).map((_, index) => ({
        name: `${prefix}Dashboard${index}`,
    }));

    const lists = Array.from({ length }).map((_, index) => ({
        name: `${prefix}List${index}`,
    }));

    const properties = Array.from({ length }).map((_, index) => ({
        ...fakeProperty(index === 0 ? 'Property to find in Playwright test' : void 0),
        id: `${prefix}Property${index}`,
        name: `${prefix}Property${index}`,
    }));

    const propertyId = `${prefix}Property${0}`;
    const leases = Array.from({ length }).map((_, index) => ({
        ...fakeLease(propertyId),
        id: `${prefix}Lease${index}`,
    }));

    const leaseId = `${prefix}Lease${0}`;
    const payments = Array.from({ length }, () => fakePayment(leaseId));
    const charges = Array.from({ length }, () => fakeCharge({ propertyId, leaseId }));

    return { dashboards, lists, properties, leases, payments, charges };
};
