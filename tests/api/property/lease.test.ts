import { assert, expect, it } from 'vitest';
import { fakeLease, fakePayment, fakeProperty } from '@/components/Space/GenerateDemonstration';
import { getEnhancedPrisma } from '../../mock/enhanced-prisma';

it('Should not allow a user to create leases or payments for properties they do not own', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(async () => await user1.prisma.lease.create({ data: fakeLease(newProperty.id) })).rejects.toThrow(
        'denied by policy: lease entities'
    );
});

it('Should allow a user to create leases and payments for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    const lease2 = await user2.prisma.lease.create({ data: fakeLease(newProperty.id) });
    assert.equal(lease2.propertyId, newProperty.id);

    const lease3 = await user3.prisma.lease.create({ data: fakeLease(newProperty.id) });
    assert.equal(lease3.propertyId, newProperty.id);

    const payment2 = await user2.prisma.payment.create({ data: fakePayment(lease2.id) });
    assert.equal(payment2.leaseId, lease2.id);

    const payment2bis = await user2.prisma.payment.create({ data: fakePayment(lease3.id) });
    assert.equal(payment2bis.leaseId, lease3.id);

    const payment3 = await user2.prisma.payment.create({ data: fakePayment(lease2.id) });
    assert.equal(payment3.leaseId, lease2.id);

    const payment3Bis = await user2.prisma.payment.create({ data: fakePayment(lease3.id) });
    assert.equal(payment3Bis.leaseId, lease3.id);

    const include = {
        include: {
            leases: {
                include: {
                    payments: true,
                },
            },
            charges: true,
        },
    };
    const properties1 = await user1.prisma.property.findMany(include);
    assert.notOk(properties1.length);

    const properties2 = await user2.prisma.property.findMany(include);
    assert.equal(properties2.length, 1);
    assert.equal(properties2[0].id, newProperty.id);
    assert.equal(properties2[0].leases.length, 2);
    assert.equal(properties2[0].leases[0].payments.length, 2);
    assert.equal(properties2[0].leases[1].payments.length, 2);
    assert.equal(properties2[0].charges.length, 0);

    const properties3 = await user2.prisma.property.findMany(include);
    assert.equal(properties3.length, 1);
    assert.equal(properties3[0].id, newProperty.id);
    assert.equal(properties3[0].leases.length, 2);
    assert.equal(properties3[0].leases[0].payments.length, 2);
    assert.equal(properties3[0].leases[1].payments.length, 2);
    assert.equal(properties3[0].charges.length, 0);

    const leases1 = await user1.prisma.lease.findMany();
    assert.notOk(leases1.length);

    const leases2 = await user2.prisma.lease.findMany();
    assert.equal(leases2.length, 2);

    const leases3 = await user3.prisma.lease.findMany();
    assert.equal(leases3.length, 2);

    const payments1 = await user1.prisma.payment.findMany();
    assert.notOk(payments1.length);

    const payments2 = await user2.prisma.payment.findMany();
    assert.equal(payments2.length, 4);

    const payments3 = await user3.prisma.payment.findMany();
    assert.equal(payments3.length, 4);
});
