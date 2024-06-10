import { assert, expect, it } from 'vitest';
import { fakeLease, fakeAssociate, fakeProperty, fakePropertyAssociate } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';

it('Should not allow a user to create associate for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    const associate1 = await user1.prisma.associate.create({ data: fakeAssociate(user1.userCreated.id) });
    expect(
        async () =>
            await user1.prisma.propertyAssociate.create({
                data: fakePropertyAssociate({ associateId: associate1.id, propertyId: newProperty.id }),
            })
    ).rejects.toThrow('denied by policy: propertyAssociate entities');

    const associates = await user2.prisma.associate.findMany();
    assert.notOk(associates.length);
});

it('Should allow a user to create associates for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    const associate = fakeAssociate(user1.userCreated.id);
    const associate2 = await user2.prisma.associate.create({ data: associate });
    assert.equal(associate2.userId, user1.userCreated.id);

    await user2.prisma.propertyAssociate.create({
        data: fakePropertyAssociate({ associateId: associate2.id, propertyId: newProperty.id }),
    });

    const associates = await user2.prisma.associate.findMany({
        include: {
            propertyAssociates: true,
        },
    });
    assert.equal(associates.length, 1);
    assert.equal(associates[0].spaceId, user2.space.id);
    assert.equal(associates[0].fiscalNumber, associate.fiscalNumber);
    assert.equal(associates[0].propertyAssociates.length, 1);
    assert.equal(associates[0].propertyAssociates[0].associateId, associate2.id);
    assert.equal(associates[0].propertyAssociates[0].propertyId, newProperty.id);
    assert.equal(associates[0].propertyAssociates[0].ownerId, user2.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            propertyAssociates: {
                include: {
                    associate: true,
                },
            },
        },
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].propertyAssociates.length, 1);
    assert.equal(properties[0].propertyAssociates[0].associateId, associate2.id);
    assert.equal(properties[0].propertyAssociates[0].propertyId, newProperty.id);
    assert.equal(properties[0].propertyAssociates[0].ownerId, user2.userCreated.id);
    assert.equal(properties[0].propertyAssociates[0].associate.fiscalNumber, associate.fiscalNumber);
});
