import { assert, it } from 'vitest';
import { fakeLease, fakeProperty, fakeTenant } from '@/lib/fake';
import { getEnhancedPrisma } from '../../mock/enhanced-prisma';

it('Should associate a tenant to a lease', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = await user2.prisma.property.create({ data: fakeProperty() });

    const lease = await user2.prisma.lease.create({ data: fakeLease(property.id) });

    const tenant = await user2.prisma.tenant.create({
        data: fakeTenant({ leaseId: lease.id, userId: user1.userCreated.id }),
    });

    assert.equal(tenant.leaseId, lease.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            leases: {
                include: {
                    tenants: true,
                },
            },
        },
    });

    const leasesUser1 = await user1.prisma.lease.findMany();

    assert.deepEqual(leasesUser1, []);

    assert.equal(properties[0].leases[0].tenants[0].userId, user1.userCreated.id);
});
