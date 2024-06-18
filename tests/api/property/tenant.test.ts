import { assert, it } from 'vitest';
import { fakeLease, fakePerson, fakeProperty } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';

it('Should associate a tenant to a lease', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = await user2.prisma.property.create({
        data: fakeProperty(),
    });

    const lease = await user2.prisma.lease.create({ data: { ...fakeLease(), propertyId: property.id } });

    const person = fakePerson();
    const tenant = await user2.prisma.leaseTenant.create({
        data: {
            lease: {
                connect: {
                    id: lease.id,
                },
            },
            person: {
                create: {
                    ...person,
                    user: {
                        connect: {
                            id: user1.userCreated.id,
                        },
                    },
                },
            },
            tenantType: 'Person',
        },
    });

    assert.equal(tenant.leaseId, lease.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            leases: {
                include: {
                    tenants: {
                        include: {
                            person: true,
                            lease: true,
                        },
                    },
                },
            },
        },
    });

    const leasesUser1 = await user1.prisma.lease.findMany();

    assert.deepEqual(leasesUser1, []);

    assert.equal(properties[0].leases[0].tenants[0].person?.userId, user1.userCreated.id);
    assert.deepEqual(properties[0].leases[0].tenants[0].person?.birthDate, person.birthDate);
    assert.deepEqual(properties[0].leases[0].tenants[0].lease.startDate, lease.startDate);
});
