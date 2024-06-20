import { faker } from '@faker-js/faker';
import { PropertyType, ChargeType, PropertyTenancyType } from '@prisma/client';
import { z } from 'zod';
import {
    PropertyCreateScalarSchema,
    ChargeCreateScalarSchema,
    LeaseCreateScalarSchema,
    PersonCreateScalarSchema,
    PaymentCreateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
    PropertyTenancyInCommonTenantCreateScalarSchema,
    PropertyJointTenancyTenantCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';

export const cityPlaywrightTest = 'City to find in Playwright test';

const cities = Array.from({ length: 10 }).map(() => faker.location.city());
export const fakeProperty = (): z.infer<typeof PropertyCreateScalarSchema> => ({
    ...fakeAddress(),
    name: faker.word.noun(),
    propertyType: PropertyType.COMMERCIAL,
    surface: faker.number.int({ max: 50000, min: 100 }),
});

export const fakeLease = (): z.infer<typeof LeaseCreateScalarSchema> => ({
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    rentAmount: faker.number.int({ min: 5, max: 50000 }),
});

export const fakeTenancyInCommon = (): z.infer<typeof PropertyTenancyInCommonCreateScalarSchema> => ({
    ...fakeAddress(),
    siret: faker.finance.accountNumber(),
    siren: faker.finance.accountNumber(),
    codeNafApe: faker.finance.accountNumber(),
    intraCommunityVAT: faker.finance.accountNumber(),
    lei: faker.finance.accountNumber(),
    rcs: faker.finance.accountNumber(),
});

export const fakePerson = (): z.infer<typeof PersonCreateScalarSchema> => ({
    birthDate: faker.date.birthdate(),
});

const fakeAddress = () => ({
    streetAddress: faker.location.streetAddress(),
    city: cities[Math.floor(Math.random() * cities.length)],
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    state: faker.location.state(),
});
export const fakeInCommonTenant = (): z.infer<typeof PropertyTenancyInCommonTenantCreateScalarSchema> => {
    return {
        entryDate: faker.date.past(),
        exitDate: faker.date.recent(),
    };
};

export const fakeJointTenancyTenant = (): z.infer<typeof PropertyJointTenancyTenantCreateScalarSchema> => {
    return {};
};

export const fakePayment = (): z.infer<typeof PaymentCreateScalarSchema> => ({
    amount: faker.number.int({ min: 500, max: 5000 }),
    date: faker.date.past(),
});

export const fakeCharge = (): z.infer<typeof ChargeCreateScalarSchema> => ({
    chargeType: ChargeType.UTILITIES,
    amount: faker.number.int({ min: 5, max: 100 }),
    dueDate: faker.date.future(),
    description: faker.lorem.sentence(),
});

export function generateData({ length, spaceId }: { length: number; spaceId: string }) {
    return {
        where: {
            id: spaceId,
        },
        data: {
            properties: {
                create: Array.from({ length }).map((_) => ({
                    ...fakeProperty(),
                    charges: {
                        create: Array.from({ length }).map((_) => fakeCharge()),
                    },
                    leases: {
                        create: Array.from({ length }).map((_) => ({
                            ...fakeLease(),
                            payments: {
                                create: Array.from({ length }).map((_) => fakePayment()),
                            },
                        })),
                    },
                    tenancy: {
                        create: {
                            name: faker.word.noun(),
                            tenancyType: PropertyTenancyType.ByEntirety,
                            tenancyInCommon: {
                                create: {
                                    ...fakeTenancyInCommon(),
                                    tenants: {
                                        create: Array.from({ length }).map((_) => ({
                                            ...fakeInCommonTenant(),
                                            person: {
                                                create: {
                                                    ...fakePerson(),
                                                },
                                            },
                                        })),
                                    },
                                },
                            },
                        },
                    },
                })),
            },
        },
    };
}
