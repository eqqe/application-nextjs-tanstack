import { expect, test } from 'vitest';
import { getEnhancedPrisma } from '@/tests/mock/enhanced-prisma';
import {
    fakeCharge,
    fakeInCommonTenant,
    fakeLease,
    fakePayment,
    fakePerson,
    fakeProperty,
    fakeTenancyInCommon,
    generateData,
} from '@/lib/demo/fake';
import { PrismaClient } from '@zenstackhq/runtime/models';

test('Load a lot of data for 3 users', async () => {
    const { user1, user2, user3 } = await getEnhancedPrisma();
    // Make it fast when running locally, but check it does not timeout on CI with a lot of data
    const length = process.env.CI ? 4 : 1;
    async function writeFakeData({ prisma, currentSpace }: typeof user1) {
        const spaceId = currentSpace.id;
        for (const _ of Array.from({ length })) {
            const updateSpaceArgs = generateData({ length, spaceId });
            await prisma.space.update(updateSpaceArgs);
        }
    }

    async function checkFakeDataCount({ prisma, factor }: { prisma: PrismaClient; factor: number }) {
        // User2 and user3 share a space so they will find other user data
        const countProperty = await prisma.property.aggregate({ _count: true });
        expect(countProperty._count).toBe(length * length * factor);
        const countLease = await prisma.lease.aggregate({ _count: true });
        expect(countLease._count).toBe(length * length * length * factor);
        const countPayment = await prisma.payment.aggregate({ _count: true });
        expect(countPayment._count).toBe(length * length * length * length * factor);
        const countCharge = await prisma.charge.aggregate({ _count: true });
        expect(countCharge._count).toBe(length * length * length * factor);
        const countTenanciesInCommon = await prisma.propertyTenancyInCommon.aggregate({ _count: true });
        expect(countTenanciesInCommon._count).toBe(length * length * length * factor);
        const countInCommonTenants = await prisma.propertyTenancyInCommonTenant.aggregate({ _count: true });
        expect(countInCommonTenants._count).toBe(length * length * length * length * factor);
        const countPerson = await prisma.person.aggregate({ _count: true });
        expect(countPerson._count).toBe(length * length * length * length * factor);
    }
    await writeFakeData(user1);
    await writeFakeData(user2);
    await writeFakeData(user3);
    await checkFakeDataCount({ prisma: user1.prisma, factor: 1 });
    await checkFakeDataCount({ prisma: user2.prisma, factor: 2 });
    await checkFakeDataCount({ prisma: user3.prisma, factor: 2 });
}, 30000);
