import { assert, expect, it } from 'vitest';
import { fakeProperty, fakeTenancyInCommon, fakePerson, fakeJointTenancyTenant } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { Property, User, PropertyTenancyType } from '@prisma/client';

const tenancyInCommon = fakeTenancyInCommon();
const person = fakePerson();

it('Should not allow a user to create tenancy in common for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyJointTenancy.create(
                propertyJointTenancyCreateArgs({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: propertyJointTenancy entities failed 'create' check, entity");

    const tenants = await user2.prisma.propertyTenancyInCommonTenant.findMany();
    assert.notOk(tenants.length);
});

it('Should allow a user to create tenancy in common for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    await user3.prisma.propertyJointTenancy.create(
        propertyJointTenancyCreateArgs({ property: newProperty, user: user1.userCreated })
    );
    const jointTenancies = await user2.prisma.propertyJointTenancy.findMany({
        include: {
            propertyTenancies: {
                include: {
                    property: true,
                },
            },
            tenants: {
                include: {
                    person: true,
                },
            },
        },
    });
    assert.equal(jointTenancies.length, 1);
    assert.deepEqual(jointTenancies[0].tenants[0].person.birthDate, person.birthDate);
    assert.equal(jointTenancies[0].propertyTenancies[0].property.surface, property.surface);
    assert.equal(jointTenancies[0].propertyTenancies[0].property.ownerId, user2.userCreated.id);
    assert.equal(jointTenancies[0].ownerId, user3.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            tenancy: {
                include: {
                    jointTenancy: {
                        include: {
                            tenants: {
                                include: {
                                    person: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].tenancy?.tenancyType, 'Joint');
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].tenancy?.jointTenancy?.ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].tenancy?.jointTenancy?.tenants[0].person.birthDate, person.birthDate);
});

function propertyJointTenancyCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            propertyTenancies: {
                create: {
                    tenancyType: PropertyTenancyType.Joint,
                    property: {
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
