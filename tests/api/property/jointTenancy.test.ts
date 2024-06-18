import { assert, expect, it } from 'vitest';
import { fakeProperty, fakeTenancyInCommon, fakePerson, fakeJointTenancyTenant } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { Property, User } from '@prisma/client';

const tenancyInCommon = fakeTenancyInCommon();
const person = fakePerson();

it('Should not allow a user to create tenancy in common for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: { ...property, tenancyType: 'Joint' } });

    expect(
        async () =>
            await user1.prisma.propertyJointTenancy.create(
                propertyJointTenancyCreateArgs({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: Property entities failed 'update' check");

    const tenants = await user2.prisma.propertyTenancyInCommonTenant.findMany();
    assert.notOk(tenants.length);
});

it('Should allow a user to create tenancy in common for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: { ...property, tenancyType: 'Joint' } });

    await user3.prisma.propertyJointTenancy.create(
        propertyJointTenancyCreateArgs({ property: newProperty, user: user1.userCreated })
    );
    const jointTenancies = await user2.prisma.propertyJointTenancy.findMany({
        include: {
            properties: true,
            tenants: {
                include: {
                    person: true,
                },
            },
        },
    });
    assert.equal(jointTenancies.length, 1);
    assert.deepEqual(jointTenancies[0].tenants[0].person.birthDate, person.birthDate);
    assert.equal(jointTenancies[0].properties[0].surface, property.surface);
    assert.equal(jointTenancies[0].properties[0].ownerId, user2.userCreated.id);
    assert.equal(jointTenancies[0].ownerId, user3.userCreated.id);

    const properties = await user2.prisma.property.findMany({
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
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].tenancyType, 'Joint');
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].jointTenancy?.ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].jointTenancy?.tenants[0].person.birthDate, person.birthDate);
});

function propertyJointTenancyCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            properties: {
                connect: {
                    id: property.id,
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
