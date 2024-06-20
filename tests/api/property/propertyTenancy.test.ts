import { assert, expect, it } from 'vitest';
import { fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { propertyTenancyInCommonCreateArgs } from '@/tests/api/property/tenancyUtils';

it('Should allow a user to create property tenancy and list and group by them', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

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
});
