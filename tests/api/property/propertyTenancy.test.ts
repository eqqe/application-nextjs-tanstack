import { assert, expect, it } from 'vitest';
import { fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { propertyJointTenancyCreateArgs, propertyTenancyInCommonCreateArgs } from '@/tests/api/property/tenancyUtils';
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

    const propertyTenancyInclude = {
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
                },
            },
        },
        orderBy: {
            createdAt: Prisma.SortOrder.desc,
        },
    };

    let properties = await user2.prisma.property.findMany(propertyTenancyInclude);

    assert.equal(properties.length, 2);
    assert.equal(properties[0].tenancy?.tenancyType, 'InCommon');
    assert.equal(properties[0].tenancy?.tenancyInCommon?.name, tenancyInCommon.name);
    assert.equal(properties[0].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[0].tenancy?.tenancyInCommon?.tenants.length, 1);
    assert.equal(properties[1].tenancy?.tenancyType, 'InCommon');
    assert.equal(properties[1].tenancy?.tenancyInCommon?.name, tenancyInCommon.name);
    assert.equal(properties[1].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[1].tenancy?.tenancyInCommon?.tenants.length, 1);

    const propertyTenanciesCountByType = await user2.prisma.propertyTenancy.groupBy({
        by: ['tenancyType'],
        _count: true,
    });
    assert.deepEqual(propertyTenanciesCountByType, [{ tenancyType: 'InCommon', _count: 1 }]);

    const newProperty2 = await user2.prisma.property.create({ data: fakeProperty() });

    await user3.prisma.propertyJointTenancy.create(
        propertyJointTenancyCreateArgs({ property: newProperty2, user: user1.userCreated })
    );

    properties = await user2.prisma.property.findMany(propertyTenancyInclude);

    assert.equal(properties[0].tenancy?.tenancyType, 'Joint');
    assert.equal(properties[0].tenancy?.jointTenancy?.tenants.length, 1);
    assert.equal(properties[1].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
    assert.equal(properties[2].tenancy?.tenancyInCommon?.intraCommunityVAT, tenancyInCommon.intraCommunityVAT);
});
