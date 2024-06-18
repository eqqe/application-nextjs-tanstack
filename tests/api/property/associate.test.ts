import { assert, expect, it } from 'vitest';
import { fakeProperty, fakeTenancyInCommon, fakePerson, fakeInCommonTenant } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { Property, User } from '@prisma/client';

const company = fakeTenancyInCommon();
const person = fakePerson();

it('Should not allow a user to create associate for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyTenancyInCommon.create(
                propertyTenancyInCommonCreateArgs({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: propertyOwner entities failed 'create' check");

    const tenants = await user2.prisma.propertyTenancyInCommonTenant.findMany();
    assert.notOk(tenants.length);
});

it('Should allow a user to create associates for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    await user3.prisma.propertyTenancyInCommon.create(
        propertyTenancyInCommonCreateArgs({ property: newProperty, user: user1.userCreated })
    );

    const tenants = await user2.prisma.propertyTenancyInCommonTenant.findMany({
        include: {
            propertyTenancyInCommon: {
                include: {
                    properties: true,
                },
            },
            person: true,
        },
    });
    assert.equal(tenants.length, 1);
    assert.equal(tenants[0].propertyTenancyInCommon.siret, company.siret);
    assert.deepEqual(tenants[0].person.birthDate, person.birthDate);
    assert.equal(tenants[0].propertyTenancyInCommon.properties[0].surface, property.surface);
    assert.equal(tenants[0].propertyTenancyInCommon.properties[0].ownerId, user3.userCreated.id);
    assert.equal(tenants[0].propertyTenancyInCommon.ownerId, user2.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            tenancyInCommon: {
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
    assert.equal(properties[0].tenancyType, 'InCommon');
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].tenancyInCommon?.ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].tenancyInCommon?.tenants[0].person.birthDate, person.birthDate);
    assert.deepEqual(properties[0].tenancyInCommon?.intraCommunityVAT, company.intraCommunityVAT);
});
function propertyTenancyInCommonCreateArgs({ property, user }: { property: Property; user: User }) {
    return {
        data: {
            ...fakeTenancyInCommon(),
            properties: {
                connect: {
                    id: property.id,
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
    };
}
