import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { fakeLease, fakePayment, fakeProperty } from '@/lib/demo/fake';
import { enhancePrisma } from '@/server/enhanced-db';
import { getNewSpace } from '@/lib/getNewSpace';

it('Should list spaces, and check that only current space components are visible', async () => {
    const { user1 } = await getEnhancedPrisma();
    async function checkSpaces(names: string[]) {
        const spaces = await user1.prisma.space.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        assert.deepEqual(
            spaces.map((space) => space.name),
            names
        );
    }
    await checkSpaces([user1.space.name]);

    const name = 'new space user 1';
    const newSpace = await user1.prisma.space.create(getNewSpace({ name, user: user1.userCreated }));

    await checkSpaces([name, user1.space.name]);

    const property = fakeProperty();
    const newProperty = await user1.prisma.property.create({
        data: {
            ...property,
            name: 'Property test first space',
        },
    });

    let properties = await user1.prisma.property.findMany();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].address, property.address);

    const user1PrismaNewSpace = enhancePrisma({ userId: user1.userCreated.id, currentSpaceId: newSpace.id });
    let propertiesNewSpace = await user1PrismaNewSpace.property.findMany();
    assert.equal(propertiesNewSpace.length, 0);

    const propertyNewSpace = fakeProperty();

    const newPropertyNewSpace = await user1PrismaNewSpace.property.create({ data: propertyNewSpace });

    propertiesNewSpace = await user1PrismaNewSpace.property.findMany();
    assert.equal(propertiesNewSpace.length, 1);
    assert.equal(propertiesNewSpace[0].address, propertyNewSpace.address);

    properties = await user1.prisma.property.findMany();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].address, property.address);

    const lease = await user1.prisma.lease.create({ data: fakeLease(newProperty.id) });
    assert.equal(lease.propertyId, newProperty.id);

    const leaseNewSpace = await user1PrismaNewSpace.lease.create({ data: fakeLease(newPropertyNewSpace.id) });
    assert.equal(leaseNewSpace.propertyId, newPropertyNewSpace.id);

    const leasesNewSpace = await user1PrismaNewSpace.lease.findMany();
    assert.equal(leasesNewSpace.length, 1);
    assert.equal(leasesNewSpace[0].propertyId, newPropertyNewSpace.id);

    const leases = await user1.prisma.lease.findMany();
    assert.equal(leases.length, 1);
    assert.equal(leases[0].propertyId, newProperty.id);

    const payment = await user1.prisma.payment.create({ data: fakePayment(lease.id) });
    assert.equal(payment.leaseId, lease.id);

    const paymentNewSpace = await user1PrismaNewSpace.payment.create({ data: fakePayment(leaseNewSpace.id) });
    assert.equal(paymentNewSpace.leaseId, leaseNewSpace.id);

    const paymentsNewSpace = await user1PrismaNewSpace.payment.findMany();
    assert.equal(paymentsNewSpace.length, 1);
    assert.equal(paymentsNewSpace[0].leaseId, leaseNewSpace.id);

    const payments = await user1.prisma.payment.findMany();
    assert.equal(payments.length, 1);
    assert.equal(payments[0].leaseId, lease.id);
});
