import { assert, expect, it } from 'vitest';
import { fakeLease, fakeProperty } from '@/components/Space/GenerateDemonstration';
import { getEnhancedPrisma } from '../../mock/enhanced-prisma';

it('Should create / list properties', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();
    let properties = await user2.prisma.property.findMany();
    assert.notOk(properties.length);
    const property = fakeProperty();
    const newProperty = await user2.prisma.property.create({ data: property });

    assert.equal(newProperty.address, property.address);
    assert.equal(newProperty.postalCode, property.postalCode);

    /* Properties of user2 are seen by user3 member of the space */
    properties = await user2.prisma.property.findMany();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].address, property.address);
    assert.equal(properties[0].postalCode, property.postalCode);
    assert.equal(properties[0].id, newProperty.id);

    properties = await user3.prisma.property.findMany();
    assert.equal(properties.length, 1);

    assert.equal(properties[0].address, property.address);
    assert.equal(properties[0].postalCode, property.postalCode);
    assert.equal(properties[0].id, newProperty.id);

    properties = await user1.prisma.property.findMany();
    assert.equal(properties.length, 0);

    /* Private property */

    const fakePrivateProperty = fakeProperty();
    const privateProperty = await user2.prisma.property.create({
        data: {
            ...fakePrivateProperty,
            private: true,
        },
    });

    properties = await user2.prisma.property.findMany({ orderBy: { private: 'desc' } });
    assert.equal(properties.length, 2);
    assert.equal(properties[1].address, property.address);
    assert.equal(properties[1].postalCode, property.postalCode);
    assert.equal(properties[1].id, newProperty.id);
    assert.equal(properties[0].id, privateProperty.id);

    properties = await user3.prisma.property.findMany();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].address, property.address);
    assert.equal(properties[0].postalCode, property.postalCode);
    assert.equal(properties[0].id, newProperty.id);

    properties = await user1.prisma.property.findMany();
    assert.equal(properties.length, 0);

    /* Check that the user can create lease on a private property */
    const lease2 = await user2.prisma.lease.create({ data: fakeLease(privateProperty.id) });
    assert.equal(lease2.propertyId, privateProperty.id);

    /* Check user from space cannot add lease to private property of other user */
    expect(async () => await user3.prisma.lease.create({ data: fakeLease(privateProperty.id) })).rejects.toThrow(
        "denied by policy: lease entities failed 'create' check"
    );

    const leases1 = await user1.prisma.lease.findMany();
    assert.equal(leases1.length, 0);

    const leases2 = await user2.prisma.lease.findMany();
    assert.equal(leases2.length, 1);

    const leases3 = await user3.prisma.lease.findMany();
    assert.equal(leases3.length, 0);
});

it('Should allow a user to update properties they own', async () => {
    const { user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    const updatedProperty = await user2.prisma.property.update({
        where: { id: newProperty.id },
        data: { address: 'New Address' },
    });

    assert.equal(updatedProperty.address, 'New Address');
});

it('Should not allow a user to delete properties they do not own / allow if they own', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });
    let properties = await user2.prisma.property.findMany();
    assert.equal(properties.length, 1);

    /* A regex is used for the error messages because these expects can throw both depending on the run */
    expect(
        async () =>
            await user1.prisma.property.update({
                where: { id: newProperty.id },
                data: { address: 'User1 Address' },
            })
    ).rejects.toThrow(/denied by policy: property entities failed 'update' check|entity not found for model property/);

    expect(
        async () =>
            await user1.prisma.property.delete({
                where: { id: newProperty.id },
            })
    ).rejects.toThrow(/denied by policy: property entities failed 'delete' check|entity not found for model property/);

    properties = await user2.prisma.property.findMany();
    assert.equal(properties.length, 1);

    await user2.prisma.property.delete({
        where: { id: newProperty.id },
    });
    properties = await user2.prisma.property.findMany();
    assert.equal(properties.length, 0);
});
