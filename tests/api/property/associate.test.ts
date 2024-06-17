import { assert, expect, it } from 'vitest';
import { fakeProperty, fakeCompany, fakePerson, fakeCompanyAssociate } from '@/lib/demo/fake';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { Property, PropertyOwnerType, User } from '@prisma/client';

const company = fakeCompany();
const person = fakePerson();

it('Should not allow a user to create associate for properties not in their space', async () => {
    const { user1, user2 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    expect(
        async () =>
            await user1.prisma.propertyOwner.create(
                propertyOwnerCreateArg({ property: newProperty, user: user1.userCreated })
            )
    ).rejects.toThrow("denied by policy: propertyOwner entities failed 'create' check");

    const associates = await user2.prisma.associate.findMany();
    assert.notOk(associates.length);
});

it('Should allow a user to create associates for properties in their space', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();

    const property = fakeProperty();

    const newProperty = await user2.prisma.property.create({ data: property });

    await user3.prisma.propertyOwner.create(propertyOwnerCreateArg({ property: newProperty, user: user1.userCreated }));

    const associates = await user2.prisma.associate.findMany({
        include: {
            companies: {
                include: {
                    company: {
                        include: {
                            properties: {
                                include: {
                                    property: true,
                                },
                            },
                        },
                    },
                },
            },
            person: true,
        },
    });
    assert.equal(associates.length, 1);
    assert.equal(associates[0].companies[0].company.siret, company.siret);
    assert.deepEqual(associates[0].person.birthDate, person.birthDate);
    assert.equal(associates[0].companies[0].company.properties.length, 1);
    assert.equal(associates[0].companies[0].company.properties[0].property.surface, property.surface);
    assert.equal(associates[0].companies[0].company.properties[0].property.ownerId, user2.userCreated.id);

    const properties = await user2.prisma.property.findMany({
        include: {
            owners: {
                include: {
                    company: {
                        include: {
                            associates: {
                                include: {
                                    associate: {
                                        include: {
                                            person: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    person: true,
                },
            },
        },
    });

    assert.equal(properties.length, 1);
    assert.equal(properties[0].spaceId, user2.space.id);
    assert.equal(properties[0].owners.length, 1);
    assert.equal(properties[0].surface, property.surface);
    assert.equal(properties[0].owners[0].ownerId, user3.userCreated.id);
    assert.deepEqual(properties[0].owners[0].type, 'Company');
    assert.deepEqual(properties[0].owners[0].company?.associates[0].associate.person.birthDate, person.birthDate);
    assert.equal(properties[0].owners[0].company?.intraCommunityVAT, company.intraCommunityVAT);
});
function propertyOwnerCreateArg({ property: property, user }: { property: Property; user: User }) {
    return {
        data: {
            property: {
                connect: {
                    id: property.id,
                },
            },
            type: PropertyOwnerType.Company,
            company: {
                create: {
                    ...company,
                    associates: {
                        create: {
                            ...fakeCompanyAssociate(),
                            associate: {
                                create: {
                                    person: {
                                        create: {
                                            ...person,
                                            user: {
                                                connect: {
                                                    id: user.id,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}
