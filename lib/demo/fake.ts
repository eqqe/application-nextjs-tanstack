import { faker } from '@faker-js/faker';
import { PropertyType, ChargeType } from '@prisma/client';
import { z } from 'zod';
import {
    CompanyCreateScalarSchema,
    PropertyCreateScalarSchema,
    PropertyAssociateCreateScalarSchema,
    ChargeCreateScalarSchema,
    LeaseCreateScalarSchema,
    PersonCreateScalarSchema,
    PaymentCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { Space } from '@zenstackhq/runtime/models';

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

export const fakeCompany = (): z.infer<typeof CompanyCreateScalarSchema> => ({
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

export const fakePropertyAssociate = (): z.infer<typeof PropertyAssociateCreateScalarSchema> => {
    return {
        entryDate: faker.date.past(),
        exitDate: faker.date.recent(),
    };
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

export const generateData = ({ length, currentSpace }: { length: number; currentSpace: Space }) => {
    return {
        where: {
            id: currentSpace.id,
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
                    propertyAssociates: {
                        create: Array.from({ length }).map((_) => ({
                            ...fakePropertyAssociate(),
                            associate: {
                                create: {
                                    company: {
                                        create: fakeCompany(),
                                    },
                                    person: {
                                        create: fakePerson(),
                                    },
                                },
                            },
                        })),
                    },
                })),
            },
        },
    };
};
