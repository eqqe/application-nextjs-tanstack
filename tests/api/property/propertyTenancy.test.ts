import { assert, expect, it } from 'vitest';
import { fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import {
    person,
    propertyJointTenancyCreateArgs,
    propertyTenancyByEntiretyCreateArgs,
    propertyTenancyInCommonCreateArgs,
} from '@/tests/api/property/tenancyUtils';
import { Prisma } from '@prisma/client';

it('Should allow a user to create property tenancy and list and group by them', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const newProperty = await user2.prisma.property.create({ data: fakeProperty() });

    const tenancyInCommon = await user3.prisma.propertyTenancyInCommon.create(
        propertyTenancyInCommonCreateArgs({ property: newProperty, user: user1.userCreated })
    );
    assert(tenancyInCommon.propertyTenancy?.id);
    await user2.prisma.property.create({
        data: {
            ...fakeProperty(),
            tenancyId: tenancyInCommon.propertyTenancy.id,
        },
    });

    const propertyTenancies = await user2.prisma.propertyTenancy.count();
    assert.equal(propertyTenancies, 1);

    function getProperties() {
        return user2.prisma.property.findMany({
            include: {
                tenancy: {
                    include: {
                        tenancyInCommon: {
                            include: {
                                tenants: true,
                            },
                        },
                        jointTenancy: {
                            include: {
                                tenants: true,
                            },
                        },
                        tenancyByEntirety: {
                            include: {
                                person: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
        });
    }
    let properties = await getProperties();

    assert.equal(properties.length, 2);
    assert.equal(properties[0].tenancy?.type, 'InCommon');
    assert.equal(properties[0].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[0].tenancy?.tenancyInCommon?.tenants.length, 1);
    assert.equal(properties[1].tenancy?.type, 'InCommon');
    assert.equal(properties[1].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[1].tenancy?.tenancyInCommon?.tenants.length, 1);

    function getPropertyTenanciesCountByType() {
        return user2.prisma.propertyTenancy.groupBy({
            by: ['type'],
            _count: true,
        });
    }

    let propertyTenanciesCountByType = await getPropertyTenanciesCountByType();
    assert.deepEqual(propertyTenanciesCountByType, [{ type: 'InCommon', _count: 1 }]);

    const newProperty3 = await user2.prisma.property.create({ data: fakeProperty() });

    await user3.prisma.propertyJointTenancy.create(
        propertyJointTenancyCreateArgs({ property: newProperty3, user: user1.userCreated })
    );

    properties = await getProperties();
    assert.equal(properties[0].tenancy?.type, 'Joint');
    assert.equal(properties[0].tenancy?.jointTenancy?.tenants.length, 1);
    assert.equal(properties[1].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[2].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);

    propertyTenanciesCountByType = await getPropertyTenanciesCountByType();

    assert.deepEqual(propertyTenanciesCountByType, [
        { type: 'InCommon', _count: 1 },
        { type: 'Joint', _count: 1 },
    ]);

    const newProperty4 = await user2.prisma.property.create({ data: fakeProperty() });

    await user3.prisma.propertyJointTenancy.create(
        propertyJointTenancyCreateArgs({ property: newProperty4, user: user1.userCreated })
    );

    properties = await getProperties();
    assert.equal(properties[0].tenancy?.type, 'Joint');
    assert.equal(properties[0].tenancy?.jointTenancy?.tenants.length, 1);
    assert.equal(properties[1].tenancy?.type, 'Joint');
    assert.equal(properties[2].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[3].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);

    propertyTenanciesCountByType = await getPropertyTenanciesCountByType();

    assert.deepEqual(propertyTenanciesCountByType, [
        { type: 'InCommon', _count: 1 },
        { type: 'Joint', _count: 2 },
    ]);

    const newProperty5 = await user2.prisma.property.create({ data: fakeProperty() });

    await user3.prisma.propertyTenancyByEntirety.create(
        propertyTenancyByEntiretyCreateArgs({ property: newProperty5, user: user1.userCreated })
    );

    properties = await getProperties();
    assert.equal(properties[0].tenancy?.type, 'ByEntirety');
    assert.equal(properties[0].tenancy?.tenancyByEntirety?.person.phone, person.phone);
    assert.equal(properties[1].tenancy?.type, 'Joint');
    assert.equal(properties[2].tenancy?.type, 'Joint');
    assert.equal(properties[3].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[4].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);

    propertyTenanciesCountByType = await getPropertyTenanciesCountByType();

    assert.deepEqual(propertyTenanciesCountByType, [
        { type: 'InCommon', _count: 1 },
        { type: 'Joint', _count: 2 },
        { type: 'ByEntirety', _count: 1 },
    ]);
});
