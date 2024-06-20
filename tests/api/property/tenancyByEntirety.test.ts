import { assert, expect, it } from 'vitest';
import { fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { person, propertyTenancyByEntiretyCreateArgs } from '@/tests/api/property/tenancyUtils';

it('Should not allow a user to create tenancy by entirety for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyTenancyByEntirety.create(
                propertyTenancyByEntiretyCreateArgs({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: Property entities failed 'update' check, entity");

    const tenancies = await user2.prisma.propertyTenancyByEntirety.findMany();
    assert.notOk(tenancies.length);
});

it('Should allow a user to create tenancy by entirety for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    await user3.prisma.propertyTenancyByEntirety.create(
        propertyTenancyByEntiretyCreateArgs({ property: newProperty, user: user1.userCreated })
    );

    const tenanciesByEntirety = await user2.prisma.propertyTenancyByEntirety.findMany({
        include: {
            propertyTenancy: {
                include: {
                    properties: true,
                },
            },
            person: true,
        },
    });
    assert.equal(tenanciesByEntirety.length, 1);
    assert.deepEqual(tenanciesByEntirety[0].person.birthDate, person.birthDate);
    assert.equal(tenanciesByEntirety[0].propertyTenancy?.properties[0].surface, property.surface);
    assert.equal(tenanciesByEntirety[0].propertyTenancy?.properties[0].ownerId, user2.userCreated.id);
    assert.equal(tenanciesByEntirety[0].ownerId, user3.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            tenancy: {
                include: {
                    tenancyByEntirety: {
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
    assert.equal(properties[0].tenancy?.tenancyType, 'ByEntirety');
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].tenancy?.tenancyByEntirety?.ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].tenancy?.tenancyByEntirety?.person.birthDate, person.birthDate);
});
