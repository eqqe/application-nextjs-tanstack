import { assert, it } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import { slugAssetsApplication } from '@/zmodel/prisma/applications/createApplications';

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
