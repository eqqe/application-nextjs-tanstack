import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '../mock/enhanced-prisma';
import { slugAssetsApplication } from '@/zmodel/prisma/applications/createApplications';
import { Type } from '@prisma/client';

it('Should list apps', async () => {
    const {
        user1: { prisma },
    } = await getEnhancedPrisma();
    const apps = await prisma.application.findMany();
    assert.deepEqual(
        apps.map((app) => app.slug),
        [slugAssetsApplication]
    );
});

it('Should enable an application in space', async () => {
    const {
        user1: { prisma, space },
    } = await getEnhancedPrisma();
    await prisma.list.create({
        data: {
            name: 'test',
            space: {
                connect: {
                    id: space.id,
                },
            },
            table: {
                create: {
                    type: Type.List,
                },
            },
        },
    });
    const application = await prisma.application.findUnique({
        where: { slug: slugAssetsApplication },
        include: {
            versions: true,
        },
    });
    assert(application);
    assert(application.versions.length);

    const spaceApplication = await prisma.spaceApplicationVersion.create({
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

    assert.equal(spaceApplication.spaceId, space.id);
    assert.equal(spaceApplication.applicationVersion.applicationSlug, application.slug);

    const appDetails = await prisma.space.findMany({
        include: {
            applications: {
                include: {
                    applicationVersion: {
                        include: {
                            folders: true,
                        },
                    },
                },
            },
        },
    });
    assert.equal(appDetails.length, 1);
    assert.deepEqual(appDetails[0].applications[0].applicationVersion.folders[0].path, '/properties');
});
