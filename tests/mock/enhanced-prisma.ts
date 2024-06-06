import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { assert } from 'vitest';
import { slugAssetsApplication } from '@/zmodel/prisma/applications/createApplications';
import { Space, SpaceUserRole } from '@prisma/client';
import { enhancePrisma } from '@/server/enhanced-db';
import { getNewSpace } from '@/lib/getNewSpace';

const prisma = new PrismaClient();

export async function getEnhancedPrisma() {
    async function createUserWithSpace({ currentSpace }: { currentSpace?: Space }) {
        const testUser = {
            email: `${nanoid()}@gmail.com`,
            password: 'demo',
        };
        const userCreated = await prisma.user.create({ data: testUser });
        const space = await prisma.space.create(
            getNewSpace({ name: `Test spaces ${testUser.email}`, user: userCreated })
        );

        return {
            userCreated,
            space,
            testUser,
            prisma: enhancePrisma({ userId: userCreated.id, currentSpaceId: currentSpace?.id ?? space.id }),
        };
    }

    const user1 = await createUserWithSpace({});
    const user2 = await createUserWithSpace({});
    /* User3 is a member of User2's space and he is currently viewing the space */
    const user3 = await createUserWithSpace({ currentSpace: user2.space });
    await prisma.spaceUser.create({
        data: {
            profile: {
                create: {
                    role: SpaceUserRole.USER,
                    spaceId: user2.space.id,
                },
            },
            space: { connect: { id: user2.space.id } },
            user: { connect: { id: user3.userCreated.id } },
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
