import { PrismaClient } from '@prisma/client';
import { createApplications } from './applications/createApplications';
import { testUser } from '@/lib/testUser';

const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (!user) {
        await prisma.user.create({ data: testUser });
    }
    createApplications(prisma);
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
