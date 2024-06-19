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
    const include = {
        profiles: {
            include: {
                profile: {
                    include: {
                        spaces: true,
                    },
                },
            },
        },
    };
    let userCreated = await prisma.user.findUnique({
        where: {
            email: testUser.email,
        },
        include,
    });
    if (!userCreated) {
        userCreated = await prisma.user.upsert({
            create: testUser,
            update: {},
            where: {
                email: testUser.email,
            },
            include,
        });
    }

    let space: Space = userCreated.profiles[0]?.profile.spaces[0];
    if (!space) {
        const enhancedPrismaNoSpace = enhancePrisma({
            userId: userCreated.id,
            selectedSpaces: [],
        });
        space = await enhancedPrismaNoSpace.space.create(
            getNewSpace({ name: `Test spaces ${testUser.email}`, user: userCreated })
        );
    }

    currentSpace = currentSpace ?? space;
    const enhancedPrisma = enhancePrisma({
        userId: userCreated.id,
        selectedSpaces: [currentSpace.id],
    });
    async function enableAssets() {
        const applications = await enhancedPrisma.application.findMany(findManyApplicationArgs);

        const application = applications.find((app) => app.slug === slugAssetsApplication);
        assert(application);
        assert(application.versions.length);

        const lastVersion = application.versions[0];

        if (!lastVersion.activations.find((activation) => activation.spaceId === currentSpace?.id)) {
            const spaceApplication = await enhancedPrisma.spaceApplicationVersion.create({
                data: {
                    applicationVersionId: lastVersion.id,
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
    }
    return {
        userCreated: userCreated,
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
    await user2.prisma.space.update({
        where: {
            id: user2.space.id,
        },
        data: {
            profiles: {
                create: {
                    role: ProfileRole.USER,
                    users: {
                        create: {
                            userId: user3.userCreated.id,
                        },
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
