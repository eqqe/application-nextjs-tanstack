import { enhance } from '@zenstackhq/runtime';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { assert } from 'vitest';
import { slugAssetsApplication } from '@/zmodel/prisma/applications/createApplications';
import { Space } from '@zenstackhq/runtime/models';

const prisma = new PrismaClient();

export async function getEnhancedPrisma() {
    async function createUserWithSpace({ currentSpace }: { currentSpace?: Space }) {
        const testUser = {
            email: `${nanoid()}@gmail.com`,
            password: 'demo',
        };
        const userCreated = await prisma.user.create({ data: testUser });
        const space = await prisma.space.create({
            data: {
                name: `Test spaces ${testUser.email}`,
                members: {
                    create: [
                        {
                            role: 'ADMIN',
                            userId: userCreated.id,
                        },
                    ],
                },
            },
        });
        return {
            userCreated,
            space,
            testUser,
            prisma: enhance(prisma, {
                user: { ...userCreated, currentSpace: currentSpace ?? { id: space.id }, currentSpaceId: space.id },
            }),
        };
    }

    const user1 = await createUserWithSpace({});
    const user2 = await createUserWithSpace({});
    /* User3 is a member of User2's space and he is currently viewing the space */
    const user3 = await createUserWithSpace({ currentSpace: user2.space });
    await prisma.spaceUser.create({
        data: {
            role: 'USER',
            spaceId: user2.space.id,
            userId: user3.userCreated.id,
        },
    });
    assert.notEqual(user1.userCreated.id, user2.userCreated.id);
    assert.notEqual(user1.userCreated.id, user3.userCreated.id);
    assert.notEqual(user2.userCreated.id, user3.userCreated.id);

    /* Enable an application in User2 space */
    const application = await prisma.application.findUnique({
        where: { slug: slugAssetsApplication },
        include: {
            versions: true,
        },
    });

    assert(application);
    assert(application.versions.length);

    const version02 = application.versions.find((version) => version.versionMajor === 0 && version.versionMinor === 2);
    assert(version02);

    const spaceApplication = await prisma.spaceApplicationVersion.create({
        data: {
            applicationVersionId: version02.id,
            spaceId: user2.space.id,
        },
        include: {
            applicationVersion: {
                include: {
                    application: true,
                },
            },
        },
    });

    assert.equal(spaceApplication.spaceId, user2.space.id);
    assert.equal(spaceApplication.applicationVersion.applicationSlug, application.slug);

    return {
        user1,
        user2,
        user3,
    };
}
