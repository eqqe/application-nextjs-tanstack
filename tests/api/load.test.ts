import { expect, test } from 'vitest';
import { getEnhancedPrisma } from '../mock/enhanced-prisma';
import { generateData } from '@/lib/fake';
import { PrismaClient } from '@zenstackhq/runtime/models';

test('Load a lot of data for 3 users', async () => {
    const length = 1000;
    async function writeFakeData({ prisma }: { prisma: PrismaClient }) {
        const { dashboards, lists, properties, leases, payments, charges } = generateData({ length });

        await prisma.dashboard.createMany({ data: dashboards });
        await prisma.list.createMany({ data: lists });
        await prisma.property.createMany({ data: properties });
        await prisma.lease.createMany({ data: leases });
        await prisma.payment.createMany({ data: payments });
        await prisma.charge.createMany({ data: charges });
    }

    async function checkFakeDataCount({ prisma, factor }: { prisma: PrismaClient; factor: number }) {
        // User2 and user3 share a space so they will find other user data
        const countExpected = length * factor;
        const countDashboards = await prisma.dashboard.aggregate({ _count: true });
        expect(countDashboards._count).toBe(countExpected);
        const countList = await prisma.list.aggregate({ _count: true });
        expect(countList._count).toBe(countExpected);
        const countProperty = await prisma.property.aggregate({ _count: true });
        expect(countProperty._count).toBe(countExpected);
        const countLease = await prisma.lease.aggregate({ _count: true });
        expect(countLease._count).toBe(countExpected);
        const countPayment = await prisma.payment.aggregate({ _count: true });
        expect(countPayment._count).toBe(countExpected);
        const countCharge = await prisma.charge.aggregate({ _count: true });
        expect(countCharge._count).toBe(countExpected);
    }
    const { user1, user2, user3 } = await getEnhancedPrisma();
    await writeFakeData(user1);
    await writeFakeData(user2);
    await writeFakeData(user3);
    await checkFakeDataCount({ prisma: user1.prisma, factor: 1 });
    await checkFakeDataCount({ prisma: user2.prisma, factor: 2 });
    await checkFakeDataCount({ prisma: user3.prisma, factor: 2 });
}, 60000);
