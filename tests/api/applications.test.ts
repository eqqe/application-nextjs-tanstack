import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '../mock/enhanced-prisma';
import { coreApplication } from '@/zmodel/prisma/applications/coreApplication';

it('Should list apps', async () => {
    const {
        user1: { prisma },
    } = await getEnhancedPrisma();
    const apps = await prisma.application.findMany();
    assert.deepEqual(
        apps.map((app) => app.slug),
        ['assets']
    );
});

it('Should enable an application in space', async () => {
    const {
        user1: { prisma, space },
    } = await getEnhancedPrisma();
    await prisma.spaceComponent.create({
        data: {
            name: 'test',
            type: 'List',
            spaceId: space.id,
        },
    });
    const application = await prisma.application.findUnique({
        where: { slug: coreApplication.slug },
        include: {
            versions: true,
        },
    });

    assert(application);
    assert(application.versions.length);

    const spaceApplication = await prisma.spaceApplicationVersion.create({
        data: {
            applicationVersionId: application.versions[0].id,
            spaceId: space.id,
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
    assert.equal(spaceApplication.applicationVersion.applicationId, application.id);

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
    assert.deepEqual(appDetails[0].applications[0].applicationVersion.folders[0].path, '/properties');
});
