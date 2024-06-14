import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { slugAssetsApplication } from '@/zmodel/prisma/applications/createApplications';
import { Space, ProfileRole } from '@prisma/client';
import { enhancePrisma } from '@/server/enhanced-db';
import { getNewSpace } from '@/lib/getNewSpace';
import assert from 'assert';
import { findManyApplicationArgs } from '@/components/Application/Applications';

const prisma = new PrismaClient();

export async function createUserWithSpace({ currentSpace, email }: { currentSpace?: Space; email?: string }) {
    const testUser = {
        email: email ?? `${nanoid()}@gmail.com`,
        password: 'demo',
    };
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    const userCreated = await prisma.user.create({ data: testUser });
    const space = await prisma.space.create(getNewSpace({ name: `Test spaces ${testUser.email}`, user: userCreated }));

    currentSpace = currentSpace ?? space;
    const enhancedPrisma = enhancePrisma({
        userId: userCreated.id,
        currentSpaceIds: [currentSpace.id],
        createSpaceId: currentSpace.id,
    });
    async function enableAssets() {
        const applications = await enhancedPrisma.application.findMany(findManyApplicationArgs);

        const application = applications.find((app) => app.slug === slugAssetsApplication);
        assert(application);
        assert(application.versions.length);

        const spaceApplication = await enhancedPrisma.spaceApplicationVersion.create({
            data: {
                applicationVersionId: application.versions[0].id,
            },
            include: {
                applicationVersion: {
                    include: {
                        application: true,
                    },
                },
            },
        });

        assert.equal(spaceApplication.applicationVersion.applicationSlug, application.slug);
    }
    return {
        userCreated,
        space,
        currentSpace,
        testUser,
        prisma: enhancedPrisma,
        enableAssets,
    };
}

export async function getEnhancedPrisma() {
    const user1 = await createUserWithSpace({});
    const user2 = await createUserWithSpace({});
    /* User3 is a member of User2's space and he is currently viewing the space */
    const user3 = await createUserWithSpace({ currentSpace: user2.space });
    await prisma.space.update({
        where: {
            id: user2.space.id,
        },
        data: {
            profiles: {
                create: {
                    role: ProfileRole.USER,
                    users: {
                        connect: { id: user3.userCreated.id },
                    },
                },
            },
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
