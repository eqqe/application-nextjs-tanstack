import { fakeInCommonTenant, fakeJointTenancyTenant, fakePerson, fakeTenancyInCommon } from '@/lib/demo/fake';
import { Property, User, PropertyTenancyType } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const person = fakePerson();
export const tenancyInCommon = fakeTenancyInCommon();

export function propertyJointTenancyCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            propertyTenancy: {
                create: {
                    name: faker.word.noun(),
                    type: PropertyTenancyType.propertyJointTenancy,
                    properties: {
                        connect: {
                            id: property.id,
                        },
                    },
                },
            },
            tenants: {
                create: {
                    ...fakeJointTenancyTenant(),
                    person: {
                        create: {
                            ...person,
                            user: {
                                connect: {
                                    id: user.id,
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

export function propertyTenancyByEntiretyCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            propertyTenancy: {
                create: {
                    name: faker.word.noun(),
                    type: PropertyTenancyType.propertyTenancyByEntirety,
                    properties: {
                        connect: {
                            id: property.id,
                        },
                    },
                },
            },
            person: {
                create: {
                    ...person,
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            },
        },
    };
}

export function propertyTenancyInCommonCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            ...tenancyInCommon,
            propertyTenancy: {
                create: {
                    name: faker.word.noun(),
                    type: PropertyTenancyType.propertyTenancyInCommon,
                    properties: {
                        connect: {
                            id: property.id,
                        },
                    },
                },
            },
            tenants: {
                create: {
                    ...fakeInCommonTenant(),
                    person: {
                        create: {
                            ...person,
                            user: {
                                connect: {
                                    id: user.id,
                                },
                            },
                        },
                    },
                },
            },
        },
        include: {
            propertyTenancy: true,
        },
    };
}
