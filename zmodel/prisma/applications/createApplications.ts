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
        await prisma.application.upsert({
            create: application,
            update: application,
            where: { slug: application.slug },
        });
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
