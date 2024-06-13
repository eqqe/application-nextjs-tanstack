import { PrismaClient } from '@prisma/client';
import { createApplications } from './applications/createApplications';
import { testUser } from '@/lib/demo/testUser';
import { createUserWithSpace } from '@/tests/mock/enhanced-prisma';

const prisma = new PrismaClient();
async function main() {
    await prisma.user.deleteMany();
    await prisma.application.deleteMany();
    createApplications(prisma);
    const user = await createUserWithSpace({ email: testUser.email });
    await user.enableAssets();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
