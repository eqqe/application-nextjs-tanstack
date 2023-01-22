import { assert, expect, it } from 'vitest';
import { fakeProperty, fakePropertyAssociate, fakeCompany, fakePerson } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';

it('Should not allow a user to create associate for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyAssociate.create({
                data: {
                    ...fakePropertyAssociate(),
                    property: {
                        connect: {
                            id: newProperty.id,
                        },
                    },
                    associate: {
                        create: {
                            user: {
                                connect: {
                                    id: user1.userCreated.id,
                                },
                            },
                            company: {
                                create: {
                                    ...fakeCompany(),
                                },
                            },
                            person: {
                                create: fakePerson(),
                            },
                        },
                    },
                },
            })
    ).rejects.toThrow('denied by policy: propertyAssociate entities');

    const associates = await user2.prisma.associate.findMany();
    assert.notOk(associates.length);
});

it('Should allow a user to create associates for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    const company = fakeCompany();
    const person = fakePerson();

    await user3.prisma.propertyAssociate.create({
        data: {
            ...fakePropertyAssociate(),
            property: {
                connect: {
                    id: newProperty.id,
                },
            },
            associate: {
                create: {
                    user: {
                        connect: {
                            id: user1.userCreated.id,
                        },
                    },
                    company: {
                        create: {
                            ...company,
                        },
                    },
                    person: {
                        create: person,
                    },
                },
            },
        },
    });

    const associates = await user2.prisma.associate.findMany({
        include: {
            propertyAssociates: {
                include: {
                    property: true,
                },
            },
            person: true,
            company: true,
        },
    });
    assert.equal(associates.length, 1);
    assert.equal(associates[0].company.siret, company.siret);
    assert.equal(associates[0].propertyAssociates.length, 1);
    assert.deepEqual(associates[0].person.birthDate, person.birthDate);
    assert.equal(associates[0].propertyAssociates[0].property.surface, property.surface);
    assert.equal(associates[0].propertyAssociates[0].ownerId, user3.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            propertyAssociates: {
                include: {
                    associate: {
                        include: {
                            company: true,
                            person: true,
                        },
                    },
                    property: true,
                },
            },
        },
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].propertyAssociates.length, 1);
    assert.deepEqual(properties[0].propertyAssociates[0].associate.person.birthDate, person.birthDate);
    assert.equal(properties[0].propertyAssociates[0].property.surface, property.surface);
    assert.equal(properties[0].propertyAssociates[0].ownerId, user3.userCreated.id);
    assert.equal(properties[0].propertyAssociates[0].associate.company.intraCommunityVAT, company.intraCommunityVAT);
});
