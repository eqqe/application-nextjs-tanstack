import { fakeInCommonTenant, fakeJointTenancyTenant, fakePerson, fakeTenancyInCommon } from '@/lib/demo/fake';
import { Property, PropertyTenancyType, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const person = fakePerson();
export const tenancyInCommon = fakeTenancyInCommon();

export function propertyJointTenancyCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            propertyTenancy: {
                create: {
                    name: faker.word.noun(),
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
                    type: PropertyTenancyType.ByEntirety,
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
                    type: PropertyTenancyType.InCommon,
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
