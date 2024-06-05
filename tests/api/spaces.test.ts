import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '../mock/enhanced-prisma';
import { SpaceUserRole } from '@prisma/client';
import { fakeProperty } from '@/components/Space/GenerateDemonstration';
import { enhancePrisma } from '@/server/enhanced-db';

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

    const newSpaceName = 'new space user 1';
    const newSpace = await user1.prisma.space.create({
        data: {
            name: newSpaceName,
            members: {
                create: [
                    {
                        userId: user1.userCreated.id,
                        role: SpaceUserRole.ADMIN,
                    },
                ],
            },
        },
    });
    await checkSpaces([newSpaceName, user1.space.name]);

    const property = fakeProperty();
    await user1.prisma.property.create({
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

    await user1PrismaNewSpace.property.create({
        data: {
            ...propertyNewSpace,
            name: 'Property test first space',
        },
    });

    propertiesNewSpace = await user1PrismaNewSpace.property.findMany();
    assert.equal(propertiesNewSpace.length, 1);
    assert.equal(propertiesNewSpace[0].address, propertyNewSpace.address);

    properties = await user1.prisma.property.findMany();
    assert.equal(properties.length, 1);
    assert.equal(properties[0].address, property.address);
});
