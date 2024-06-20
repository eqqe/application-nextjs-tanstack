import { assert, expect, it } from 'vitest';
import { fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { person, propertyTenancyInCommonCreateArgs, tenancyInCommon } from '@/tests/api/property/tenancyUtils';

it('Should not allow a user to create tenancy in common for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyTenancyInCommon.create(
                propertyTenancyInCommonCreateArgs({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: Property entities failed 'update' check, entity");

    const tenants = await user2.prisma.propertyTenancyInCommonTenant.findMany();
    assert.notOk(tenants.length);
});

it('Should allow a user to create tenancy in common for properties in their space', async () => {
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
                    propertyTenancy: {
                        include: {
                            properties: true,
                        },
                    },
                },
            },
            person: true,
        },
    });
    assert.equal(tenants.length, 1);
    assert.equal(tenants[0].propertyTenancyInCommon.siret, tenancyInCommon.siret);
    assert.deepEqual(tenants[0].person.birthDate, person.birthDate);
    assert.equal(tenants[0].propertyTenancyInCommon.propertyTenancy?.properties[0].surface, property.surface);
    assert.equal(tenants[0].propertyTenancyInCommon.propertyTenancy?.properties[0].ownerId, user2.userCreated.id);
    assert.equal(tenants[0].propertyTenancyInCommon.ownerId, user3.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            tenancy: {
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
            },
        },
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].tenancy?.tenancyType, 'InCommon');
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].tenancy?.tenancyInCommon?.ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].tenancy?.tenancyInCommon?.tenants[0].person.birthDate, person.birthDate);
    assert.deepEqual(properties[0].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
});
