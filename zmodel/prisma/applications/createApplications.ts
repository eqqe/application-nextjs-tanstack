import { PrismaClient, Prisma } from '@prisma/client';
import { assetsv0_1, assetsv0_2 } from './assets/versions';

export const slugAssetsApplication = 'Assets';

/* Existing application versions in the database will not be modified */
const applications = [
    createApplicationConnectVersions({
        slug: slugAssetsApplication,
        applicationVersions: [assetsv0_1, assetsv0_2],
    }),
];

export async function createApplications(prisma: PrismaClient) {
    for (const application of applications) {
        // Upsert the application itself
        const applicationUpserted = await prisma.application.upsert({
            create: {
                slug: application.slug,
                versions: {
                    create: [],
                },
            },
            update: {},
            where: { slug: application.slug },
        });

        // Upsert the application versions
        for (const version of application.versions.connectOrCreate) {
            await prisma.applicationVersion.upsert({
                create: {
                    ...version.create,
                    application: {
                        connect: { id: applicationUpserted.id },
                    },
                },
                update: {
                    folders: {
                        deleteMany: {},
                        ...version.create.folders,
                    },
                },
                where: version.where,
            });
        }
    }
}

function createApplicationConnectVersions({
    slug,
    applicationVersions,
}: {
    slug: string;
    applicationVersions: Prisma.ApplicationVersionCreateWithoutApplicationInput[];
}) {
    return {
        slug,
        versions: {
            connectOrCreate: applicationVersions.map((applicationVersion) => ({
                create: applicationVersion,
                where: {
                    applicationSlug_versionMinor_versionMajor: {
                        applicationSlug: slug,
                        versionMinor: applicationVersion.versionMinor,
                        versionMajor: applicationVersion.versionMajor,
                    },
                },
            })),
        },
    };
}
