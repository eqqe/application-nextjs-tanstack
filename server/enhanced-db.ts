import { enhance } from '@zenstackhq/runtime';
import type { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from './auth';
import { prisma } from './db';
import { currentSpaceCookieName } from '@/components/layout/SpaceSwitch';

export function enhancePrisma({ userId, currentSpaceId }: { userId?: string; currentSpaceId?: string }) {
    let options;
    if (currentSpaceId) {
        options = { user: { id: userId, currentSpaceId } };
    } else if (userId) {
        options = { user: { id: userId } };
    } else {
        options = {};
    }
    // @ts-ignore
    return enhance(prisma, options);
}

export async function getEnhancedPrisma(ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) {
    const session = await getServerAuthSession(ctx);
    let currentSpaceId;
    if (session?.user) {
        const cookieName = currentSpaceCookieName(session.user.id);
        currentSpaceId = ctx.req.cookies[cookieName];
    }
    return enhancePrisma({ userId: session?.user.id, currentSpaceId });
}
